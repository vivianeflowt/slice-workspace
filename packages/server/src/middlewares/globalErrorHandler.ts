/**
 * Middleware global de erro para Express.
 * - Trata ZodError (validação) e responde no padrão ErrorResponse.
 * - Outros erros são tratados de forma padronizada.
 *
 * Uso: app.use(globalErrorHandler); (sempre por último)
 */

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_ERROR } from '../utils/http-status';
import { formatZodError } from '../utils/zod-error';

const globalErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  nextFunction: NextFunction,
) => {
  console.error('[GlobalErrorHandler]', error);

  if (error instanceof ZodError) {
    return response.status(HTTP_STATUS_BAD_REQUEST).json(formatZodError(error));
  }

  // Para outros tipos de erro, podemos adicionar mais `if` aqui (ex: Erro de Autenticação)

  return response
    .status(error.status || HTTP_STATUS_INTERNAL_ERROR)
    .json({ error: error.message || 'Internal Server Error' });
};

export default globalErrorHandler;
