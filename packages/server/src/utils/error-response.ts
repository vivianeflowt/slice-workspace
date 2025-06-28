import { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export type ErrorMessage = string | string[];

export interface ErrorResponse {
  error: string; // nome do erro ou tipo, se for um erro de banco vai ser o nome do erro e status 500 porque nao houve tramento
  status?: StatusCodes;
  message?: string | string[];
  details?: any;
  timestamp?: string;
}

export function createErrorResponse(data: ErrorResponse) {
  const { error, status = StatusCodes.INTERNAL_SERVER_ERROR, message, details } = data;

  let reason = '';
  if (!message) {
    reason = getReasonPhrase(status);
  } else if (Array.isArray(message)) {
    reason = message.join(', ');
  } else {
    reason = message;
  }

  const response: ErrorResponse = {
    error,
    status,
    message,
    details,
    timestamp: new Date().toISOString(),
  };

  return response;
}
