import { describe, it, expect } from 'vitest';
import { humanizeTime } from '../humanize';

describe('humanizeTime', () => {
  it('retorna segundos corretamente', () => {
    expect(humanizeTime(5)).toBe('5s');
    expect(humanizeTime(1)).toBe('1s');
    expect(humanizeTime(59)).toBe('59s');
  });

  it('retorna minutos corretamente', () => {
    expect(humanizeTime(60)).toBe('1m');
    expect(humanizeTime(120)).toBe('2m');
    expect(humanizeTime(3599)).toBe('59m');
  });

  it('retorna horas corretamente', () => {
    expect(humanizeTime(3600)).toBe('1h');
    expect(humanizeTime(7200)).toBe('2h');
    expect(humanizeTime(3661)).toBe('1h'); // 1h, ignora minutos/segundos
  });
});
