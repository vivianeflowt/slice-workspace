import { z } from 'zod';
import axios from 'axios';
import { AbstractAIProvider } from '../../../base/AbstractAIProvider';
import { GenerateOptionsSchema } from '../../../base/AbstractAIProvider';
import { getMaxResponseTokens } from '../../../utils/tokens';
import { CUSTOM_LLBM_SERVER_BASE_URL } from '../../../constants';
import { CUSTOM_MODELS } from './CustomModels';

const CustomProviderOptionsSchema = GenerateOptionsSchema.omit({
  model: true,
}).extend({
  model: z.enum(CUSTOM_MODELS).describe('Modelo Custom a ser utilizado'),
});

export type CustomProviderOptions = z.infer<typeof CustomProviderOptionsSchema>;

export class CustomProvider extends AbstractAIProvider<CustomProviderOptions> {
  private readonly NAME?: string;

  constructor(name?: string) {
    super();
    this.NAME = name;
  }

  public get name() {
    return this.NAME || 'custom';
  }

  public async generate(options: CustomProviderOptions): Promise<string> {
    await this.beforeGenerate(options);
    const parsedOptions = this.validateOptions(CustomProviderOptionsSchema, options);
    const { model, messages, temperature, maxTokens, topP } = parsedOptions;

    const requestData = {
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
      const response = await axios.post(
        `${CUSTOM_LLBM_SERVER_BASE_URL}/v1/chat/completions`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000, // 60s timeout para requisições robustas
        },
      );

      const result = response.data?.message?.content;
      if (!result) {
        throw new Error('Resposta vazia do modelo Custom - verifique se o servidor está funcionando corretamente.');
      }

      await this.afterGenerate(options, result);
      return result;
    } catch (error) {
      this.handleError(error, 'generate');
      return '';
    }
  }
}
