import { Request, Response } from 'express';
import { HTTP_STATUS_BAD_REQUEST } from '../../utils/http-status';
import { OpenaiProvider } from '../../providers/ai/openai/OpenAIProvider';
import { DeepseekProvider } from '../../providers/ai/deepseek/DeepSeekProvider';
import { OllamaProvider } from '../../providers/ai/ollama/OllamaProvider';
import { PerplexityProvider } from '../../providers/ai/perplexity/PerplexityProvider';
import { CustomProvider } from '../../providers/ai/custom/CustomProvider';
import { AvailableModels, ModelInfo, normalizeModelKey } from '../../lib/models/AvailableModels';
import axios from 'axios';
import {
  OLLAMA_BASE_URL,
  HEADER_DISABLE_CACHE,
  ENV_DISABLE_CACHE,
} from '../../constants/constants';
import logger from '../../lib/logger/logger';
import crypto from 'crypto';
import NodeCache from 'node-cache';

type ProviderName = 'openai' | 'deepseek' | 'ollama' | 'perplexity' | 'custom';

// ProviderName tipado para garantir consistência
const providerClassMap: Record<ProviderName, any> = {
  openai: OpenaiProvider,
  deepseek: DeepseekProvider,
  ollama: OllamaProvider,
  perplexity: PerplexityProvider,
  custom: CustomProvider,
};

// Resolve provider e model usando AvailableModels
function resolveModelAndProvider({ provider, model }: { provider?: string; model?: string }) {
  const providerName = provider?.trim().toLowerCase() as ProviderName | undefined;
  const modelName = model?.trim();

  // Log para depuração
  console.log(
    '[resolveModelAndProvider] provider recebido:',
    provider,
    '| normalizado:',
    providerName,
  );
  console.log('[resolveModelAndProvider] model recebido:', model, '| normalizado:', modelName);

  // Se um nome de modelo foi fornecido, ele DEVE existir no nosso dicionário.
  let modelInfo: ModelInfo | undefined;
  if (modelName) {
    modelInfo = AvailableModels.getModelInfo(modelName);
    if (!modelInfo) {
      const validModels = AvailableModels.getAllModels()
        .map((m) => `"${m.model}" (provider: ${m.provider})`)
        .join(', ');
      throw new Error(
        `Modelo não encontrado no dicionário.\n` +
          `  - Recebido: '${modelName}' (normalizado para: '${normalizeModelKey(modelName)}')\n` +
          `  - Dica: Consulte /api/models para a lista completa de modelos válidos.\n` +
          `  - Exemplo de payload: {"provider": "openai", "model": "gpt-4o", ... }`,
      );
    }
  }

  // Cenário 1: Provider e Modelo fornecidos. Eles devem ser compatíveis.
  if (providerName && modelInfo) {
    if (modelInfo.provider !== providerName) {
      throw new Error(
        `Conflito de provider.\n` +
          `  - O modelo '${modelName}' pertence ao provider '${modelInfo.provider}', mas você especificou o provider '${providerName}'.\n` +
          `  - Dica: Corrija o nome do provider ou remova-o do payload para que seja inferido automaticamente.`,
      );
    }
    // Ambos são válidos e compatíveis
    return { provider: providerName, model: modelInfo.model, metadata: { model: modelInfo.model } };
  }

  // Cenário 2: Apenas o Modelo foi fornecido. Inferimos o provider.
  if (modelInfo) {
    return {
      provider: modelInfo.provider,
      model: modelInfo.model,
      metadata: { model: modelInfo.model },
    };
  }

  // Cenário 3: Apenas o Provider foi fornecido. Usamos o primeiro modelo padrão dele.
  if (providerName) {
    const modelsForProvider = AvailableModels.getModelsByProvider(providerName);
    if (modelsForProvider.length === 0) {
      throw new Error(`Nenhum modelo disponível para o provider '${providerName}'.`);
    }
    const firstModel = modelsForProvider[0];
    return {
      provider: providerName,
      model: firstModel.model,
      metadata: { model: firstModel.model },
    };
  }

  // Cenário 4: Nenhum foi fornecido.
  throw new Error('Payload inválido. Você deve fornecer ao menos um "model" ou "provider".');
}

// Instancia o provider de IA conforme o nome
function instantiateProvider(providerName: ProviderName) {
  const ProviderClass = providerClassMap[providerName];
  if (!ProviderClass) throw new Error(`Provider '${providerName}' not found.`);
  return new ProviderClass();
}

