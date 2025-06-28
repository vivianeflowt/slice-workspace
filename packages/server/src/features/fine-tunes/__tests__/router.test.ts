import { describe, it, expect } from 'vitest';
import fineTunesRouter from '../router';

describe('Fine-tunes Router', () => {
  it('deve ter rotas /fine-tunes configuradas', () => {
    const rotasFineTunes = fineTunesRouter.stack.filter(
      (layer) => layer.route?.path === '/fine-tunes',
    );

    expect(rotasFineTunes).toHaveLength(2); // POST e GET
  });

  it('deve ter a rota /fine-tunes/:fine_tune_id configurada', () => {
    const rotaFineTuneById = fineTunesRouter.stack.find(
      (layer) => layer.route?.path === '/fine-tunes/:fine_tune_id',
    );

    expect(rotaFineTuneById).toBeDefined();
  });

  it('deve ter a rota /fine-tunes/:fine_tune_id/events configurada', () => {
    const rotaEvents = fineTunesRouter.stack.find(
      (layer) => layer.route?.path === '/fine-tunes/:fine_tune_id/events',
    );

    expect(rotaEvents).toBeDefined();
  });

  it('deve ter a rota /fine-tunes/:fine_tune_id/cancel configurada', () => {
    const rotaCancel = fineTunesRouter.stack.find(
      (layer) => layer.route?.path === '/fine-tunes/:fine_tune_id/cancel',
    );

    expect(rotaCancel).toBeDefined();
  });

  it('deve exportar um Router válido', () => {
    expect(fineTunesRouter).toBeDefined();
    expect(typeof fineTunesRouter).toBe('function');
    expect(fineTunesRouter.stack).toBeDefined();
  });

  it('deve ter exatamente cinco rotas configuradas', () => {
    expect(fineTunesRouter.stack).toHaveLength(5);
  });
});
