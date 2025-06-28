import winston from 'winston';
import path from 'path';
import fs from 'fs';


const env = process.env.NODE_ENV || 'development';
const logDir = path.resolve(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logLevel = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'warn');
const isNoColor = process.env.NO_COLOR === 'true';
const useJson = process.env.LOG_JSON === 'true';

// Formato para console (colorido ou simples)
const consoleFormat = isNoColor
  ? winston.format.simple()
  : winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (stack) msg += `\n${stack}`;
        if (Object.keys(meta).length) msg += `\n${JSON.stringify(meta, null, 2)}`;
        return msg;
      }),
    );

// Formato JSON para integração com sistemas externos
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Formato padrão para arquivos (texto)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (stack) msg += `\n${stack}`;
    if (Object.keys(meta).length) msg += `\n${JSON.stringify(meta)}`;
    return msg;
  }),
);

const transports = [
  // Console
  new winston.transports.Console({
    format: useJson ? jsonFormat : consoleFormat,
    level: logLevel,
  }),
  // Arquivo geral (apenas warn e error)
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    level: 'warn',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    format: useJson ? jsonFormat : fileFormat,
    options: { flags: 'a' },
  }),
  // Arquivo de erros
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    format: useJson ? jsonFormat : fileFormat,
    options: { flags: 'a' },
  }),
  // Arquivo de avisos
  new winston.transports.File({
    filename: path.join(logDir, 'warn.log'),
    level: 'warn',
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    format: useJson ? jsonFormat : fileFormat,
    options: { flags: 'a' },
  }),
];

const logger = winston.createLogger({
  level: logLevel,
  format: useJson ? jsonFormat : fileFormat,
  transports,
  exitOnError: false,
});

// Função utilitária para logar contexto/objetos
(logger as any).withContext = function (
  level: string,
  message: string,
  context: Record<string, any>,
) {
  this.log(level, message, context);
};

// Funções de feedback visual desabilitadas
export function logProgress(items: string[], highlightIndex = -1) {
  /* noop */
}
export function logNotification(msg: string) {
  /* noop */
}
export function logEvent(msg: string) {
  /* noop */
}

Object.freeze(logger);
export default logger;
