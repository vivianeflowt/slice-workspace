export function removerComentariosEspacos(str: string): string {
  // Remove comentários de linha (//...)
  let codigoLimpo = str.replace(/\/\/.*$/gm, '');
  // Remove comentários de bloco (/* ... */)
  codigoLimpo = codigoLimpo.replace(/\/\*[\s\S]*?\*\//gm, '');
  // Remove espaços em branco extras (múltiplos espaços, tabs, novas linhas no início/fim)
  codigoLimpo = codigoLimpo.trim().replace(/\s+/g, ' ');
  return codigoLimpo;
}
