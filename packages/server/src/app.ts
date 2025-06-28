import dotenv from 'dotenv';
import express, { Application } from 'express';
import { DEFAULT_SERVER_PORT, GLOBAL_API_PREFIX, MAX_REQUEST_SIZE } from './constants/constants';
import cookieParserMiddleware from './middlewares/cookie-parser';
import corsMiddleware from './middlewares/cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import morganMiddleware from './middlewares/morgan';
import responseTimeMiddleware from './middlewares/responseTime';
import mainRouter from './routes/main';
import applyMiddlewares from './utils/apply-middlewares';

dotenv.config();

const app: Application = express();

app.use(express.json({ limit: MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_REQUEST_SIZE }));

applyMiddlewares(app as any)([
  //   connectTimeoutMiddleware,
  //   responseTimeMiddleware,
  corsMiddleware,
  cookieParserMiddleware,
  morganMiddleware,
]);

app.use(GLOBAL_API_PREFIX, mainRouter);
app.use(globalErrorHandler);

app.set('port', process.env['PORT'] || DEFAULT_SERVER_PORT);

export default app;
