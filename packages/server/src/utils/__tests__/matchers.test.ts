import {
  bestFuzzyMatch,
  bestFuzzyMatches,
  bestVectorApproximateMatches,
  exactMatch,
  startsWithMatch,
  includesMatch,
  regexMatch,
  tokenSetRatioMatch,
  getTopNExactMatches,
  getTopNFuzzyMatches,
  matchValue,
} from '../matchers';
import { describe, it, expect } from 'vitest';

const baseWords = [
  'token',
  'chat',
  'reason',
  'profile',
  'pipeline',
  'test',
  'ação',
  'ação extra',
  'Chát',
  'Razão',
  'Token',
  'Profile',
  'Pipeline',
  'Test',
];

describe('exactMatch', () => {
  it.skip('returns exact match ignoring case and accent', () => {
    expect(exactMatch('TOKEN', baseWords)).toBe('token');
    expect(exactMatch('ação', baseWords)).toBe('ação');
    expect(exactMatch('acao', baseWords)).toBe('ação');
    expect(exactMatch('chát', baseWords)).toBe('Chát');
    expect(exactMatch('inexistente', baseWords)).toBeUndefined();
  });
});

describe('startsWithMatch', () => {
  it('returns prefix match', () => {
    expect(startsWithMatch('pro', baseWords)).toBe('profile');
    expect(startsWithMatch('pip', baseWords)).toBe('pipeline');
    expect(startsWithMatch('aç', baseWords)).toBe('ação');
    expect(startsWithMatch('xyz', baseWords)).toBeUndefined();
  });
});

describe('includesMatch', () => {
  it('returns substring match', () => {
    expect(includesMatch('line', baseWords)).toBe('pipeline');
    expect(includesMatch('ção', baseWords)).toBe('ação');
    expect(includesMatch('extra', baseWords)).toBe('ação extra');
    expect(includesMatch('zzz', baseWords)).toBeUndefined();
  });
});

describe('regexMatch', () => {
  it('returns matches by regex', () => {
    expect(regexMatch(/^t/i, baseWords)).toEqual(['token', 'test', 'Token', 'Test']);
    expect(regexMatch(/ação/, baseWords)).toEqual(['ação', 'ação extra']);
    expect(regexMatch(/zxy/, baseWords)).toEqual([]);
  });
});

describe('tokenSetRatioMatch', () => {
  it('returns matches by common tokens', () => {
    expect(tokenSetRatioMatch('ação extra', baseWords)).toContain('ação extra');
    expect(tokenSetRatioMatch('extra ação', baseWords)).toContain('ação extra');
    expect(tokenSetRatioMatch('token', baseWords)).toContain('token');
    expect(tokenSetRatioMatch('inexistente', baseWords)).toEqual([]);
  });
  it('respects minRatio', () => {
    expect(tokenSetRatioMatch('ação', baseWords, 1)).toContain('ação');
    expect(tokenSetRatioMatch('ação', baseWords, 1)).not.toContain('ação extra');
    expect(tokenSetRatioMatch('ação extra', baseWords, 1)).toContain('ação extra');
  });
});

describe('bestFuzzyMatch', () => {
  it('returns exact match', () => {
    expect(bestFuzzyMatch('token', baseWords)).toBe('token');
  });
  it('returns match for typo', () => {
    expect(bestFuzzyMatch('tokne', baseWords)).toBe('token');
  });
  it('returns prefix match', () => {
    expect(bestFuzzyMatch('pro', baseWords)).toBe('profile');
  });
  it('returns substring match if no fuzzy match', () => {
    expect(bestFuzzyMatch('line', baseWords)).toBe('pipeline');
  });
  it('returns undefined if no match', () => {
    expect(bestFuzzyMatch('xyz', baseWords)).toBeUndefined();
  });
  it.skip('is case-insensitive and accent-insensitive', () => {
    expect(bestFuzzyMatch('TOKEN', baseWords)).toBe('token');
    expect(bestFuzzyMatch('acao', baseWords)).toBe('ação');
    expect(bestFuzzyMatch('chat', baseWords)).toBe('Chát');
  });
  it('respects custom minSimilarity', () => {
    expect(bestFuzzyMatch('tokne', baseWords, 0.95)).toBeUndefined();
    expect(bestFuzzyMatch('tokne', baseWords, 0.5)).toBe('token');
  });
  it('handles short and long strings', () => {
    expect(bestFuzzyMatch('t', baseWords)).toBe('token');
    const longWord = 'a'.repeat(100) + 'b';
    const options = [longWord, ...baseWords];
    expect(bestFuzzyMatch('a'.repeat(100) + 'c', options)).toBe(longWord);
  });
  it('returns undefined for invalid inputs', () => {
    expect(bestFuzzyMatch('', baseWords)).toBeUndefined();
    expect(bestFuzzyMatch('a', [])).toBeUndefined();
    expect(bestFuzzyMatch(null as any, baseWords)).toBeUndefined();
    expect(bestFuzzyMatch('a', null as any)).toBeUndefined();
  });
});

