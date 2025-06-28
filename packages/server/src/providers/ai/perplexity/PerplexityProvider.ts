import dotenv from 'dotenv';
import { z } from 'zod';
import axios from 'axios';
import { OpenAI } from 'openai';

import { AbstractAIProvider, GenerateOptionsSchema } from '../../../base/AbstractAIProvider';
import { getMaxResponseTokens } from '../../../utils/tokens';
import { PERPLEXITY_API_KEY } from '../../../constants';
import { PERPLEXITY_MODELS } from './PerplexityModels';

dotenv.config();

const PerplexityProviderOptionsSchema = GenerateOptionsSchema.omit({
  model: true,
}).extend({
  model: z.enum(PERPLEXITY_MODELS).describe('Modelo Perplexity a ser utilizado'),
});

export type PerplexityProviderOptions = z.infer<typeof PerplexityProviderOptionsSchema>;

/**
 * Provider para Perplexity AI, usando API Key e endpoint oficial.
 * Modelos disponíveis: sonar-small-chat, sonar-medium-chat, sonar-large-chat, sonar-pro-chat.
 * Veja https://docs.perplexity.ai/api-reference/chat-completions
 */
export class PerplexityProvider extends AbstractAIProvider<PerplexityProviderOptions> {
  private readonly perplexity: OpenAI;
  private readonly NAME = 'perplexity';

  constructor() {
    super();
    if (!PERPLEXITY_API_KEY) {
      throw new Error(
        'A chave de API da Perplexity (PERPLEXITY_API_KEY) não está configurada no ambiente.',
      );
    }
    this.perplexity = new OpenAI({
      apiKey: PERPLEXITY_API_KEY,
      baseURL: 'https://api.perplexity.ai',
    });
  }

  public get name() {
    return this.NAME;
  }

  public async generate(options: PerplexityProviderOptions): Promise<string> {
    await this.beforeGenerate(options);
    const parsedOptions = this.validateOptions(PerplexityProviderOptionsSchema, options);
    const { model, messages, temperature, maxTokens, topP } = parsedOptions;
    try {
      const response = await this.perplexity.chat.completions.create({
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
