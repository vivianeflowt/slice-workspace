import { DEEPSEEK_MODELS, DeepseekModel } from '../../providers/ai/deepseek/DeepSeekModels';
import { OLLAMA_MODELS, OllamaModel } from '../../providers/ai/ollama/OllamaModels';
import { OPENAI_MODELS, OpenaiModel } from '../../providers/ai/openai/OpenAIModels';
import { PERPLEXITY_MODELS, PerplexityModel } from '../../providers/ai/perplexity/PerplexityModels';
import { CUSTOM_MODELS, CustomModel } from '../../providers/ai/custom/CustomModels';

export type AvailableModel = DeepseekModel | OllamaModel | OpenaiModel | PerplexityModel | CustomModel;

export interface ModelInfo {
  readonly provider: 'deepseek' | 'ollama' | 'openai' | 'perplexity' | 'custom';
  readonly model: string;
  readonly displayName: string;
}

export function normalizeModelKey(model: string): string {
  return model.toLowerCase().trim();
}

const models: Map<string, ModelInfo> = new Map();

// DeepSeek models
DEEPSEEK_MODELS.forEach((model) => {
  models.set(normalizeModelKey(model), {
    provider: 'deepseek',
    model,
    displayName: `DeepSeek ${model.replace('deepseek-', '').replace('-', ' ').toUpperCase()}`,
  });
});

// Ollama models
OLLAMA_MODELS.forEach((model) => {
  models.set(normalizeModelKey(model), {
    provider: 'ollama',
    model,
    displayName: model.charAt(0).toUpperCase() + model.slice(1),
  });
});

// OpenAI models
OPENAI_MODELS.forEach((model) => {
  models.set(normalizeModelKey(model), {
    provider: 'openai',
    model,
    displayName: `OpenAI ${model.toUpperCase()}`,
  });
});

// Perplexity models
PERPLEXITY_MODELS.forEach((model) => {
  models.set(normalizeModelKey(model), {
    provider: 'perplexity',
    model,
    displayName: `Perplexity ${model.replace('-', ' ').toUpperCase()}`,
  });
});

// Custom models
CUSTOM_MODELS.forEach((model) => {
  models.set(normalizeModelKey(model), {
    provider: 'custom',
    model,
    displayName: `Custom ${model.charAt(0).toUpperCase() + model.slice(1)}`,
  });
});

export class AvailableModels {
  static getAllModels(): ModelInfo[] {
    return Array.from(models.values());
  }

  static getModelsByProvider(provider: ModelInfo['provider']): ModelInfo[] {
    return this.getAllModels().filter((m) => m.provider === provider);
  }

  static getModelInfo(modelName: string): ModelInfo | undefined {
    const key = normalizeModelKey(modelName);
    if (!models.has(key)) {
      // Log para depuração
      console.error('[AvailableModels] Modelo não encontrado:', modelName, '| Normalizado:', key);
      console.error('[AvailableModels] Modelos disponíveis:', Array.from(models.keys()));
    }
    return models.get(key);
  }

  static isValidModel(modelName: string): boolean {
    return models.has(normalizeModelKey(modelName));
  }

  static getProviders(): ModelInfo['provider'][] {
    return ['deepseek', 'ollama', 'openai', 'perplexity', 'custom'];
  }

  static searchModels(query: string): ModelInfo[] {
    const normalizedQuery = query.toLowerCase().trim();
    return this.getAllModels().filter(
      (model) =>
        model.model.toLowerCase().includes(normalizedQuery) ||
        model.provider.toLowerCase().includes(normalizedQuery) ||
        model.displayName.toLowerCase().includes(normalizedQuery),
    );
  }
}
