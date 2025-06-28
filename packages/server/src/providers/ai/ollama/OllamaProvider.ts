import { z } from 'zod';
import axios from 'axios';
import { AbstractAIProvider } from '../../../base/AbstractAIProvider';
import { GenerateOptionsSchema } from '../../../base/AbstractAIProvider';
import { OLLAMA_MODELS } from './OllamaModels';
import { getMaxResponseTokens } from '../../../utils/tokens';
import { OLLAMA_BASE_URL } from '../../../constants';


const OllamaProviderOptionsSchema = GenerateOptionsSchema.omit({
  model: true,
}).extend({
  model: z.enum(OLLAMA_MODELS).describe('Modelo Ollama a ser utilizado'),
});

export type OllamaProviderOptions = z.infer<typeof OllamaProviderOptionsSchema>;

export class OllamaProvider extends AbstractAIProvider<OllamaProviderOptions> {
  private readonly NAME?: string;

  constructor(name?: string) {
    super();
    this.NAME = name;
  }

  public get name() {
    return this.NAME || 'ollama';
  }

  private static lastLoadedModel: string | null = null;

  private async hotloadModel(model: string) {
    if (OllamaProvider.lastLoadedModel === model) return;
    try {
      await axios.post(
        `${OLLAMA_BASE_URL}/api/show`,
        { model },
        { headers: { 'Content-Type': 'application/json' }, timeout: 5000 },
      );
      OllamaProvider.lastLoadedModel = model;
    } catch (err) {
      // Apenas loga, não lança
      const msg = err instanceof Error ? err.message : String(err);
      // eslint-disable-next-line no-console
      console.warn(`[OllamaProvider] Hotload ignorou erro: ${msg}`);
    }
  }

  public async generate(options: OllamaProviderOptions): Promise<string> {
    await this.beforeGenerate(options);
    const parsedOptions = this.validateOptions(OllamaProviderOptionsSchema, options);
    const model = parsedOptions.model;
    const messages = parsedOptions.messages;
    const temperature = parsedOptions.temperature;
    const maxTokens = parsedOptions.maxTokens;
    const topP = parsedOptions.topP;
    await this.hotloadModel(model);
    const data = {
      model,
      messages,
      temperature,
      stream: false,
      options: {
        num_predict: maxTokens || getMaxResponseTokens(messages.map((m: any) => m.content).join(' ')),
        top_p: topP,
      },
    };
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000, // 30s timeout
      });
      const result = response.data?.message?.content;
      if (!result) {
        throw new Error('Não foi possível obter uma resposta do modelo Ollama.');
      }
      await this.afterGenerate(options, result);
      return result;
    } catch (error) {
      this.handleError(error, 'generate');
      return '';
    }
  }
}
