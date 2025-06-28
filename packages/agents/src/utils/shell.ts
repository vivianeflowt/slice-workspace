import shellQuote from 'shell-quote';
import shelljs from 'shelljs';
import * as fp from 'lodash/fp';
import { z } from 'zod';

// Type definitions
interface IShellExecutionResult {
  stdout: string;
  stderr: string;
}

interface IShellExecutionOptions {
  silent?: boolean;
  async?: boolean;
}

// Constants
const DANGEROUS_COMMAND_PATTERNS = [';', '&&', '||', '|', '>', '<', '`', '$'] as const;
const PATH_TRAVERSAL_PATTERNS = ['..', '~/', '/etc', '/var', '/usr', '/bin'] as const;
const WHITESPACE_PATTERN = /\s+/g;

// Enhanced validation schemas
const commandSchema = z.string()
  .min(1, 'Command cannot be empty')
  .max(1000, 'Command too long')
  .refine(
    cmd => !DANGEROUS_COMMAND_PATTERNS.some(pattern => cmd.includes(pattern)),
    'Command contains dangerous patterns'
  );

const pathSchema = z.string()
  .min(1, 'Path cannot be empty')
  .max(500, 'Path too long')
  .refine(
    path => !PATH_TRAVERSAL_PATTERNS.some(pattern => path.includes(pattern)),
    'Path contains traversal patterns'
  );

// Type guards
const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

const isValidPath = fp.allPass([
  isValidString,
  (path: string): boolean => !PATH_TRAVERSAL_PATTERNS.some(pattern => path.includes(pattern))
]);

const isValidCommand = fp.allPass([
  isValidString,
  (cmd: string): boolean => !DANGEROUS_COMMAND_PATTERNS.some(pattern => cmd.includes(pattern))
]); // Mantém a função, mas garante tipagem e clareza

// Core utilities
const normalizeCommand = fp.flow(
  fp.trim,
  fp.replace(WHITESPACE_PATTERN, ' ')
);

const createExecutionError = (message: string, originalError?: unknown): Error => {
  const errorMessage = originalError instanceof Error ? originalError.message : String(originalError);
  return new Error(`${message}: ${errorMessage}`);
};

/**
 * Execute a shell command (sync/async) with validation and normalization.
 * @param command Shell command to execute.
 * @param options Shell execution options.
 * @returns ShellString result (Promise if async).
 * @throws {Error} If command is invalid or execution fails.
 */
const executeShellCommand = (
  command: string,
  options: IShellExecutionOptions = {}
): shelljs.ShellString => {
  if (!isValidCommand(command)) throw new Error('Invalid command');
  const normalizedCommand = normalizeCommand(command);
  const { silent = true } = options;
  if (!silent) console.log(normalizedCommand);
  try {
    return shelljs.exec(normalizedCommand, { silent });
  } catch (error) {
    throw createExecutionError('Command execution failed', error);
  }
};

/**
 * Process shell execution result, throwing on error.
 */
const processExecutionResult = (result: shelljs.ShellString): IShellExecutionResult => {
  if (result.code !== 0) throw new Error(`Command failed: ${result.stderr}`);
  return { stdout: String(result.stdout).trim(), stderr: String(result.stderr).trim() };
};

/**
 * Execute shell command synchronously
 * @throws {Error} If command is invalid or execution fails
 */
export function shellExecSync(command: string, silent = false): void {
  const result = executeShellCommand(command, { silent: true });
  processExecutionResult(result);
  if (!silent) console.log(normalizeCommand(command));
}

/**
 * Execute shell command synchronously without output
 */
export function shellExecSyncSilent(command: string): void {
  try {
    shellExecSync(command, true);
  } catch {
    // Silent failure
  }
}

/**
 * Execute shell command synchronously and return output
 * @throws {Error} If command is invalid or execution fails
 */
