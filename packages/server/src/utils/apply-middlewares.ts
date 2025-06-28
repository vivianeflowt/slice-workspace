import { Express, RequestHandler, ErrorRequestHandler } from 'express';

export default function applyMiddlewares(app: Express) {
  return (middlewares: Array<RequestHandler | ErrorRequestHandler>) => {
    middlewares.forEach((mw) => app.use(mw));
  };
}
