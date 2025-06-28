import { distance as levenshteinDistance } from 'fastest-levenshtein';

/** Remove accents and lowercase the string */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/** Unique character set profile */
function uniqueCharSet(text: string): Set<string> {
  return new Set(normalize(text));
}

/** Jaccard similarity between two sets */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersectionCount = [...setA].filter((char) => setB.has(char)).length;
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 1 : intersectionCount / unionCount;
}

/** Character frequency vector for a-z */
function charFrequencyVector(text: string): number[] {
  const vector = Array(26).fill(0);
  for (const char of normalize(text)) {
    const index = char.charCodeAt(0) - 97;
    if (index >= 0 && index < 26) vector[index]++;
  }
  return vector;
}

/** Euclidean distance between two vectors */
function euclideanDistance(vectorA: number[], vectorB: number[]): number {
  return Math.sqrt(vectorA.reduce((sum, value, i) => sum + (value - vectorB[i]) ** 2, 0));
}

/** Exact match (case and accent insensitive) */
export function exactMatch<T extends string>(input: string, options: T[]): T | undefined {
  const exact = options.find((option) => option === input);
  if (exact) return exact;
  const normalizedInput = normalize(input);
  const normalizedMatches = options.filter((option) => normalize(option) === normalizedInput);
  if (!normalizedMatches.length) return undefined;
  if (normalizedMatches.length === 1) return normalizedMatches[0];
  return normalizedMatches.reduce((best, current) =>
    levenshteinDistance(input, current) < levenshteinDistance(input, best) ? current : best,
  );
}

/** Prefix match */
export function startsWithMatch<T extends string>(input: string, options: T[]): T | undefined {
  const normalizedInput = normalize(input);
  return options.find((option) => normalize(option).startsWith(normalizedInput));
}

/** Substring match */
export function includesMatch<T extends string>(input: string, options: T[]): T | undefined {
  const normalizedInput = normalize(input);
  return options.find((option) => normalize(option).includes(normalizedInput));
}

/** Regex match (case/accent-insensitive) */
export function regexMatch<T extends string>(pattern: RegExp, options: T[]): T[] {
  const flags = pattern.flags.includes('i') ? pattern.flags : pattern.flags + 'i';
  const normalizedPattern = new RegExp(pattern.source, flags);
  return options.filter((option) => normalizedPattern.test(option));
}

/** Fuzzy match using Levenshtein and optimizations */
export function bestFuzzyMatch<T extends string>(
  input: string,
  options: T[] | null | undefined,
  minSimilarity = 0.6,
): T | undefined {
  if (!input || !options?.length) return undefined;
  const exact = options.find((option) => option === input);
  if (exact) return exact;
  const normalizedInput = normalize(input);
  const normalizedMatches = options.filter((option) => normalize(option) === normalizedInput);
  if (normalizedMatches.length === 1) return normalizedMatches[0];
  if (normalizedMatches.length > 1) {
    return normalizedMatches.reduce((best, current) =>
      levenshteinDistance(input, current) < levenshteinDistance(input, best) ? current : best,
    );
  }
  return (
    options.find((option) => normalize(option).startsWith(normalizedInput)) ||
    fuzzyMatchCore(normalizedInput, options, minSimilarity) ||
    options.find((option) => normalize(option).includes(normalizedInput))
  );
}

