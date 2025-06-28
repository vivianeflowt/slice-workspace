import responseTime from 'response-time';

/**
 * Middleware para adicionar header X-Response-Time em todas as respostas.
 */
const responseTimeMiddleware = responseTime();

export default responseTimeMiddleware;
