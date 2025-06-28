import { describe, it, expect, vi } from 'vitest';
import chatRouter from '../router';

// Mock do controller para evitar dependências
vi.mock('../controller', () => ({
  ChatController: vi.fn().mockImplementation(() => ({
    chat: vi.fn(),
  })),
}));

describe('Chat Router Unit Tests', () => {
  it('deve ter rota POST /completions configurada', () => {
    const rotas = chatRouter.stack.map((layer) => ({
      path: layer.route?.path,
      method: layer.route?.stack[0]?.method,
    }));

    const rotaCompletions = rotas.find((route) => route.path === '/completions');

    expect(rotaCompletions).toBeDefined();
    expect(rotaCompletions?.method).toBe('post');
  });

  it('deve exportar um Express Router válido', () => {
    expect(chatRouter).toBeDefined();
    expect(typeof chatRouter).toBe('function');
    expect(chatRouter.stack).toBeDefined();
  });

  it('deve ter exatamente uma rota configurada', () => {
    expect(chatRouter.stack).toHaveLength(1);
  });
});
