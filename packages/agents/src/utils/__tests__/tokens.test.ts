import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as tokensUtil from '../tokens';

// Mock do encode para garantir determinismo
vi.mock('gpt-tokenizer', () => ({
  encode: (text: string) => Array(text.length).fill(0), // 1 token por char
}));

const {
  getMaxResponseTokens,
  MODEL_MAX_TOKENS,
  DEFAULT_RESPONSE_TOKENS,
  MIN_RESPONSE_TOKENS,
  LENGTH_TO_TOKENS,
} = tokensUtil;

describe('getMaxResponseTokens', () => {
  it('retorna MIN_RESPONSE_TOKENS para textos pequenos', () => {
    expect(getMaxResponseTokens('a'.repeat(100))).toBe(MIN_RESPONSE_TOKENS);
    expect(getMaxResponseTokens('')).toBe(MIN_RESPONSE_TOKENS);
  });

  it('usa cache LENGTH_TO_TOKENS para tamanhos típicos', () => {
    for (const len of Object.keys(LENGTH_TO_TOKENS).map(Number)) {
      const text = 'a'.repeat(len);
      // Como prompt+context > 500, não cai no early return
      const tokens = getMaxResponseTokens(text);
      expect(typeof tokens).toBe('number');
      expect(tokens).toBeGreaterThan(0);
    }
  });

  it('considera contextText no cálculo', () => {
    const prompt = 'a'.repeat(1000);
    const context = 'b'.repeat(1000);
    const tokens = getMaxResponseTokens(prompt, context);
    expect(tokens).toBeLessThanOrEqual(DEFAULT_RESPONSE_TOKENS);
    expect(tokens).toBeGreaterThanOrEqual(MIN_RESPONSE_TOKENS);
  });

  it('respeita o limite inferior de MIN_RESPONSE_TOKENS', () => {
    // Força tokensLeft < MIN_RESPONSE_TOKENS
    const prompt = 'a'.repeat(63000);
    const context = 'b'.repeat(900);
    const tokens = getMaxResponseTokens(prompt, context);
    expect(tokens).toBe(MIN_RESPONSE_TOKENS);
  });

  it('respeita o limite superior de DEFAULT_RESPONSE_TOKENS', () => {
    const prompt = 'a'.repeat(1000);
    const context = '';
    const tokens = getMaxResponseTokens(prompt, context, DEFAULT_RESPONSE_TOKENS);
    expect(tokens).toBeLessThanOrEqual(DEFAULT_RESPONSE_TOKENS);
  });

  it('funciona com valores customizados de reservedResponseTokens', () => {
    const prompt = 'a'.repeat(1000);
    const context = '';
    const tokens = getMaxResponseTokens(prompt, context, 256);
    expect(tokens).toBeLessThanOrEqual(256);
    expect(tokens).toBeGreaterThanOrEqual(MIN_RESPONSE_TOKENS);
  });
});

describe('Constantes de tokens', () => {
  it('MODEL_MAX_TOKENS, DEFAULT_RESPONSE_TOKENS, MIN_RESPONSE_TOKENS são números positivos', () => {
    expect(MODEL_MAX_TOKENS).toBeGreaterThan(0);
    expect(DEFAULT_RESPONSE_TOKENS).toBeGreaterThan(0);
    expect(MIN_RESPONSE_TOKENS).toBeGreaterThan(0);
  });

  it('LENGTH_TO_TOKENS cobre tamanhos típicos', () => {
    expect(Object.keys(LENGTH_TO_TOKENS).length).toBeGreaterThan(0);
    for (const [len, tokens] of Object.entries(LENGTH_TO_TOKENS)) {
      expect(Number(len)).toBeGreaterThan(0);
      expect(tokens).toBeGreaterThan(0);
    }
  });
});