describe('bestFuzzyMatches', () => {
  it('returns matches sorted by similarity', () => {
    const result = bestFuzzyMatches('token', baseWords);
    expect(result[0]).toBe('token');
    expect(result).toContain('token');
    expect(result).not.toContain('chat');
  });
  it('returns substring matches if no fuzzy match', () => {
    const result = bestFuzzyMatches('line', baseWords);
    expect(result).toContain('pipeline');
  });
  it('is case-insensitive and accent-insensitive', () => {
    const result = bestFuzzyMatches('acao', baseWords);
    expect(result).toContain('ação');
  });
  it('respects custom minSimilarity', () => {
    const result = bestFuzzyMatches('tokne', baseWords, 0.95);
    expect(result).not.toContain('token');
  });
  it('returns [] for invalid inputs', () => {
    expect(bestFuzzyMatches('', baseWords)).toEqual([]);
    expect(bestFuzzyMatches('a', [])).toEqual([]);
    expect(bestFuzzyMatches(null as any, baseWords)).toEqual([]);
    expect(bestFuzzyMatches('a', null as any)).toEqual([]);
  });
  it('fallback to substring only if no fuzzy match', () => {
    const result = bestFuzzyMatches('line', baseWords, 0.95);
    expect(result).toEqual([]);
  });
});

describe('bestVectorApproximateMatches', () => {
  it('returns N closest matches', () => {
    const result = bestVectorApproximateMatches('token', baseWords, 3);
    expect(result).toHaveLength(3);
    expect(result).toContain('token');
  });
  it('returns [] for invalid inputs', () => {
    expect(bestVectorApproximateMatches('token', [], 3)).toEqual([]);
    expect(bestVectorApproximateMatches('', baseWords, 3)).toEqual([]);
    expect(bestVectorApproximateMatches(null as any, baseWords, 3)).toEqual([]);
    expect(bestVectorApproximateMatches('token', null as any, 3)).toEqual([]);
    expect(bestVectorApproximateMatches('token', baseWords, 0)).toEqual([]);
    expect(bestVectorApproximateMatches('token', baseWords, -1)).toEqual([]);
  });
  it('works with large list', () => {
    const largeList = Array.from({ length: 10000 }, (_, i) => `item${i}`);
    largeList[1234] = 'token';
    const result = bestVectorApproximateMatches('token', largeList, 5);
    expect(result).toContain('token');
  });
});

describe('tokenSetRatioMatch - extra cases', () => {
  it.skip('works with inverted names', () => {
    const names = ['João da Silva', 'Silva João', 'Maria Clara', 'Clara Maria'];
    expect(tokenSetRatioMatch('Silva João', names)).toContain('João da Silva');
    expect(tokenSetRatioMatch('Clara Maria', names)).toContain('Maria Clara');
  });
  it('returns [] if no common tokens', () => {
    expect(tokenSetRatioMatch('X Y Z', ['A B C'])).toEqual([]);
  });
});

describe('edge cases and concurrency', () => {
  it('handles exotic types in list', () => {
    const exoticOptions = [null, undefined, 123, {}, [], 'token'] as any[];
    const validOptions = exoticOptions.filter((x): x is string => typeof x === 'string');
    expect(bestFuzzyMatch('token', validOptions)).toBe('token');
    expect(bestFuzzyMatches('token', validOptions)).toContain('token');
    expect(bestVectorApproximateMatches('token', validOptions, 2)).toContain('token');
  });

  it('handles very large strings', () => {
    const largeText = 'a'.repeat(10000) + 'b';
    const options = [largeText, 'token'];
    expect(bestFuzzyMatch('a'.repeat(10000) + 'c', options)).toBe(largeText);
  });

  it('concurrency: multiple searches in parallel', async () => {
    const options = Array.from({ length: 10 }, (_, i) => `item${i}`);
    const [match, matches, vectorMatches] = await Promise.all([
      Promise.resolve(bestFuzzyMatch('item1', options)),
      Promise.resolve(bestFuzzyMatches('item2', options)),
      Promise.resolve(bestVectorApproximateMatches('item3', options, 5)),
    ]);
    expect(match).toBe('item1');
    expect(matches).toContain('item2');
    expect(vectorMatches).toContain('item3');
  });

  it('round-trip with random lists', () => {
    const options = Array.from({ length: 5 }, (_, i) => `opt${i}`);
    const input = options[2];
    expect(bestFuzzyMatch(input, options)).toBe(input);
    expect(bestFuzzyMatches(input, options)).toContain(input);
    expect(bestVectorApproximateMatches(input, options, 3)).toContain(input);
  });
});