export function shellExecSyncRead(command: string, silent = false): string {
  if (!isValidCommand(command)) {
    throw new Error('Invalid command');
  }

  const normalizedCommand = normalizeCommand(command);
  if (!silent) console.log(normalizedCommand);

  try {
    const result = shelljs.exec(normalizedCommand, { silent: true });
    if (result.code !== 0) {
      throw new Error(`Command failed: ${result.stderr}`);
    }
    return result.stdout.trim();
  } catch (error) {
    throw new Error(
      `Command execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Execute shell command asynchronously and return output
 * @throws {Error} If command is invalid or execution fails
 */
export async function shellExecAsyncRead(command: string, silent = false): Promise<string> {
  const { stdout } = await shellExecAsync(command, silent);
  return String(stdout).trim();
}

/**
 * Execute shell command asynchronously
 * @throws {Error} If command is invalid or execution fails
 */
export function shellExecAsync(
  command: string,
  silent = false
): Promise<{ stdout: string; stderr: string }> {
  const result = executeShellCommand(command, { silent: true });
  if (!silent) console.log(normalizeCommand(command));
  return Promise.resolve(processExecutionResult(result));
}

/**
 * Execute shell command asynchronously without output
 */
export async function shellExecAsyncSilent(
  command: string
): Promise<{ stdout: string; stderr: string }> {
  try {
    return await shellExecAsync(command, true);
  } catch {
    return { stdout: '', stderr: '' };
  }
}

/**
 * Execute multiple shell commands in parallel
 * @throws {Error} If any command fails
 */
export async function shellExecAsyncAll(
  ...commands: string[]
): Promise<Array<{ stdout: string; stderr: string }>> {
  if (!commands.length) return [];
  return Promise.all(commands.map((cmd) => shellExecAsync(cmd)));
}

/**
 * Kill process by name
 */
export function shellKillProcess(processName: string): void {
  if (isValidString(processName)) {
    shellExecSyncSilent(`pkill -f "${processName}"`);
  }
}

/**
 * Kill process by port
 */
export function shellKillPort(port: number | string): void {
  if (port) {
    shellExecSync(`lsof -t -i :${port} | xargs kill || true`);
  }
}

/**
 * Find binary in PATH
 */
export function shellWhich(binaryName: string): string | undefined {
  if (!isValidString(binaryName)) return undefined;
  try {
    const result = shelljs.which(binaryName);
    if (!result) {
      throw new Error(`Command not found: ${binaryName}`);
    }
    return result;
  } catch (error) {
    throw new Error(
      `Failed to find command: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Parse table output into array of objects
 */
export function shellParseTableOutput(tableText: string): Array<Record<string, string>> {
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

/**
 * Escape command line arguments
 */
export function shellEscapeArgs(args: string[]): string {
  if (!Array.isArray(args)) {
    throw new Error('Args must be an array');
  }
  return args.map((arg) => `'${String(arg).replace(/'/g, "'\\''")}'`).join(' ');
}

/**
 * Parse command line into array of arguments
 */
export function shellQuoteParse(commandLine: string): string[] {
  return isValidString(commandLine)
    ? (shellQuote.parse(commandLine).filter(Boolean) as string[])
    : [];
}

/**
 * Join array of arguments into command line
 */
export function shellQuoteJoin(args: string[]): string {
  return Array.isArray(args) ? shellQuote.quote(args) : '';
}

/**
 * Execute command using shelljs
 */
export function shellExecShelljs(command: string): shelljs.ShellString {
  if (!isValidCommand(command)) {
    throw new Error('Invalid command');
  }
  return shelljs.exec(command, { silent: true });
}

/**
 * Execute command using shelljs asynchronously
 */
export async function shellExecShelljsAsync(command: string): Promise<shelljs.ShellString> {
  if (!isValidCommand(command)) {
    throw new Error('Invalid command');
  }
  return new Promise((resolve) => resolve(shelljs.exec(command, { silent: true })));
}

/**
 * List directory contents
 * @throws {Error} If directory is invalid or cannot be read
 */
export function shellListDir(directory: string = '.'): string[] {
  if (!isValidPath(directory)) throw new Error('Invalid directory path');
  return shelljs.ls(directory).map(String);
}

/**
 * Get current working directory
 */
export function shellPwd(): string {
  return process.cwd();
}

/**
 * Create directory
 * @throws {Error} If directory path is invalid or cannot be created
 */
export function shellMkdir(dir: string): void {
  if (!isValidPath(dir)) {
    throw new Error('Invalid directory path');
  }
  shelljs.mkdir('-p', dir);
}

/**
 * Change file permissions
 * @throws {Error} If path is invalid or permissions cannot be changed
 */
export function shellChmod(mode: string, filePath: string): void {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid path');
  }
  shelljs.chmod(mode, filePath);
}

/**
 * Create empty file
 * @throws {Error} If path is invalid or file cannot be created
 */
export function shellTouch(filePath: string): void {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }
  shelljs.touch(filePath);
}

/**
 * Read file contents
 * @throws {Error} If path is invalid or file cannot be read
 */
export function shellReadFile(filePath: string): string {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }
  return shelljs.cat(filePath).toString().trim();
}

/**
 * Write file contents
 * @throws {Error} If path is invalid or file cannot be written
 */
export function shellWriteFile(filePath: string, data: string): void {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }
  shelljs.ShellString(data).to(filePath);
}

