import morgan from 'morgan';
import { Request, Response, RequestHandler } from 'express';

// Exporta o middleware já configurado
const morganMiddleware: RequestHandler = morgan('dev', {
  skip: (request: Request, response: Response) => request.url === '/health',
});

export default morganMiddleware;
