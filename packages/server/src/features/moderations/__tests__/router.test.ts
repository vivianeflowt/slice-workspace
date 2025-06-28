import { describe, it, expect } from 'vitest';
import moderationsRouter from '../router';

describe('Moderations Router', () => {
  it('deve ter a rota /moderations configurada', () => {
    const rotaModerations = moderationsRouter.stack.find(
      (layer) => layer.route?.path === '/moderations',
    );

    expect(rotaModerations).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(moderationsRouter).toBeDefined();
    expect(typeof moderationsRouter).toBe('function');
    expect(moderationsRouter.stack).toBeDefined();
  });

  it('deve ter exatamente uma rota configurada', () => {
    expect(moderationsRouter.stack).toHaveLength(1);
  });
});
