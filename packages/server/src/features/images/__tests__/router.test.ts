import { describe, it, expect } from 'vitest';
import imagesRouter from '../router';

describe('Images Router', () => {
  it('deve ter a rota /images/generations configurada', () => {
    const rotaGenerations = imagesRouter.stack.find(
      (layer) => layer.route?.path === '/images/generations',
    );

    expect(rotaGenerations).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(imagesRouter).toBeDefined();
    expect(typeof imagesRouter).toBe('function');
    expect(imagesRouter.stack).toBeDefined();
  });

  it('deve ter exatamente uma rota configurada', () => {
    expect(imagesRouter.stack).toHaveLength(1);
  });
});
