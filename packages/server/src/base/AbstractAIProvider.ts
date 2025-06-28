import { z } from 'zod';
import {
  DEFAULT_MODEL_MAX_TOKENS,
  DEFAULT_MODEL_MIN_TOKENS,
  DEFAULT_MODEL_TEMPERATURE,
} from '../constants/constants';

// Schema para uma única mensagem no array, alinhado com o padrão OpenAI
export const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export const GenerateOptionsSchema = z.object({
  provider: z
    .string()
    .describe('Nome do provedor de IA a ser utilizado. Exemplo: "openai", "anthropic", "ollama"'),
  model: z
    .string()
    .describe('Identificador do modelo de IA a ser utilizado. Exemplo: "gpt-4o", "llama3:8b"'),
  messages: z
    .array(MessageSchema)
    .min(1, 'O array de mensagens deve conter pelo menos uma mensagem.')
    .describe('Array de mensagens representando a conversa, seguindo o padrão da OpenAI.'),
  temperature: z
    .number()
    .min(0)
    .max(10)
    .default(DEFAULT_MODEL_TEMPERATURE)
    .describe(
      'Temperatura de amostragem (0 a 10). Valores mais altos tornam as respostas mais criativas e variadas; valores baixos tornam as respostas mais determinísticas.',
    ),
  maxTokens: z
    .number()
    .min(DEFAULT_MODEL_MIN_TOKENS)
    .max(DEFAULT_MODEL_MAX_TOKENS)
    .optional()
    .describe(
      'Número máximo de tokens (palavras/frases) que o modelo pode gerar na resposta. Útil para limitar o tamanho da saída.',
    ),
  topP: z
    .number()
    .optional()
    .describe(
      'Top-p (nucleus sampling): controla a diversidade da resposta. Valores próximos de 1.0 permitem maior variedade; valores menores restringem a escolha aos tokens mais prováveis.',
    ),
  description: z
    .string()
    .optional()
    .describe('Descrição livre do request, útil para rastreabilidade ou experimentos.'),
});

//  Enum de modelos de IA deve seguir sempre os mais baratos para o mais caro e uma documentacao simples no enum

export type GenericOptions = z.infer<typeof GenerateOptionsSchema>;

export abstract class AbstractAIProvider<TOptions = any> {
  constructor(...args: any[]) {
    //
  }

  public abstract get name(): string;
  public abstract generate(options: TOptions): Promise<string>;

  /**
   * Hook opcional executado antes do generate. Pode ser sobrescrito.
   */
  protected async beforeGenerate(_options: TOptions): Promise<void> {
    // Implementação opcional nos providers
  }

  /**
   * Hook opcional executado após o generate. Pode ser sobrescrito.
   */
  protected async afterGenerate(_options: TOptions, _result: string): Promise<void> {
    // Implementação opcional nos providers
  }

  /**
   * Validação centralizada dos options usando schema Zod.
   */
  protected validateOptions(schema: z.ZodTypeAny, options: any): TOptions {
    return schema.parse(options);
  }

  /**
   * Tratamento centralizado de erros.
   */
  protected handleError(error: unknown, context: string): never {
    console.error(`[${this.name}] Error in ${context}:`, error);
    throw new Error(
      `[${this.name}] ${context} failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
