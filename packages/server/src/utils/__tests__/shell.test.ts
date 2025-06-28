import * as shellUtils from '../shell';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

const tempDirectory = path.join(os.tmpdir(), `shell-utils-test-${Date.now()}-${Math.random()}`);

beforeEach(() => {
  if (!fs.existsSync(tempDirectory)) fs.mkdirSync(tempDirectory, { recursive: true });
});

afterEach(() => {
  if (fs.existsSync(tempDirectory)) fs.rmSync(tempDirectory, { recursive: true, force: true });
});

afterAll(() => {
  if (fs.existsSync(tempDirectory)) fs.rmSync(tempDirectory, { recursive: true, force: true });
});

describe('shellListDir', () => {
  it('should list files and directories', () => {
    const filePath = path.join(tempDirectory, 'file.txt');
    fs.writeFileSync(filePath, 'test');
    expect(shellUtils.shellListDir(tempDirectory)).toContain('file.txt');
  });
  it('should throw error for invalid directory', () => {
    expect(() => shellUtils.shellListDir(123 as any)).toThrow();
  });
});

describe('shellPwd', () => {
  it('should return current working directory', () => {
    expect(shellUtils.shellPwd()).toBe(process.cwd());
  });
});

describe('shellMkdir', () => {
  it('should create nested directories', () => {
    const nestedDir = path.join(tempDirectory, 'nested/a/b');
    shellUtils.shellMkdir(nestedDir);
    expect(fs.existsSync(nestedDir)).toBe(true);
  });
  it('should throw error for invalid directory', () => {
    expect(() => shellUtils.shellMkdir(123 as any)).toThrow();
  });
});

describe('shellChmod', () => {
  it('should change file permissions', () => {
    const filePath = path.join(tempDirectory, 'chmod.txt');
    fs.writeFileSync(filePath, 'x');
    shellUtils.shellChmod(0o600, filePath);
    expect(fs.statSync(filePath).mode & 0o777).toBe(0o600);
  });
  it('should throw error if path is not provided', () => {
    expect(() => shellUtils.shellChmod(0o600, '')).toThrow();
  });
});

describe('shellTouch', () => {
  it('should create an empty file', () => {
    const filePath = path.join(tempDirectory, 'touch.txt');
    shellUtils.shellTouch(filePath);
    expect(fs.existsSync(filePath)).toBe(true);
  });
  it('should not overwrite existing file', () => {
    const filePath = path.join(tempDirectory, 'touch2.txt');
    fs.writeFileSync(filePath, 'abc');
    shellUtils.shellTouch(filePath);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('abc');
  });
  it('should throw error if path is not provided', () => {
    expect(() => shellUtils.shellTouch('')).toThrow();
  });
});

describe('shellReadFile/shellWriteFile', () => {
  it('should write and read file content', () => {
    const filePath = path.join(tempDirectory, 'rw.txt');
    shellUtils.shellWriteFile(filePath, 'content');
    expect(shellUtils.shellReadFile(filePath)).toBe('content');
  });
  it('should throw error if path is not provided', () => {
    expect(() => shellUtils.shellReadFile('')).toThrow();
    expect(() => shellUtils.shellWriteFile('', 'x')).toThrow();
  });
  it('should return empty string for non-existent file', () => {
    expect(() => shellUtils.shellReadFile(path.join(tempDirectory, 'notfound.txt'))).toThrow();
  });
});

describe('shellRm', () => {
  it('should remove a file', () => {
    const filePath = path.join(tempDirectory, 'delete.txt');
    fs.writeFileSync(filePath, 'x');
    shellUtils.shellRm(filePath);
    expect(fs.existsSync(filePath)).toBe(false);
  });
  it('should remove a directory recursively', () => {
    const dirPath = path.join(tempDirectory, 'deleteDir');
    fs.mkdirSync(dirPath);
    shellUtils.shellRm(dirPath);
    expect(fs.existsSync(dirPath)).toBe(false);
  });
  it('should throw error if path is not provided', () => {
    expect(() => shellUtils.shellRm('')).toThrow();
  });
});

describe('shellGlob', () => {
  it('should list files by pattern', () => {
    const filePath = path.join(tempDirectory, 'glob.txt');
    fs.writeFileSync(filePath, 'x');
    const result = shellUtils.shellGlob(path.join(tempDirectory, '*.txt'));
    expect(result.some((f) => f.endsWith('glob.txt'))).toBe(true);
  });
  it('should return [] for empty pattern', () => {
    expect(shellUtils.shellGlob('')).toEqual([]);
  });
});

describe('shellNormalizeSpace', () => {
  it('should normalize spaces in command', () => {
    expect(shellUtils.shellNormalizeSpace('  ls    -l   /tmp  ')).toBe('ls -l /tmp');
  });
  it('should return empty string for non-string', () => {
    expect(shellUtils.shellNormalizeSpace(null as any)).toBe('');
  });
});

describe('shellEscapeArgs', () => {
  it('should escape arguments', () => {
    expect(shellUtils.shellEscapeArgs(['a b', 'c'])).toContain(' ');
  });
  it('should throw error if not array', () => {
    expect(() => shellUtils.shellEscapeArgs('abc' as any)).toThrow();
  });
});

