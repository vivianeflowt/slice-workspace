import cp from 'child_process';
import fs from 'fs';
import _ from 'lodash';
import shellEscape from 'shell-escape';
import shellQuote from 'shell-quote';
import fg from 'fast-glob';
import shelljs from 'shelljs';

// Validação centralizada para string não vazia
const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && !!value.trim();

export function shellExecSync(command: string, silent = false): void {
  if (!isValidString(command)) throw new Error('Invalid command');
  const normalizedCommand = shellNormalizeSpace(command);
  if (!silent) console.log(normalizedCommand);
  cp.execSync(normalizedCommand, { stdio: silent ? 'ignore' : 'inherit' });
}

export function shellExecSyncSilent(command: string): void {
  try {
    shellExecSync(command, true);
  } catch {
    /* silent */
  }
}

export function shellExecSyncRead(command: string, silent = false): string {
  if (!isValidString(command)) return '';
  const normalizedCommand = shellNormalizeSpace(command);
  if (!silent) console.log(normalizedCommand);
  return _.trim(String(cp.execSync(normalizedCommand, { stdio: ['pipe', 'pipe', 'pipe'] })));
}

export async function shellExecAsyncRead(command: string, silent = false): Promise<string> {
  const { stdout } = await shellExecAsync(command, silent);
  return _.trim(String(stdout));
}

export function shellExecAsync(
  command: string,
  silent = false,
): Promise<{ stdout: string; stderr: string }> {
  if (!isValidString(command)) return Promise.reject(new Error('Invalid command'));
  const normalizedCommand = shellNormalizeSpace(command);
  if (!silent) console.log(normalizedCommand);
  return new Promise((resolve, reject) => {
    cp.exec(normalizedCommand, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}

export async function shellExecAsyncSilent(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  try {
    return await shellExecAsync(command, true);
  } catch {
    return { stdout: '', stderr: '' };
  }
}

export async function shellExecAsyncAll(...commands: string[]): Promise<any[]> {
  if (!commands.length) return [];
  return Promise.all(commands.map((cmd) => shellExecAsync(cmd)));
}

export function shellKillProcess(processName: string): void {
  if (isValidString(processName)) shellExecSyncSilent(`pkill -f "${processName}"`);
}

export function shellKillPort(port: number | string): void {
  if (port) shellExecSync(`lsof -t -i :${port} | xargs kill || true`);
}

export function shellWhich(binaryName: string): string | undefined {
  if (!isValidString(binaryName)) return undefined;
  try {
    return _.trim(String(cp.execSync(`which ${binaryName}`)));
  } catch {
    return undefined;
  }
}

const WHITESPACE_REGEX = /\s+/g;
export function shellNormalizeSpace(str: string): string {
  if (!isValidString(str)) return '';
  return _.replace(_.trim(str), WHITESPACE_REGEX, ' ');
}

export function shellParseTableOutput(tableText: string): any[] {
  if (!isValidString(tableText)) return [];
  const lines = tableText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(/\s+/);
  return lines.slice(1).map((line) => {
    const values = line.split(/\s+/);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

export function shellEscapeArgs(args: string[]): string {
  if (!Array.isArray(args)) throw new Error('Args must be an array');
  return args.map((arg) => `'${String(arg).replace(/'/g, "'\\''")}'`).join(' ');
}

export function shellQuoteParse(commandLine: string): string[] {
  return isValidString(commandLine)
    ? (shellQuote.parse(commandLine).filter(Boolean) as string[])
    : [];
}

export function shellQuoteJoin(args: string[]): string {
  return Array.isArray(args) ? shellQuote.quote(args) : '';
}

export function shellExecShelljs(command: string): shelljs.ShellString {
  return shelljs.exec(command, { silent: true });
}

export function shellExecShelljsAsync(command: string): Promise<shelljs.ShellString> {
  return new Promise((resolve) => resolve(shelljs.exec(command, { silent: true })));
}

export function shellListDir(directory: string = '.'): string[] {
  return fs.readdirSync(directory);
}

export function shellPwd(): string {
  return process.cwd();
}

export function shellMkdir(dir: string) {
  if (typeof dir !== 'string' || !dir) throw new Error('Invalid directory');
  fs.mkdirSync(dir, { recursive: true });
}

export function shellChmod(mode: number, path: string) {
  if (typeof path !== 'string' || !path) throw new Error('Invalid path');
  fs.chmodSync(path, mode);
}

export function shellTouch(path: string) {
  if (typeof path !== 'string' || !path) throw new Error('Invalid path');
  fs.closeSync(fs.openSync(path, 'a'));
}

export function shellReadFile(path: string) {
  if (typeof path !== 'string' || !path) throw new Error('Invalid path');
  return fs.readFileSync(path, 'utf-8');
}

export function shellWriteFile(path: string, data: string) {
  if (typeof path !== 'string' || !path) throw new Error('Invalid path');
  fs.writeFileSync(path, data, 'utf-8');
}

export function shellGlob(pattern: string | string[], options: any = {}): string[] {
  if (!pattern || (typeof pattern !== 'string' && !Array.isArray(pattern))) return [];
  // Corrige o tipo de retorno para string[]
  return fg.sync(pattern, options).map((entry: any) => typeof entry === 'string' ? entry : entry.path);
}

export function shellRm(path: string) {
  if (typeof path !== 'string' || !path) throw new Error('Invalid path');
  fs.rmSync(path, { recursive: true, force: true });
}

export function parseOllamaShow(output: string): any {
  if (!isValidString(output)) return {};
  const result: any = {};
  let currentKey = '';
  output.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const keyMatch = line.match(/^(\w[\w\s-]*):\s*(.*)$/);
    if (keyMatch) {
      currentKey = _.camelCase(keyMatch[1]);
      result[currentKey] = keyMatch[2] || [];
    } else if (currentKey) {
      if (Array.isArray(result[currentKey])) result[currentKey].push(line.trim());
      else result[currentKey] += '\n' + line.trim();
    }
  });
  return result;
}
