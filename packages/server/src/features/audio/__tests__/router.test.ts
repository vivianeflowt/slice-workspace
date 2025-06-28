import { describe, it, expect } from 'vitest';
import audioRouter from '../router';

describe('Audio Router', () => {
  it('deve ter a rota /audio/transcriptions configurada', () => {
    const rotaTranscriptions = audioRouter.stack.find(
      (layer) => layer.route?.path === '/audio/transcriptions',
    );

    expect(rotaTranscriptions).toBeDefined();
  });

  it('deve ter a rota /audio/translations configurada', () => {
    const rotaTranslations = audioRouter.stack.find(
      (layer) => layer.route?.path === '/audio/translations',
    );

    expect(rotaTranslations).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(audioRouter).toBeDefined();
    expect(typeof audioRouter).toBe('function');
    expect(audioRouter.stack).toBeDefined();
  });

  it('deve ter exatamente duas rotas configuradas', () => {
    expect(audioRouter.stack).toHaveLength(2);
  });
});
