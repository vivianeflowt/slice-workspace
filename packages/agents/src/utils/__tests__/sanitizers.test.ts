import { describe, it, expect } from 'vitest';
import { sanitizeCodeString } from '../sanitizers';

describe('sanitizeCodeString', () => {
  it('remove comentários de linha', () => {
    expect(sanitizeCodeString('let a = 1; // comentário')).toBe('let a = 1;');
    expect(sanitizeCodeString('// só comentário')).toBe('');
  });

  it('remove comentários de bloco', () => {
    expect(sanitizeCodeString('let a = 1; /* bloco */')).toBe('let a = 1;');
    expect(sanitizeCodeString('/* bloco */')).toBe('');
    expect(sanitizeCodeString('let a = /* bloco */ 1;')).toBe('let a = 1;');
  });

  it('normaliza espaços, tabs e quebras de linha', () => {
    expect(sanitizeCodeString('let   a = 1;')).toBe('let a = 1;');
    expect(sanitizeCodeString('let a = 1;\n\n')).toBe('let a = 1;');
    expect(sanitizeCodeString('let a = 1;\t\t')).toBe('let a = 1;');
    expect(sanitizeCodeString('   let a = 1;   ')).toBe('let a = 1;');
  });

  it('remove comentários mistos e normaliza', () => {
    const code = `// início\nlet a = 1; /* bloco */ // fim\nlet b = 2;`;
    expect(sanitizeCodeString(code)).toBe('let a = 1; let b = 2;');
  });

  it('retorna string igual se não há comentários', () => {
    expect(sanitizeCodeString('let a = 1;')).toBe('let a = 1;');
  });

  it('retorna string vazia se só há comentários ou espaços', () => {
    expect(sanitizeCodeString('// comentário')).toBe('');
    expect(sanitizeCodeString('/* bloco */')).toBe('');
    expect(sanitizeCodeString('   ')).toBe('');
    expect(sanitizeCodeString('')).toBe('');
  });

  it('lança erro se input não for string', () => {
    // @ts-expect-error
    expect(() => sanitizeCodeString(123)).toThrow('Input must be a string');
    // @ts-expect-error
    expect(() => sanitizeCodeString(null)).toThrow('Input must be a string');
    // @ts-expect-error
    expect(() => sanitizeCodeString(undefined)).toThrow('Input must be a string');
  });
});
