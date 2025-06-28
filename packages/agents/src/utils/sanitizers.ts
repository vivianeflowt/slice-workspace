/**
 * Remove comments and normalize whitespace from a code string.
 * @param codeString The input string containing code.
 * @returns The sanitized code string.
 * @throws {Error} If the input is not a string.
 */
export function sanitizeCodeString(codeString: string): string {
  if (typeof codeString !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remove line comments (//...)
  let sanitizedCode = codeString.replace(/\/\/.*$/gm, '');

  // Remove block comments (/* ... */)
  sanitizedCode = sanitizedCode.replace(/\/\*[\s\S]*?\*\//gm, '');

  // Normalize whitespace (multiple spaces, tabs, newlines to a single space) and trim
  return sanitizedCode.replace(/\s+/g, ' ').trim();
}
