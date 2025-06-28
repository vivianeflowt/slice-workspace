import cookieParser from 'cookie-parser';
import { RequestHandler } from 'express';

/**
 * Middleware para parsear cookies das requisições HTTP.
 */
const cookieParserMiddleware: RequestHandler = cookieParser();

export default cookieParserMiddleware;
