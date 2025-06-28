import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as jsonUtil from '../json';
import { z } from 'zod';

// Mock fs para evitar I/O real
vi.mock('fs-extra', () => ({
  readFileSync: vi.fn(() => '{"a":1}'),
  writeFileSync: vi.fn(),
}));

const {
  jsonParse, jsonStringify, jsonReadFile, jsonWriteFile, jsonValidate,
  jsonMerge, jsonDiff, jsonGet, jsonSet, jsonFilter, jsonMap,
  jsonPick, jsonOmit, jsonIsValid, jsonIsEmpty
} = jsonUtil;

describe('jsonParse/jsonStringify', () => {
  it('faz roundtrip de objeto simples', () => {
    const obj = { a: 1, b: 'x' };
    const str = jsonStringify(obj);
    expect(jsonParse(str)).toEqual(obj);
  });
  it('lança erro em JSON inválido', () => {
    expect(() => jsonParse('{a:1}')).toThrow();
    expect(() => jsonParse('')).toThrow();
  });
  it('lança erro ao serializar valor não serializável', () => {
    expect(() => jsonStringify(() => {})).toThrow();
  });
});

describe('jsonReadFile/jsonWriteFile', () => {
  it('lê arquivo JSON válido', () => {
    expect(jsonReadFile('fake.json')).toEqual({ a: 1 });
  });
  it('escreve arquivo JSON sem erro', () => {
    expect(() => jsonWriteFile('fake.json', { b: 2 })).not.toThrow();
  });
  it('lança erro em path inválido', () => {
    expect(() => jsonReadFile('../forbidden.json')).toThrow();
    expect(() => jsonWriteFile('../forbidden.json', {})).toThrow();
  });
});

describe('jsonValidate', () => {
  const schema = z.object({ a: z.number() });
  it('valida objeto correto', () => {
    expect(jsonValidate(schema, { a: 1 })).toEqual({ a: 1 });
  });
  it('lança erro para objeto inválido', () => {
    expect(() => jsonValidate(schema, { a: 'x' })).toThrow();
  });
});

describe('jsonMerge/jsonDiff', () => {
  it('faz merge profundo', () => {
    const a = { x: 1, y: { z: 2 } } as any;
    const b = { y: { w: 3 } } as any;
    expect(jsonMerge(a, b)).toEqual({ x: 1, y: { z: 2, w: 3 } });
  });
  it('faz diff correto', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 1, y: 3, z: 4 };
    expect(jsonDiff(a, b)).toEqual({ y: 3, z: 4 });
  });
});

describe('jsonGet/jsonSet', () => {
  const obj = { a: { b: { c: 1 } } };
  it('get caminho válido', () => {
    expect(jsonGet('a.b.c', obj)).toBe(1);
  });
  it('set caminho válido', () => {
    expect(jsonSet('a.b.c', 2, obj)).toEqual({ a: { b: { c: 2 } } });
  });
  it('lança erro em path inválido', () => {
    expect(() => jsonGet('../x', obj)).toThrow();
    expect(() => jsonSet('../x', 1, obj)).toThrow();
  });
});

describe('jsonFilter/jsonMap', () => {
  it('filtra e mapeia arrays', () => {
    expect(jsonFilter((x: number) => x > 1, [1, 2, 3])).toEqual([2, 3]);
    expect(jsonMap((x: number) => x * 2, [1, 2])).toEqual([2, 4]);
  });
});

describe('jsonPick/jsonOmit', () => {
  const obj = { a: 1, b: 2, c: 3 };
  it('pick seleciona chaves', () => {
    expect(jsonPick(['a', 'c'], obj)).toEqual({ a: 1, c: 3 });
  });
  it('omit remove chaves', () => {
    expect(jsonOmit(['b'], obj)).toEqual({ a: 1, c: 3 });
  });
});

describe('jsonIsValid/jsonIsEmpty', () => {
  it('detecta objetos/arrays válidos', () => {
    expect(jsonIsValid({})).toBe(true);
    expect(jsonIsValid([])).toBe(true);
    expect(jsonIsValid('x')).toBe(false);
  });
  it('detecta vazio', () => {
    expect(jsonIsEmpty([])).toBe(true);
    expect(jsonIsEmpty({})).toBe(true);
    expect(jsonIsEmpty([1])).toBe(false);
    expect(jsonIsEmpty({ a: 1 })).toBe(false);
  });
});