/** Fuzzy match: returns all above threshold, sorted */
export function bestFuzzyMatches<T extends string>(
  input: string,
  options: T[] | null | undefined,
  minSimilarity = 0.6,
): T[] {
  if (!input || !options?.length) return [];
  const normalizedInput = normalize(input);
  const lengthRange = input.length <= 6 ? 0.5 : 0.3;
  const inputCharSet = uniqueCharSet(normalizedInput);
  let filteredOptions = options.filter((option) => {
    const optionLength = option.length;
    return (
      optionLength >= input.length * (1 - lengthRange) &&
      optionLength <= input.length * (1 + lengthRange) &&
      jaccardSimilarity(inputCharSet, uniqueCharSet(option)) >= 0.5
    );
  });
  if (!filteredOptions.length) filteredOptions = options;
  const scoredOptions = filteredOptions
    .map((option) => {
      const dist = levenshteinDistance(normalizedInput, normalize(option));
      const maxLen = Math.max(input.length, option.length);
      const similarity = maxLen === 0 ? 1 : 1 - dist / maxLen;
      return { option, similarity };
    })
    .filter(({ similarity }) => similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .map(({ option }) => option);
  if (scoredOptions.length) return scoredOptions;
  if (minSimilarity < 0.8) {
    return options.filter((option) => normalize(option).includes(normalizedInput));
  }
  return [];
}

/** Fuzzy match core (Levenshtein + filters) */
function fuzzyMatchCore<T extends string>(
  normalizedInput: string,
  options: T[],
  minSimilarity: number,
): T | undefined {
  const lengthRange = normalizedInput.length <= 6 ? 0.5 : 0.3;
  const inputCharSet = uniqueCharSet(normalizedInput);
  let filteredOptions = options.filter((option) => {
    const optionLength = option.length;
    return (
      optionLength >= normalizedInput.length * (1 - lengthRange) &&
      optionLength <= normalizedInput.length * (1 + lengthRange) &&
      jaccardSimilarity(inputCharSet, uniqueCharSet(option)) >= 0.5
    );
  });
  if (!filteredOptions.length) filteredOptions = options;
  let bestOption: T | undefined;
  let minDist = Infinity;
  for (const option of filteredOptions) {
    const dist = levenshteinDistance(normalizedInput, normalize(option));
    if (dist < minDist) {
      minDist = dist;
      bestOption = option;
    }
  }
  const maxLen = Math.max(normalizedInput.length, bestOption?.length ?? 0);
  const similarity = maxLen === 0 ? 1 : 1 - minDist / maxLen;
  return similarity >= minSimilarity ? bestOption : undefined;
}

/** Approximate vector search for large volumes */
export function bestVectorApproximateMatches<T extends string>(
  input: string,
  options: T[] | null | undefined,
  topN = 5,
): T[] {
  if (!input || !options?.length || topN <= 0) return [];
  const inputVector = charFrequencyVector(input);
  return options
    .map((option) => ({
      option,
      dist: euclideanDistance(inputVector, charFrequencyVector(option)),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, topN)
    .map(({ option }) => option);
}

/** Token set ratio (like fuzzywuzzy) — useful for inverted names, etc. */
export function tokenSetRatioMatch<T extends string>(
  input: string,
  options: T[],
  minRatio = 0.7,
): T[] {
  const inputTokens = normalize(input).split(/\s+/).filter(Boolean);
  return options.filter((option) => {
    const optionTokens = normalize(option).split(/\s+/).filter(Boolean);
    if (
      inputTokens.length === optionTokens.length &&
      inputTokens.every((token) => optionTokens.includes(token)) &&
      optionTokens.every((token) => inputTokens.includes(token))
    ) {
      return true;
    }
    const setInput = new Set(inputTokens);
    const setOption = new Set(optionTokens);
    const intersectionCount = [...setInput].filter((token) => setOption.has(token)).length;
    const unionCount = new Set([...setInput, ...setOption]).size;
    const ratio = unionCount === 0 ? 1 : intersectionCount / unionCount;
    return ratio >= minRatio;
  });
}

/** Returns the N closest exact (normalized) matches to the original input */
export function getTopNExactMatches<T extends string>(input: string, options: T[], n = 3): T[] {
  const normalizedInput = normalize(input);
  return options
    .filter((option) => normalize(option) === normalizedInput)
    .map((option) => ({ option, dist: levenshteinDistance(input, option) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map(({ option }) => option);
}

/** Returns the N closest fuzzy matches to the input (by similarity) */
export function getTopNFuzzyMatches<T extends string>(
  input: string,
  options: T[],
  n = 3,
  minSimilarity = 0.6,
): T[] {
  if (!input || !options?.length) return [];
  const normalizedInput = normalize(input);
  return options
    .map((option) => {
      const dist = levenshteinDistance(normalizedInput, normalize(option));
      const maxLen = Math.max(input.length, option.length);
      const similarity = maxLen === 0 ? 1 : 1 - dist / maxLen;
      return { option, similarity, dist };
    })
    .filter(({ similarity }) => similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity || a.dist - b.dist)
    .slice(0, n)
    .map(({ option }) => option);
}

export type MatchMode = 'strict' | 'normalized' | 'fuzzy' | 'token-permutation';

export interface MatchValueConfig {
  mode?: MatchMode;
  minSimilarity?: number;
  topN?: number;
  minTokenRatio?: number;
  fallbackTo?: MatchMode[];
}

/**
 * Unified API for versatile matching.
 * @param input search string
 * @param options list of options
 * @param config mode and sensitivity configuration
 */
export function matchValue<T extends string>(
  input: string,
  options: T[],
  config: MatchValueConfig = {},
): T | T[] | undefined {
  const {
    mode = 'fuzzy',
    minSimilarity = 0.6,
    topN = 1,
    minTokenRatio = 0.7,
    fallbackTo = ['normalized', 'fuzzy', 'token-permutation'],
  } = config;
  if (!input || !options?.length) return undefined;

  const tryFallback = (excludeMode: MatchMode) => {
    for (const fallbackMode of fallbackTo.filter((m) => m !== excludeMode)) {
      const result = matchValue(input, options, {
        ...config,
        mode: fallbackMode,
        fallbackTo: fallbackTo.filter((m) => m !== excludeMode),
      });
      if (result) return result;
    }
    return undefined;
  };

  if (mode === 'strict') {
    const found = options.find((option) => option === input);
    if (found) return found;
    return tryFallback('strict');
  }

  if (mode === 'normalized') {
    const normalizedInput = normalize(input);
    const matches = options.filter((option) => normalize(option) === normalizedInput);
    if (topN > 1) {
      return matches
        .map((option) => ({ option, dist: levenshteinDistance(input, option) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, topN)
        .map(({ option }) => option);
    }
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      return matches.reduce((best, current) =>
        levenshteinDistance(input, current) < levenshteinDistance(input, best) ? current : best,
      );
    }
    return tryFallback('normalized');
  }

  if (mode === 'fuzzy') {
    if (topN > 1) {
      const result = getTopNFuzzyMatches(input, options, topN, minSimilarity);
      if (result.length) return result;
    } else {
      const result = bestFuzzyMatch(input, options, minSimilarity);
      if (result) return result;
    }
    return tryFallback('fuzzy');
  }

  if (mode === 'token-permutation') {
    const result = tokenSetRatioMatch(input, options, minTokenRatio);
    if (topN > 1) return result.slice(0, topN);
    if (result.length) return result[0];
    return tryFallback('token-permutation');
  }

  return undefined;
}
