// Função utilitária para lidar com middlewares/handlers assíncronos no Express
// Garante que erros sejam propagados corretamente para o error handler global
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler<T = any>(
  fn: (request: Request, response: Response, nextFunction: NextFunction) => Promise<T>,
): RequestHandler {
  return (request, response, nextFunction) => {
    Promise.resolve(fn(request, response, nextFunction)).catch(nextFunction);
  };
}
