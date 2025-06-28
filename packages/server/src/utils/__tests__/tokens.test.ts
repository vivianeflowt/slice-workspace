import { describe, it, expect, vi } from 'vitest';
import {
  getMaxResponseTokens,
  MODEL_MAX_TOKENS,
  DEFAULT_RESPONSE_TOKENS,
  MIN_RESPONSE_TOKENS,
} from '../tokens';

const shortText = 'Olá!';
const longText = 'A'.repeat(2000);
const hugeText = 'B'.repeat(MODEL_MAX_TOKENS * 4);
const unicodeText = 'Olá 👋🏼 你好 мир';
const emojiText = '😀'.repeat(100);
const realWorldText = `
  Olá, este é um texto real com várias palavras, pontuação, e até emojis! 😃🚀
  Ele serve para testar a estimativa de tokens em situações do mundo real.
`;

describe('getMaxResponseTokens', () => {
  it('returns minimum for small prompt/context', () => {
    expect(getMaxResponseTokens(shortText)).toBe(MIN_RESPONSE_TOKENS);
    expect(getMaxResponseTokens(shortText, shortText)).toBe(MIN_RESPONSE_TOKENS);
  });

  it('returns DEFAULT_RESPONSE_TOKENS for medium prompt', () => {
    expect(getMaxResponseTokens('texto médio '.repeat(50))).toBe(DEFAULT_RESPONSE_TOKENS);
  });

  it('reduces or keeps maxTokens for large prompt/context', () => {
    const result = getMaxResponseTokens(longText, longText);
    expect(result).toBeLessThanOrEqual(DEFAULT_RESPONSE_TOKENS);
    expect(result).toBeGreaterThanOrEqual(MIN_RESPONSE_TOKENS);
  });

  it('returns minimum for huge prompt/context', () => {
    expect(getMaxResponseTokens(hugeText, hugeText)).toBe(MIN_RESPONSE_TOKENS);
  });

  it('respects custom reservedTokens if above minimum', () => {
    expect(getMaxResponseTokens(shortText, '', 42)).toBeGreaterThanOrEqual(MIN_RESPONSE_TOKENS);
  });

  it('never returns less than minimum', () => {
    expect(getMaxResponseTokens(hugeText, hugeText, 1)).toBe(MIN_RESPONSE_TOKENS);
  });

  it('handles unicode and emojis', () => {
    expect(getMaxResponseTokens(unicodeText)).toBe(MIN_RESPONSE_TOKENS);
    expect(getMaxResponseTokens(emojiText)).toBe(MIN_RESPONSE_TOKENS);
  });

  it('handles real world text', () => {
    const result = getMaxResponseTokens(realWorldText);
    expect(result).toBeGreaterThanOrEqual(MIN_RESPONSE_TOKENS);
    expect(result).toBeLessThanOrEqual(DEFAULT_RESPONSE_TOKENS);
  });

  it('reservedTokens below minimum returns minimum', () => {
    expect(getMaxResponseTokens(shortText, '', 1)).toBe(MIN_RESPONSE_TOKENS);
  });

  it('almost hits token limit', () => {
    const nearLimitText = 'X'.repeat(MODEL_MAX_TOKENS - 100);
    expect(getMaxResponseTokens(nearLimitText, nearLimitText)).toBeGreaterThanOrEqual(
      MIN_RESPONSE_TOKENS,
    );
  });

  it('warns if prompt/context is too large', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getMaxResponseTokens(hugeText, hugeText);
    expect(warnSpy).toHaveBeenCalledWith(
      '[tokens] Prompt/context too large, reserving only the minimum response tokens.',
    );
    warnSpy.mockRestore();
  });
});
