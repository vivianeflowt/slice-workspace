import { describe, it, expect, vi } from 'vitest';
import * as yamlUtil from '../yaml';
import { z } from 'zod';

// Mock fs para evitar I/O real
vi.mock('fs-extra', () => ({
  readFileSync: vi.fn(() => 'a: 1'),
  writeFileSync: vi.fn(),
}));

const {
  yamlParse, yamlStringify, yamlReadFile, yamlWriteFile, yamlValidate,
  yamlMerge, yamlDiff, yamlGet, yamlSet, yamlFilter, yamlMap,
  yamlPick, yamlOmit, yamlIsValid, yamlIsEmpty
} = yamlUtil;

describe('yamlParse/yamlStringify', () => {
  it('faz roundtrip de objeto simples', () => {
    const obj = { a: 1, b: 'x' };
    const str = yamlStringify(obj);
    expect(yamlParse(str)).toEqual(obj);
  });
  it('lança erro em YAML inválido', () => {
    expect(() => yamlParse('a: [')).toThrow();
    expect(() => yamlParse('')).toThrow();
  });
});

describe('yamlReadFile/yamlWriteFile', () => {
  it('lê arquivo YAML válido', () => {
    expect(yamlReadFile('fake.yaml')).toEqual({ a: 1 });
  });
  it('escreve arquivo YAML sem erro', () => {
    expect(() => yamlWriteFile('fake.yaml', { b: 2 })).not.toThrow();
  });
  it('lança erro em path inválido', () => {
    expect(() => yamlReadFile('../forbidden.yaml')).toThrow();
    expect(() => yamlWriteFile('../forbidden.yaml', {})).toThrow();
  });
});

describe('yamlValidate', () => {
  const schema = z.object({ a: z.number() });
  it('valida objeto correto', () => {
    expect(yamlValidate(schema, { a: 1 })).toEqual({ a: 1 });
  });
  it('lança erro para objeto inválido', () => {
    expect(() => yamlValidate(schema, { a: 'x' })).toThrow();
  });
});

describe('yamlMerge/yamlDiff', () => {
  it('faz merge profundo', () => {
    const a = { x: 1, y: { z: 2 } } as any;
    const b = { y: { w: 3 } } as any;
    expect(yamlMerge(a, b)).toEqual({ x: 1, y: { z: 2, w: 3 } });
  });
  it('faz diff correto', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 1, y: 3, z: 4 };
    expect(yamlDiff(a, b)).toEqual({ y: 3, z: 4 });
  });
});

describe('yamlGet/yamlSet', () => {
  const obj = { a: { b: { c: 1 } } };
  it('get caminho válido', () => {
    expect(yamlGet('a.b.c', obj)).toBe(1);
  });
  it('set caminho válido', () => {
    expect(yamlSet('a.b.c', 2, obj)).toEqual({ a: { b: { c: 2 } } });
  });
  it('lança erro em path inválido', () => {
    expect(() => yamlGet('../x', obj)).toThrow();
    expect(() => yamlSet('../x', 1, obj)).toThrow();
  });
});

describe('yamlFilter/yamlMap', () => {
  it('filtra e mapeia arrays', () => {
    expect(yamlFilter((x: number) => x > 1, [1, 2, 3])).toEqual([2, 3]);
    expect(yamlMap((x: number) => x * 2, [1, 2])).toEqual([2, 4]);
  });
});

describe('yamlPick/yamlOmit', () => {
  const obj = { a: 1, b: 2, c: 3 };
  it('pick seleciona chaves', () => {
    expect(yamlPick(['a', 'c'], obj)).toEqual({ a: 1, c: 3 });
  });
  it('omit remove chaves', () => {
    expect(yamlOmit(['b'], obj)).toEqual({ a: 1, c: 3 });
  });
});

describe('yamlIsValid/yamlIsEmpty', () => {
  it('detecta objetos/arrays válidos', () => {
    expect(yamlIsValid({})).toBe(true);
    expect(yamlIsValid([])).toBe(true);
    expect(yamlIsValid('x')).toBe(false);
  });
  it('detecta vazio', () => {
    expect(yamlIsEmpty([])).toBe(true);
    expect(yamlIsEmpty({})).toBe(true);
    expect(yamlIsEmpty([1])).toBe(false);
    expect(yamlIsEmpty({ a: 1 })).toBe(false);
  });
});
