import { removerComentariosEspacos } from '../sanitizers';

describe('removerComentariosEspacos', () => {
  it('remove comentários de linha', () => {
    const input = 'let a = 1; // comentário';
    const output = removerComentariosEspacos(input);
    expect(output).toBe('let a = 1;');
  });

  it('remove comentários de bloco', () => {
    const input = 'let a = 1; /* bloco */ let b = 2;';
    const output = removerComentariosEspacos(input);
    expect(output).toBe('let a = 1; let b = 2;');
  });

  it('remove múltiplos comentários e espaços', () => {
    const input = `  let a = 1; // linha\n/* bloco */ let b = 2;   // outro\nlet c = 3;  `;
    const output = removerComentariosEspacos(input);
    expect(output).toBe('let a = 1; let b = 2; let c = 3;');
  });

  it('lida com código sem comentários', () => {
    const input = 'let x = 42;';
    const output = removerComentariosEspacos(input);
    expect(output).toBe('let x = 42;');
  });

  it('lida com string vazia', () => {
    const input = '';
    const output = removerComentariosEspacos(input);
    expect(output).toBe('');
  });

  it('lida com apenas espaços e comentários', () => {
    const input = '   // só comentário\n/* bloco */   ';
    const output = removerComentariosEspacos(input);
    expect(output).toBe('');
  });
});
