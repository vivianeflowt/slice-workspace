import { ApiConfiguration, BaseUrlApiConfiguration } from 'modelfusion';
import { z } from 'zod';

// Classe Facade para configuração e uso da API
export class ApiClient {
  private configuration: ApiConfiguration;
  private logger: Console;

  // Schema Zod para validação do payload de geração de texto
  private static GenerateTextSchema = z.object({
    prompt: z.string().min(1),
    maxTokens: z.number().int().positive().optional(),
    temperature: z.number().min(0).max(2).optional(),
    // ...outros campos
  });

  constructor(baseUrl = 'http://localhost:5000/api', logger: Console = console) {
    this.configuration = new BaseUrlApiConfiguration({ baseUrl });
    this.logger = logger;
  }

  getConfig() {
    return this.configuration;
  }

  async requestWithTiming<T>(
    fn: (config: ApiConfiguration) => Promise<T>
  ): Promise<{ result: T; ms: number }> {
    const start = Date.now();
    try {
      const result = await fn(this.configuration);
      const ms = Date.now() - start;
      this.logger.log(`[API] Request took ${ms}ms`);
      return { result, ms };
    } catch (error) {
      this.logger.error('[API] Request failed:', error);
      throw error;
    }
  }
}

// Instância padrão pronta para uso
export const api = new ApiClient();
