import { ZodError } from 'zod';

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
