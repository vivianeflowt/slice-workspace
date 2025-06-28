import { describe, it, expect } from 'vitest';
import { parseQueryToMap, mapToQueryString } from '../query-parser';
// Helper para comparar Map com objeto
function mapToObj(map: Map<string, any>) {
  return Object.fromEntries(map.entries());
}

describe('parseQueryToMap e mapToQueryString (simetria total)', () => {
  it('simples: stringifica e parseia corretamente', () => {
    const obj = { a: '1', b: 'x' };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual(obj);
  });

  it('arrays: ida e volta', () => {
    const obj = { a: ['1', '2'], b: '3' };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    // Comparar com valor percent-encoded
    expect(str).toContain('a%5B0%5D=1');
    expect(str).toContain('a%5B1%5D=2');
    expect(str).toContain('b=3');
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual(obj);
  });

  it('objetos aninhados: ida e volta', () => {
    const obj = { user: { name: 'Ana', age: '30' }, active: 'true' };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    expect(str).toContain('user%5Bname%5D=Ana'); // user[name]=Ana
    expect(str).toContain('user%5Bage%5D=30'); // user[age]=30
    expect(str).toContain('active=true');
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual(obj);
  });

  it('encoding especial: ida e volta', () => {
    const obj = { q: 'olá mundo', x: '1+1' };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    expect(str).toContain('q=ol%C3%A1%20mundo');
    expect(str).toContain('x=1%2B1');
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual(obj);
  });

  it('map vazio <-> string vazia', () => {
    const map = new Map();
    const str = mapToQueryString(map);
    expect(str).toBe('');
    const map2 = parseQueryToMap(str);
    expect(map2.size).toBe(0);
  });

  it('parse de string já no formato indices', () => {
    const str = 'a[0]=1&a[1]=2&b=3';
    const map = parseQueryToMap(str);
    expect(map.get('a')).toEqual(['1', '2']);
    expect(map.get('b')).toBe('3');
  });

  it('parse de objeto aninhado já stringificado', () => {
    const str = 'user[name]=Ana&user[age]=30&active=true';
    const map = parseQueryToMap(str);
    expect(map.get('user')).toEqual({ name: 'Ana', age: '30' });
    expect(map.get('active')).toBe('true');
  });

  it('round-trip: parse -> map -> string -> map mantém os dados', () => {
    const original = 'user[name]=Ana&user[age]=30&a[0]=1&a[1]=2&q=ol%C3%A1';
    const map = parseQueryToMap(original);
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual(mapToObj(map));
  });

  it('edge case: array vazio', () => {
    // O qs remove arrays vazios ao stringificar, então ida e volta resulta em {}
    const obj = { a: [] };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual({});
  });

  it('edge case: objeto aninhado vazio', () => {
    // O qs remove objetos vazios ao stringificar, então ida e volta resulta em {}
    const obj = { user: {} };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toEqual({});
  });
});

describe('casos avançados e edge cases', () => {
  it('lida com tipos mistos em query', () => {
    const obj = { a: 1, b: true, c: null, d: undefined, e: [1, 'x', false] };
    const map = new Map(Object.entries(obj));
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    // undefined e null são removidos pelo qs
    expect(mapToObj(map2)).toMatchObject({ a: '1', b: 'true', e: ['1', 'x', 'false'] });
  });

  it('lida com string inválida', () => {
    const str = 'a=%E0%A4%A'; // encoding inválido
    expect(() => parseQueryToMap(str)).not.toThrow();
  });

  it('lida com Map com tipos não-string', () => {
    const map = new Map<any, any>([
      [1, 'a'],
      [true, 'b'],
      [{}, 'c'],
    ]);
    const str = mapToQueryString(map as any);
    expect(typeof str).toBe('string');
  });

  it('round-trip com dados randômicos', () => {
    const obj = Array.from({ length: 10 }, (_, i) => ({ [`k${i}`]: Math.random() }));
    const merged = Object.assign({}, ...obj);
    const stringified = Object.fromEntries(
      Object.entries(merged).map(([k, v]) => [k, v.toString()]),
    );
    const map = new Map(Object.entries(merged));
    const str = mapToQueryString(map);
    const map2 = parseQueryToMap(str);
    expect(mapToObj(map2)).toMatchObject(stringified);
  });
});
