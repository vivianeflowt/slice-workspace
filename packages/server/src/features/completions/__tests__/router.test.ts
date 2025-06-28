import { describe, it, expect } from 'vitest';
import completionsRouter from '../router';

describe('Completions Router', () => {
  it('deve ter a rota /completions configurada', () => {
    const rotaCompletions = completionsRouter.stack.find(
      (layer) => layer.route?.path === '/completions',
    );

    expect(rotaCompletions).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(completionsRouter).toBeDefined();
    expect(typeof completionsRouter).toBe('function');
    expect(completionsRouter.stack).toBeDefined();
  });

  it('deve ter exatamente uma rota configurada', () => {
    expect(completionsRouter.stack).toHaveLength(1);
  });
});