// Cache simples em memória (pode ser substituído por Redis)
const CACHE_TTL_SECONDS = 300; // 5 minutos
const CACHE_MAX_KEYS = 500; // Limite máximo de chaves no cache
const chatResponseCache = new NodeCache({
  stdTTL: CACHE_TTL_SECONDS,
  checkperiod: 120,
  maxKeys: CACHE_MAX_KEYS,
});

// Loga a execução para debug/performance
function logExecution(label: string, startTime: number) {
  console.log(`[ChatController] ${label} duration: ${Date.now() - startTime}ms`);
}

let lastOllamaModel: string | null = null;

function logInfo(msg: string, meta?: any) {
  logger.info(`[ChatController] ${msg}`, meta || {});
}
function logWarn(msg: string, meta?: any) {
  logger.warn(`[ChatController] ${msg}`, meta || {});
}
function logError(msg: string, meta?: any) {
  logger.error(`[ChatController] ${msg}`, meta || {});
}

// Valida o payload do chat
function validateChatPayload(payload: Record<string, any>) {
  if (!payload || typeof payload !== 'object') throw new Error('Payload ausente ou inválido.');
  if (!payload.provider && !payload.model)
    throw new Error('Payload inválido: forneça ao menos um "model" ou "provider".');
  if (!payload.messages || !Array.isArray(payload.messages) || payload.messages.length === 0) {
    throw new Error('Payload inválido: "messages" é obrigatório e deve ser um array não vazio.');
  }
  payload.messages.forEach((msg: any, idx: number) => {
    if (
      !msg ||
      typeof msg !== 'object' ||
      typeof msg.role !== 'string' ||
      typeof msg.content !== 'string'
    ) {
      throw new Error(
        `Mensagem inválida no índice ${idx}: cada mensagem deve ter "role" e "content" string.`,
      );
    }
  });
}

export class ChatController {
  /**
   * Endpoint principal de chat IA. Resolve provider/model, instancia provider e executa geração.
   */
  async chat(req: Request, res: Response) {
    const startTime = Date.now();
    logInfo('Payload recebido', req.body);
    try {
      validateChatPayload(req.body);
      const { provider, model, messages, ...rest } = req.body;
      // Resolve provider/model
      const { provider: selectedProvider, model: selectedModel } = resolveModelAndProvider({
        provider,
        model,
      });
      // Cache: hash do input
      const disableCacheHeader = req.headers[HEADER_DISABLE_CACHE] === 'true';
      const disableCacheEnv = process.env[ENV_DISABLE_CACHE] === 'true';
      const disableCache = disableCacheHeader || disableCacheEnv;
      const cacheKey = crypto
        .createHash('sha256')
        .update(
          JSON.stringify({ provider: selectedProvider, model: selectedModel, messages, ...rest }),
        )
        .digest('hex');
      if (!disableCache && chatResponseCache.has(cacheKey)) {
        logInfo('Resposta retornada do cache', { cacheKey });
        logExecution('Request (cache)', startTime);
        return res.json({ result: chatResponseCache.get(cacheKey), cache: true });
      }
      // Instancia o provider correto
      const aiProviderInstance = instantiateProvider(selectedProvider as ProviderName);
      const aiPayload = {
        provider: selectedProvider,
        model: selectedModel,
        messages,
        ...rest,
      };
      let aiResult: string;
      try {
        aiResult = await aiProviderInstance.generate(aiPayload);
      } catch (err: any) {
        logError('Erro ao gerar resposta IA', {
          err,
          provider: selectedProvider,
          model: selectedModel,
        });
        if (err?.response) {
          // Erro do provider (ex: HTTP 4xx/5xx)
          return res
            .status(err.response.status || 502)
            .json({ error: err.response.data || err.message });
        }
        // Erro de payload/modelo
        return res.status(422).json({ error: err instanceof Error ? err.message : String(err) });
      }
      if (!disableCache && aiResult) {
        chatResponseCache.set(cacheKey, aiResult);
      }
      logExecution('Request', startTime);
      return res.json({ result: aiResult });
    } catch (error: any) {
      logExecution('Error', startTime);
      logError('Erro geral no ChatController', { error });
      if (!res.headersSent) {
        // Diferencia erro de validação de payload
        if (error?.message && error.message.includes('Payload')) {
          return res.status(400).json({ error: error.message });
        }
        // Erro inesperado
        return res
          .status(500)
          .json({ error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
}
