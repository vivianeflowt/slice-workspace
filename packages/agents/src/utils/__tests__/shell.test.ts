import { describe, it, expect } from 'vitest';
import * as sh from '../shell';

describe('shellValidateCommand', () => {
  it('valida comandos seguros', () => {
    expect(sh.shellValidateCommand('ls -la')).toBe(true);
    expect(sh.shellValidateCommand('echo "ok"')).toBe(true);
  });
  it('rejeita comandos perigosos', () => {
    expect(sh.shellValidateCommand('rm -rf /')).toBe(false);
    expect(sh.shellValidateCommand('ls && whoami')).toBe(false);
    expect(sh.shellValidateCommand('cat file | grep x')).toBe(false);
  });
});

describe('shellValidatePath', () => {
  it('valida paths seguros', () => {
    expect(sh.shellValidatePath('/tmp/test.txt')).toBe(true);
    expect(sh.shellValidatePath('folder/file')).toBe(true);
  });
  it('rejeita paths perigosos', () => {
    expect(sh.shellValidatePath('../etc/passwd')).toBe(false);
    expect(sh.shellValidatePath('/etc/shadow')).toBe(false);
    expect(sh.shellValidatePath('~/file')).toBe(false);
  });
});

describe('shellNormalizeCommand', () => {
  it('normaliza espaços', () => {
    expect(sh.shellNormalizeCommand('  ls    -la  ')).toBe('ls -la');
  });
});

describe('shellNormalizePath', () => {
  it('normaliza barras e espaços', () => {
    expect(sh.shellNormalizePath('  /tmp//folder/ ')).toBe('/tmp/folder');
    expect(sh.shellNormalizePath('folder/')).toBe('folder');
  });
});

describe('shellEscapeArgs', () => {
  it('escapa argumentos corretamente', () => {
    expect(sh.shellEscapeArgs(['a b', 'c'])).toBe("'a b' 'c'");
  });
});

describe('shellQuoteParse/shellQuoteJoin', () => {
  it('parse e join de argumentos', () => {
    const args = ['ls', '-la', 'file name'];
    const joined = sh.shellQuoteJoin(args);
    expect(Array.isArray(sh.shellQuoteParse(joined))).toBe(true);
    expect(sh.shellQuoteParse(joined)).toContain('file name');
  });
});

describe('parseOllamaShow', () => {
  it('parseia saída de modelo ollama', () => {
    const output = 'name: my-model\ntags: tag1, tag2\nsize: 123MB';
    const parsed = sh.parseOllamaShow(output);
    expect(parsed.name).toBe('my-model');
    expect(parsed.tags).toBe('tag1, tag2');
    expect(parsed.size).toBe('123MB');
  });
});

describe('shellParseTableOutput', () => {
  it('parseia tabela simples', () => {
    const table = 'NAME AGE\nAlice 30\nBob 25';
    const arr = sh.shellParseTableOutput(table);
    expect(arr.length).toBe(2);
    expect(arr[0].NAME).toBe('Alice');
    expect(arr[1].AGE).toBe('25');
  });
});
