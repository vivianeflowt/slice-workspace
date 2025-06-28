import { ZodError, ZodSchema } from 'zod';

/**
 * Transforma um ZodError em uma estrutura de erro semântica e legível.
 * Em vez do objeto de erro complexo do Zod, retorna um array simples
 * de problemas de validação, focando no campo e na mensagem.
 *
 * @param error O ZodError a ser formatado.
 * @returns Um objeto contendo um array de erros de validação.
 */
export function formatZodError(error: ZodError) {
  const validation_errors = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  return {
    error: 'Validation Error',
    details: validation_errors,
  };
}

/**
 * Versão compatível com testes existentes que espera formato específico
 */
export function parseZodError(error: ZodError) {
  const details = error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  const message = details.map(d => d.message).join('; ');

  return {
    message,
    details,
  };
}

/**
 * Cria uma função de validação que valida dados contra um schema Zod
 * @param schema Schema Zod para validação
 * @returns Função que valida os dados e retorna o resultado ou lança erro
 */
export function validateSchema<T>(schema: ZodSchema<T>) {
  return async (data: unknown): Promise<T> => {
    return schema.parse(data);
  };
}

/**
 * Versão síncrona de validateSchema que lança erro diretamente
 * @param schema Schema Zod para validação
 * @returns Função que valida os dados sincronamente
 */
export function validateSchemaOrThrow<T>(schema: ZodSchema<T>) {
  return (data: unknown): T => {
    return schema.parse(data);
  };
}
