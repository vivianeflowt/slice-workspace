import { describe, it, expect } from 'vitest';
import * as m from '../matchers';

describe('Matchers principais', () => {
  const options = ['Casa', 'casar', 'casa', 'CASA', 'carro', 'banana', 'café', 'CAFÉ', 'caminho'];

  it('exactMatch retorna exato ou normalizado', () => {
    expect(m.exactMatch('Casa', options)).toBe('Casa');
    expect(m.exactMatch('casa', options)).toBe('casa');
    expect(m.exactMatch('CASA', options)).toBe('CASA');
    expect(m.exactMatch('café', options)).toBe('café');
    expect(m.exactMatch('CAFÉ', options)).toBe('CAFÉ');
    expect(m.exactMatch('banana', options)).toBe('banana');
    expect(m.exactMatch('inexistente', options)).toBeUndefined();
  });

  it('startsWithMatch retorna prefixo', () => {
    expect(m.startsWithMatch('cas', options)).toBe('Casa');
    expect(m.startsWithMatch('cam', options)).toBe('caminho');
    expect(m.startsWithMatch('ban', options)).toBe('banana');
    expect(m.startsWithMatch('zzz', options)).toBeUndefined();
  });

  it('includesMatch retorna substring', () => {
    expect(m.includesMatch('rr', options)).toBe('carro');
    expect(m.includesMatch('fé', options)).toBe('café');
    expect(m.includesMatch('min', options)).toBe('caminho');
    expect(m.includesMatch('xxx', options)).toBeUndefined();
  });

  it('regexMatch retorna opções que batem', () => {
    expect(m.regexMatch(/casa/i, options)).toContain('Casa');
    expect(m.regexMatch(/carr/, options)).toContain('carro');
    expect(m.regexMatch(/banana/, options)).toEqual(['banana']);
  });

  it('bestFuzzyMatch retorna melhor aproximação', () => {
    expect(m.bestFuzzyMatch('casa', options)).toBeDefined();
    expect(m.bestFuzzyMatch('banan', options)).toBe('banana');
    expect(m.bestFuzzyMatch('cafee', options)).toBe('café');
    expect(m.bestFuzzyMatch('zzzz', options)).toBeUndefined();
  });

  it('bestFuzzyMatches retorna array de matches', () => {
    expect(m.bestFuzzyMatches('casa', options)).toContain('Casa');
    expect(m.bestFuzzyMatches('camin', options)).toContain('caminho');
    expect(m.bestFuzzyMatches('zzzz', options)).toEqual([]);
  });

  it('bestVectorApproximateMatches retorna topN', () => {
    const result = m.bestVectorApproximateMatches('casa', options, 3);
    expect(result.length).toBe(3);
    expect(result).toContain('Casa');
  });

  it('tokenSetRatioMatch lida com permutação de tokens', () => {
    const opts = ['João Silva', 'Silva João', 'Maria', 'Silva'];
    expect(m.tokenSetRatioMatch('Silva João', opts)).toContain('João Silva');
    expect(m.tokenSetRatioMatch('Maria', opts)).toContain('Maria');
  });

  it('getTopNExactMatches retorna N matches exatos', () => {
    expect(m.getTopNExactMatches('casa', options, 2).length).toBeLessThanOrEqual(2);
  });

  it('getTopNFuzzyMatches retorna N matches fuzzy', () => {
    expect(m.getTopNFuzzyMatches('casa', options, 2).length).toBeLessThanOrEqual(2);
  });

  it('matchValue funciona para todos os modos', () => {
    expect(m.matchValue('casa', options, { mode: 'strict' })).toBe('casa');
    expect(m.matchValue('casa', options, { mode: 'normalized' })).toBeDefined();
    expect(m.matchValue('casa', options, { mode: 'fuzzy' })).toBeDefined();
    expect(m.matchValue('Silva João', ['João Silva', 'Maria'], { mode: 'token-permutation' })).toBe('João Silva');
  });
});

describe('Matchers de pattern', () => {
  it('matchPattern funciona', () => {
    expect(m.matchPattern(/abc/, 'abc')).toBe(true);
    expect(m.matchPattern('abc', 'def')).toBe(false);
  });
  it('extractPattern extrai todos', () => {
    expect(m.extractPattern(/\d+/g, 'a1b22c333')).toEqual(['1', '22', '333']);
  });
  it('replacePattern substitui', () => {
    expect(m.replacePattern(/a/g, 'x', 'banana')).toBe('bxnxnx');
  });
  it('validatePattern e isPatternValid', () => {
    expect(m.validatePattern(/abc/)).toBe(true);
    expect(m.isPatternValid('abc')).toBe(true);
    expect(m.isPatternValid('[')).toBe(false);
  });
  it('normalizePattern retorna RegExp', () => {
    expect(m.normalizePattern('abc')).toBeInstanceOf(RegExp);
  });
  it('composePatterns/intersectPatterns/unionPatterns', () => {
    const c = m.composePatterns(['a', 'b']);
    expect('a'.match(c)).not.toBeNull();
    const i = m.intersectPatterns(['a', 'b']);
    expect('ab'.match(i)).not.toBeNull();
    const u = m.unionPatterns(['a', 'b']);
    expect('b'.match(u)).not.toBeNull();
  });
  it('differencePatterns/complementPattern', () => {
    const d = m.differencePatterns(['a', 'b'], ['b']);
    expect('a'.match(d)).not.toBeNull();
    const c = m.complementPattern('a');
    expect('b'.match(c)).not.toBeNull();
  });
  it('transformPattern aplica função', () => {
    const t = m.transformPattern('a', (r) => new RegExp(r.source + 'b'));
    expect('ab'.match(t)).not.toBeNull();
  });
  it('isPatternEmpty, patternTypeOf, clonePattern, equalsPattern, patternToString', () => {
    expect(m.isPatternEmpty('')).toBe(true);
    expect(m.patternTypeOf(/abc/)).toBe('RegExp');
    expect(m.clonePattern(/abc/g)).toBeInstanceOf(RegExp);
    expect(m.equalsPattern(/abc/g, /abc/g)).toBe(true);
    expect(typeof m.patternToString(/abc/)).toBe('string');
  });
  it('safeMatchPattern, safeExtractPattern, safeReplacePattern', () => {
    expect(m.safeMatchPattern('(', 'abc')).toBe(false);
    expect(m.safeExtractPattern('(', 'abc')).toEqual([]);
    expect(m.safeReplacePattern('(', 'x', 'abc')).toBe('abc');
  });
});