/**
 * Find files using glob pattern
 * @throws {Error} If pattern is invalid
 */
export function shellGlob(pattern: string | string[]): string[] {
  if (!pattern || (typeof pattern !== 'string' && !Array.isArray(pattern))) {
    throw new Error('Invalid glob pattern');
  }
  const patterns = typeof pattern === 'string' ? [pattern] : pattern;
  return shelljs.find(...patterns).map(String);
}

/**
 * Remove file or directory
 * @throws {Error} If path is invalid or cannot be removed
 */
export function shellRm(filePath: string): void {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid path');
  }
  shelljs.rm('-rf', filePath);
}

/**
 * Parse Ollama show output
 */
export function parseOllamaShow(output: string): Record<string, string | string[]> {
  if (!isValidString(output)) return {};
  const result: Record<string, string | string[]> = {};
  let currentKey = '';
  output.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const keyMatch = line.match(/^(\w[\w\s-]*):\s*(.*)$/);
    if (keyMatch) {
      // Safe camelCase conversion sem usar any
      const rawKey = String(keyMatch[1]);
      currentKey = rawKey.replace(/[-\s]+(.)?/g, (_: string, c: string) => c ? c.toUpperCase() : '').replace(/^./, (s: string) => s.toLowerCase());
      result[currentKey] = typeof keyMatch[2] === 'string' ? keyMatch[2] : '';
    } else if (currentKey) {
      if (Array.isArray(result[currentKey])) {
        (result[currentKey] as string[]).push(line.trim());
      } else {
        result[currentKey] = String(result[currentKey]) + '\n' + line.trim();
      }
    }
  });
  return result;
}

/**
 * Command validation
 */
export function shellValidateCommand(command: string): boolean {
  try {
    return commandSchema.safeParse(command).success;
  } catch {
    return false;
  }
}

/**
 * Path validation
 */
export function shellValidatePath(path: string): boolean {
  try {
    return pathSchema.safeParse(path).success;
  } catch {
    return false;
  }
}

/**
 * Command normalization
 */
export function shellNormalizeCommand(command: string): string {
  try {
    return fp.flow(fp.trim, fp.replace(/\s+/g, ' '))(command);
  } catch (error) {
    throw new Error(
      `Failed to normalize command: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Path normalization
 */
export function shellNormalizePath(path: string): string {
  try {
    return fp.flow(fp.trim, fp.replace(/\/+/g, '/'), fp.replace(/\/$/, ''))(path);
  } catch (error) {
    throw new Error(
      `Failed to normalize path: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
