import dotenv from 'dotenv';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { z } from 'zod';
import { AbstractAIProvider, GenerateOptionsSchema } from '../../../base/AbstractAIProvider';
import { OPENAI_API_KEY } from '../../../constants/constants';
import { getMaxResponseTokens } from '../../../utils/tokens';
import { OPENAI_MODELS } from './OpenAIModels';

dotenv.config();

const OpenaiOptionsProviderSchema = GenerateOptionsSchema.omit({
  model: true,
}).extend({
  model: z.enum(OPENAI_MODELS).describe('Modelo OpenAI a ser utilizado'),
});

export type OpenaiProviderOptions = z.infer<typeof OpenaiOptionsProviderSchema>;

/**
 * Provider para integração com OpenAI (chat/completion)
 * Implementa interface uniforme para geração de texto.
 */
export class OpenaiProvider extends AbstractAIProvider<OpenaiProviderOptions> {
  private readonly client: OpenAI;
  private readonly NAME?: string;

  constructor(name?: string) {
    super();
    if (!OPENAI_API_KEY) {
      throw new Error(
        'A chave de API da OpenAI (OPENAI_API_KEY) não está configurada no ambiente.',
      );
    }
    this.client = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.NAME = name;
  }

  public get name() {
    return this.NAME || 'openai';
  }

  public async generate(options: OpenaiProviderOptions): Promise<string> {
    await this.beforeGenerate(options);
    const parsedOptions = this.validateOptions(OpenaiOptionsProviderSchema, options);
    const { model, messages, temperature, maxTokens, topP } = parsedOptions;
    try {
      const response = await this.client.chat.completions.create({
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