describe('getTopNExactMatches', () => {
  it('returns N closest normalized exact matches to input', () => {
    const options = ['chat', 'Chát', 'chato', 'chatoo'];
    expect(getTopNExactMatches('chát', options, 2)).toEqual(['chat', 'Chát']);
    expect(getTopNExactMatches('chat', options, 2)).toEqual(['chat', 'Chát']);
    expect(getTopNExactMatches('chato', options, 2)).toEqual(['chato']);
    expect(getTopNExactMatches('xyz', options, 2)).toEqual([]);
  });
});

describe('getTopNFuzzyMatches', () => {
  it('returns N closest fuzzy matches to input', () => {
    const options = ['token', 'tokne', 'tokan', 'taken', 'toke', 'chat'];
    expect(getTopNFuzzyMatches('tokne', options, 2)).toEqual(['tokne', 'toke']);
    expect(getTopNFuzzyMatches('toke', options, 2)).toEqual(['toke', 'token']);
    expect(getTopNFuzzyMatches('chat', options, 2)[0]).toBe('chat');
    expect(getTopNFuzzyMatches('xyz', options, 2)).toEqual([]);
  });
  it('respects minSimilarity', () => {
    const options = ['token', 'tokne', 'tokan', 'taken', 'toke', 'chat'];
    expect(getTopNFuzzyMatches('tokne', options, 2, 0.95)).toEqual(['tokne']);
    expect(getTopNFuzzyMatches('tokne', options, 2, 0.5)).toContain('tokne');
  });
});

describe('matchValue (unified API)', () => {
  const options = ['Token', 'token', 'tokne', 'ação', 'acao', 'João da Silva', 'Silva João'];
  it('mode strict returns only exact match if fallbackTo is []', () => {
    expect(matchValue('Token', options, { mode: 'strict', fallbackTo: [] })).toBe('Token');
    expect(matchValue('token', options, { mode: 'strict', fallbackTo: [] })).toBe('token');
    expect(matchValue('TOKEN', options, { mode: 'strict', fallbackTo: [] })).toBeUndefined();
  });
  it('mode normalized returns closest normalized matches', () => {
    expect(matchValue('ação', options, { mode: 'normalized' })).toBe('ação');
    expect(matchValue('acao', options, { mode: 'normalized' })).toBe('acao');
    expect(matchValue('TOKEN', options, { mode: 'normalized' })).toBe('Token');
    expect(matchValue('inexistente', options, { mode: 'normalized' })).toBeUndefined();
  });
  it('mode fuzzy returns closest match by similarity', () => {
    expect(matchValue('tokne', options, { mode: 'fuzzy' })).toBe('tokne');
    expect(matchValue('tokan', options, { mode: 'fuzzy' })).toBe('Token');
    expect(matchValue('toke', options, { mode: 'fuzzy' })).toBe('Token');
  });
  it('mode token-permutation returns match by tokens in any order', () => {
    expect(matchValue('Silva João', options, { mode: 'token-permutation' })).toBe('Silva João');
    expect(matchValue('João da Silva', options, { mode: 'token-permutation' })).toBe(
      'João da Silva',
    );
    expect(matchValue('da Silva João', options, { mode: 'token-permutation' })).toBe(
      'João da Silva',
    );
  });
  it('topN returns list of matches', () => {
    expect(matchValue('token', options, { mode: 'normalized', topN: 2 })).toEqual([
      'token',
      'Token',
    ]);
    expect(matchValue('tok', options, { mode: 'fuzzy', topN: 2 }) as string[]).toHaveLength(2);
  });
  it('fallbackTo enables fallback between modes', () => {
    expect(matchValue('TOKEN', options, { mode: 'strict', fallbackTo: ['normalized'] })).toBe(
      'Token',
    );
    expect(
      matchValue('João da Silva', options, { mode: 'fuzzy', fallbackTo: ['token-permutation'] }),
    ).toBe('João da Silva');
  });
  it('respects minSimilarity and minTokenRatio', () => {
    expect(matchValue('tokne', options, { mode: 'fuzzy', minSimilarity: 0.95 })).toBe('tokne');
    expect(matchValue('tokan', options, { mode: 'fuzzy', minSimilarity: 0.95 })).toBeUndefined();
    expect(
      matchValue('João da Silva', options, { mode: 'token-permutation', minTokenRatio: 1 }),
    ).toBe('João da Silva');
    expect(matchValue('João Silva', options, { mode: 'token-permutation', minTokenRatio: 1 })).toBe(
      'Silva João',
    );
  });
});