describe('shellQuoteParse/shellQuoteJoin', () => {
  it('should parse and join arguments', () => {
    const args = ['ls', '-l', '/tmp'];
    const str = shellUtils.shellQuoteJoin(args);
    expect(shellUtils.shellQuoteParse(str)).toEqual(args);
  });
  it('should return [] for invalid input', () => {
    expect(shellUtils.shellQuoteParse(null as any)).toEqual([]);
  });
});

describe('shellParseTableOutput', () => {
  it('should parse simple table', () => {
    const text = 'A B\n1 2\n3 4';
    expect(shellUtils.shellParseTableOutput(text)).toEqual([
      { A: '1', B: '2' },
      { A: '3', B: '4' },
    ]);
  });
  it('should return [] for invalid input', () => {
    expect(shellUtils.shellParseTableOutput('')).toEqual([]);
  });
});

describe('shellWhich', () => {
  it('should return path of existing binary', () => {
    expect(shellUtils.shellWhich('ls')).toMatch(/ls/);
  });
  it('should return undefined for non-existent binary', () => {
    expect(shellUtils.shellWhich('nonexistent-binary-xyz')).toBeUndefined();
  });
});

describe('shellExecSyncRead', () => {
  it('should execute command and return output', () => {
    expect(shellUtils.shellExecSyncRead('echo shelltest')).toContain('shelltest');
  });
  it('should return empty string for invalid command', () => {
    expect(shellUtils.shellExecSyncRead('')).toBe('');
  });
});

describe('shellExecSync', () => {
  it('should execute command without error', () => {
    expect(() => shellUtils.shellExecSync('echo shelltest')).not.toThrow();
  });
  it('should throw error for invalid command', () => {
    expect(() => shellUtils.shellExecSync('')).toThrow();
  });
});

describe('shellExecSyncSilent', () => {
  it('should not throw error for invalid command', () => {
    expect(() => shellUtils.shellExecSyncSilent('')).not.toThrow();
  });
});

describe('shellExecAsyncRead', () => {
  it('should execute command and return output', async () => {
    const out = await shellUtils.shellExecAsyncRead('echo shelltest');
    expect(out).toContain('shelltest');
  });
});

describe('shellExecAsync', () => {
  it('should execute command and return stdout/stderr', async () => {
    const { stdout } = await shellUtils.shellExecAsync('echo shelltest');
    expect(stdout).toContain('shelltest');
  });
  it('should throw error for invalid command', async () => {
    await expect(shellUtils.shellExecAsync('')).rejects.toThrow();
  });
});

describe('shellExecAsyncSilent', () => {
  it('should not throw error for invalid command', async () => {
    await expect(shellUtils.shellExecAsyncSilent('')).resolves.toEqual({ stdout: '', stderr: '' });
  });
});

describe('shellExecAsyncAll', () => {
  it('should execute multiple commands', async () => {
    const results = await shellUtils.shellExecAsyncAll('echo a', 'echo b');
    expect(results[0].stdout).toContain('a');
    expect(results[1].stdout).toContain('b');
  });
  it('should return [] for empty list', async () => {
    const results = await shellUtils.shellExecAsyncAll();
    expect(results).toEqual([]);
  });
});

describe('shellKillProcess/shellKillPort', () => {
  it('should simulate killing a harmless process', async () => {
    const proc = require('child_process').spawn('sleep', ['2'], { detached: true });
    expect(proc.pid).toBeGreaterThan(0);
    expect(() => shellUtils.shellKillProcess('sleep')).not.toThrow();
    process.kill(proc.pid, 'SIGKILL');
  });
  it('should simulate killing a harmless port', async () => {
    const net = require('net');
    const server = net.createServer().listen(54321);
    await new Promise((res) => server.once('listening', res));
    expect(server.address().port).toBe(54321);
    expect(() => shellUtils.shellKillPort(54321)).not.toThrow();
    server.close();
  });
});

describe('parseOllamaShow', () => {
  it('should parse categories and simple keys', () => {
    const input = `General:
  Name: llama3:8b
  Size: 4.2GB
  License: openrail
`;
    const parsed = shellUtils.parseOllamaShow(input);
    expect(parsed).toEqual({
      General: {
        Name: 'llama3:8b',
        Size: '4.2GB',
        License: 'openrail',
      },
    });
  });

  it('should parse multi-line values', () => {
    const input = `General:
  Description: |
    Modelo de teste
    Com múltiplas linhas
`;
    const parsed = shellUtils.parseOllamaShow(input);
    expect(parsed).toEqual({
      General: {
        Description: ['Modelo de teste', 'Com múltiplas linhas'],
      },
    });
  });

  it('should parse without category', () => {
    const input = `Name: llama3:8b\nSize: 4.2GB`;
    const parsed = shellUtils.parseOllamaShow(input);
    expect(parsed).toEqual({
      Name: 'llama3:8b',
      Size: '4.2GB',
    });
  });

  it('should ignore blank lines and handle arrays', () => {
    const input = `General:\n  Tags: tag1\ntag2\ntag3\n`;
    const parsed = shellUtils.parseOllamaShow(input);
    expect(parsed).toEqual({
      General: {
        Tags: ['tag1', 'tag2', 'tag3'],
      },
    });
  });

  it('should return empty object for invalid input', () => {
    expect(shellUtils.parseOllamaShow('')).toEqual({});
    expect(shellUtils.parseOllamaShow(null as any)).toEqual({});
  });
});
