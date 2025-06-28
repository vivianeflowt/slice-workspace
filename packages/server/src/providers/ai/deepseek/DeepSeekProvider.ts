import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { AbstractAIProvider, GenerateOptionsSchema } from '../../../base/AbstractAIProvider';
import { DEEPSEEK_API_KEY } from '../../../constants';
import { getMaxResponseTokens } from '../../../utils/tokens';
import { DEEPSEEK_MODELS } from './DeepSeekModels';

dotenv.config();

const DeepseekProviderOptionsSchema = GenerateOptionsSchema.omit({
  model: true,
}).extend({
  model: z.enum(DEEPSEEK_MODELS).describe('Modelo DeepSeek a ser utilizado'),
});

export type DeepseekProviderOptions = z.infer<typeof DeepseekProviderOptionsSchema>;

export class DeepseekProvider extends AbstractAIProvider<DeepseekProviderOptions> {
  private readonly deepseek: OpenAI;
  private readonly NAME = 'deepseek';

  constructor() {
    super();
    if (!DEEPSEEK_API_KEY) {
      throw new Error(
        'A chave de API da DeepSeek (DEEPSEEK_API_KEY) não está configurada no ambiente.',
      );
    }
    this.deepseek = new OpenAI({
      apiKey: DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });
  }

  public get name() {
    return this.NAME;
  }

  public async generate(options: DeepseekProviderOptions): Promise<string> {
    await this.beforeGenerate(options);
    const parsedOptions = this.validateOptions(DeepseekProviderOptionsSchema, options);
    const { model, messages, temperature, maxTokens, topP } = parsedOptions;
    try {
      const response = await this.deepseek.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens || getMaxResponseTokens(messages.map((m) => m.content).join(' ')),
        top_p: topP,
      });
      const result = response.choices[0]?.message?.content ?? '';
      await this.afterGenerate(options, result);
      return result;
    } catch (error) {
      this.handleError(error, 'generate');
      return '';
    }
  }
}
