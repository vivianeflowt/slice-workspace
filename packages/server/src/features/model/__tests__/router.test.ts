import { describe, it, expect, vi } from 'vitest';
import modelRouter from '../router';

// Mock do controller para evitar dependências
vi.mock('../controller', () => ({
  ModelController: vi.fn().mockImplementation(() => ({
    findByModel: vi.fn(),
    findByProvider: vi.fn(),
    listAll: vi.fn(),
  })),
}));

describe('Model Router', () => {
  it('deve ter a rota GET / configurada', () => {
    const rotaRoot = modelRouter.stack.find((layer) => layer.route?.path === '/');

    expect(rotaRoot).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(modelRouter).toBeDefined();
    expect(typeof modelRouter).toBe('function');
    expect(modelRouter.stack).toBeDefined();
  });

  it('deve ter exatamente uma rota configurada', () => {
    expect(modelRouter.stack).toHaveLength(1);
  });
});
