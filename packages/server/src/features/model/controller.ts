// controller vai expelhar os metodos da classe AvailableModels

import { AvailableModels } from '../../lib/models/AvailableModels';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST } from '../../utils/http-status';
import { ModelInfo } from '../../lib/models/AvailableModels';

const providerQuerySchema = z.object({
  provider: z.enum(['deepseek', 'ollama', 'openai', 'perplexity'], {
    errorMap: () => ({
      message: 'Provider deve ser um dos seguintes: deepseek, ollama, openai, perplexity',
    }),
  }),
});

const modelParamSchema = z.object({
  model: z.string().min(1, 'Model é obrigatório'),
});

// Transforma o nosso ModelInfo no formato de resposta da API da OpenAI
function toApiResponse(modelInfo: ModelInfo) {
  return {
    id: modelInfo.model,
    object: 'model' as const,
    owned_by: modelInfo.provider,
    provider: modelInfo.provider, // Campo customizado para clareza
  };
}

// Controller para o slice Model
export class ModelController {
  /**
   * GET /models - Lista todos os modelos disponíveis
   */
  listAll = async (request: Request, response: Response, nextFunction: NextFunction) => {
    const modelos = AvailableModels.getAllModels();
    const data = modelos.map(toApiResponse);
    response.json({ object: 'list', data });
  };

  /**
   * GET /models?provider=... - Lista modelos de um provider
   */
  findByProvider = async (request: Request, response: Response, nextFunction: NextFunction) => {
    const { provider } = providerQuerySchema.parse(request.query);
    const modelos = AvailableModels.getModelsByProvider(provider);
    const data = modelos.map(toApiResponse);
    if (!data.length) {
      return response
        .status(HTTP_STATUS_NOT_FOUND)
        .json({ error: 'Nenhum modelo encontrado para o provider informado.' });
    }
    response.json({ object: 'list', data });
  };

  /**
   * GET /models?model=... - Busca um modelo específico
   */
  findByModel = async (request: Request, response: Response, nextFunction: NextFunction) => {
    const { model } = modelParamSchema.parse(request.query);
    const found = AvailableModels.getModelInfo(model);
    if (!found) {
      return response.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Modelo não encontrado.' });
    }
    response.json(toApiResponse(found));
  };
}
