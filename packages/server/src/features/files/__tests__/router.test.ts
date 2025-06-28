import { describe, it, expect } from 'vitest';
import filesRouter from '../router';

describe('Files Router', () => {
  it('deve ter rotas /files configuradas', () => {
    const rotasFiles = filesRouter.stack.filter((layer) => layer.route?.path === '/files');

    expect(rotasFiles).toHaveLength(2); // POST e GET
  });

  it('deve ter rotas /files/:file_id configuradas', () => {
    const rotasFileById = filesRouter.stack.filter(
      (layer) => layer.route?.path === '/files/:file_id',
    );

    expect(rotasFileById).toHaveLength(2); // GET e DELETE
  });

  it('deve exportar um Router válido', () => {
    expect(filesRouter).toBeDefined();
    expect(typeof filesRouter).toBe('function');
    expect(filesRouter.stack).toBeDefined();
  });

  it('deve ter exatamente quatro rotas configuradas', () => {
    expect(filesRouter.stack).toHaveLength(4);
  });
});
