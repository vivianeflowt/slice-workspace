import { describe, it, expect } from 'vitest';
import { createErrorResponse } from '../error-response';

describe('createErrorResponse', () => {
  it('cria resposta de erro padrão', () => {
    const res = createErrorResponse({ error: 'TestError' });
    expect(res.error).toBe('TestError');
    expect(res.status).toBeDefined();
    expect(res.timestamp).toBeDefined();
  });

  it('cria resposta de erro com mensagem customizada', () => {
    const res = createErrorResponse({ error: 'TestError', message: 'Falha' });
    expect(res.message).toBe('Falha');
  });

  it('cria resposta de erro com array de mensagens', () => {
    const res = createErrorResponse({ error: 'TestError', message: ['A', 'B'] });
    expect(res.message).toEqual(['A', 'B']);
  });

  it('cria resposta de erro com detalhes', () => {
    const res = createErrorResponse({ error: 'TestError', details: { foo: 1 } });
    expect(res.details).toEqual({ foo: 1 });
  });
});
