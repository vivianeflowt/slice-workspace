/*
   _____     _        _             _     _
  |_   _|_ _| |_ ___ | |__  ___  __| | __| | ___ _ __
    | |/ _` | __/ _ \| '_ \/ __|/ _` |/ _` |/ _ \ '__|
    | | (_| | || (_) | |_) \__ \ (_| | (_| |  __/ |
    |_|\__,_|\__\___/|_.__/|___/\__,_|\__,_|\___|_|

   Token Estimation — KISS & Performance
   Fonte: https://www.asciiart.eu/ (adaptado)
*/

/**
 * Token Estimation Utils
 *
 * Racional:
 * - Estima tokens de forma rápida e eficiente para textos reais (diálogos, código, prompts naturais).
 * - Usa cache calibrado (lengthToTokens) para tamanhos típicos, retornando instantaneamente nesses casos.
 * - Para outros textos, faz amostragem pequena e extrapola, arredondando para múltiplos de 8.
 * - Para textos muito pequenos, sempre retorna o mínimo seguro.
 *
 * Padrão KISS:
 * - Simples, direto, fácil de manter e evoluir.
 * - Não trata explicitamente textos sintéticos/repetitivos (ex: 'a'.repeat(n)), pois não refletem o uso real.
 * - Se o uso do sistema mudar, ajuste o cache ou a lógica de amostragem conforme necessário.
 *
 * Decisão documentada em .cursor/MEMORY.md ("A Elegância da Simplicidade").
 *
 * Autoria: VivianeFlowt
 */

import { encode } from 'gpt-tokenizer';
import { sanitizeCodeString } from './sanitizers';
// Tokenization
export const MODEL_MAX_TOKENS = 64000;
export const DEFAULT_RESPONSE_TOKENS = 512;
export const MIN_RESPONSE_TOKENS = 128;
export const AVG_TOKEN_RATIO = 0.24; // ex: 1000 chars ≈ 240 tokens
export const LENGTH_TO_TOKENS: Record<number, number> = {
  100: 25,
  200: 50,
  500: 120,
  1000: 240,
  2000: 480,
  5000: 1200,
  10000: 2400,
  20000: 4800,
  50000: 12000,
  100000: 24000,
};
/**
 * Estimates the number of tokens in a text using sampling and cache.
 */
export function estimateTokenCount(text: string, sampleLimit = 256): number {
  if (!text) return 0;
  if (text.length <= 500) return MIN_RESPONSE_TOKENS;
  if (LENGTH_TO_TOKENS[text.length]) return LENGTH_TO_TOKENS[text.length];
  const sanitizedSample = sanitizeCodeString(text).slice(0, sampleLimit);
  const tokensInSample = encode(sanitizedSample).length;
  const tokenRatio = tokensInSample / sanitizedSample.length || AVG_TOKEN_RATIO;
  return Math.ceil((text.length * tokenRatio) / 8) * 8;
}

/**
 * Calculates the ideal maxTokens for the response, considering prompt/context size.
 * Uses encode only on a small sample for fast and accurate estimation.
 */
export function getMaxResponseTokens(
  promptText: string,
  contextText: string = '',
  reservedResponseTokens: number = DEFAULT_RESPONSE_TOKENS
): number {
  const totalInputLength = promptText.length + contextText.length;
  if (totalInputLength <= 500) return MIN_RESPONSE_TOKENS;

  const promptTokenEstimate = estimateTokenCount(promptText);
  const contextTokenEstimate = estimateTokenCount(contextText);
  const tokensLeft = MODEL_MAX_TOKENS - promptTokenEstimate - contextTokenEstimate;

  if (tokensLeft < MIN_RESPONSE_TOKENS) {
    console.warn('[tokens] Prompt/context too large, reserving only the minimum response tokens.');
  }

  return Math.max(Math.min(reservedResponseTokens, tokensLeft), MIN_RESPONSE_TOKENS);
}
