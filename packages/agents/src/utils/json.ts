import fs from 'fs-extra';
import path from 'path';
import { createInterface } from 'readline/promises';
import * as fp from 'lodash/fp';
import { z } from 'zod';

/**
 * Type guard to check if a value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
  );
}

/**
 * Type guard to check if a value is serializable
 */
function isSerializable(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    return true;
  if (value instanceof Date) return true;
  if (Array.isArray(value)) return value.every(isSerializable);
  if (isPlainObject(value)) return Object.values(value).every(isSerializable);
  return false;
}

// Type guards
const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

const isValidPath = (value: unknown): value is string =>
  isValidString(value) && !value.includes('..');

// JSON parsing with validation
export const jsonParse = <T>(json: string): T => {
  if (!isValidString(json)) throw new Error('Invalid JSON string');
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON stringification with validation
export const jsonStringify = <T>(data: T): string => {
  try {
    if (typeof data === 'object' && data !== null) {
      for (const key of Object.keys(data)) {
        const value = (data as Record<string, unknown>)[key];
        if (typeof value === 'function' || typeof value === 'symbol') {
          throw new Error('Cannot serialize function or symbol to JSON');
        }
      }
    }
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error(`Failed to stringify JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON file operations with validation
export const jsonReadFile = <T>(filePath: string): T => {
  if (!isValidPath(filePath)) throw new Error('Invalid file path');
  try {
    return jsonParse<T>(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonWriteFile = <T>(filePath: string, data: T): void => {
  if (!isValidPath(filePath)) throw new Error('Invalid file path');
  try {
    fs.writeFileSync(filePath, jsonStringify(data), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON validation with Zod
export const jsonValidate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }
};

// JSON transformation utilities
export const jsonTransform = <T, R>(data: T, transform: (data: T) => R): R => {
  try {
    return transform(data);
  } catch (error) {
    throw new Error(`Transform failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON merge with deep merge
export const jsonMerge = <T extends object>(...objects: T[]): T => {
  try {
    return fp.mergeAll(objects) as T;
  } catch (error) {
    throw new Error(`Merge failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON diff
export const jsonDiff = <T extends object>(obj1: T, obj2: T): Partial<T> => {
  try {
    return fp.reduce(
      (acc: Partial<T>, key: keyof T) => {
        if (!fp.isEqual(obj1[key], obj2[key])) {
          return { ...acc, [key]: obj2[key] };
        }
        return acc;
      },
      {},
      fp.keys(obj2) as (keyof T)[]
    );
  } catch (error) {
    throw new Error(`Diff failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON path operations
export const jsonGet = <T>(path: string, data: unknown): T => {
  if (!isValidPath(path)) {
    throw new Error('Invalid JSON path');
  }

  try {
    return fp.get(path, data) as T;
  } catch (error) {
    throw new Error(
      `Failed to get JSON path: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const jsonSet = <T>(path: string, value: T, data: object): object => {
  if (!isValidPath(path)) {
    throw new Error('Invalid JSON path');
  }

  try {
    return fp.set(path, value, data);
  } catch (error) {
    throw new Error(
      `Failed to set JSON path: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// JSON array operations
export const jsonFilter = <T>(predicate: (value: T) => boolean, data: T[]): T[] => {
  try {
    return fp.filter(predicate, data);
  } catch (error) {
    throw new Error(`Filter failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonMap = <T, R>(transform: (value: T) => R, data: T[]): R[] => {
  try {
    return fp.map(transform, data);
  } catch (error) {
    throw new Error(`Map failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON object operations
export const jsonPick = <T extends object>(keys: (keyof T)[], data: T): Partial<T> => {
  try {
    return fp.pick(keys, data);
  } catch (error) {
    throw new Error(`Pick failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonOmit = <T extends object>(keys: (keyof T)[], data: T): Partial<T> => {
  try {
    return fp.omit(keys, data) as Partial<T>;
  } catch (error) {
    throw new Error(`Omit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON validation utilities
export const jsonIsValid = (data: unknown): boolean => {
  try {
    return fp.isObject(data) || Array.isArray(data);
  } catch {
    return false;
  }
};

export const jsonIsEmpty = (data: unknown): boolean => {
  try {
    return fp.isEmpty(data);
  } catch {
    return true;
  }
};

// JSON type checking
export const jsonTypeOf = (data: unknown): string => {
  if (data === null) return 'null';
  if (Array.isArray(data)) return 'array';
  return typeof data;
};

// JSON cloning
export const jsonClone = <T>(data: T): T => {
  try {
    return jsonParse<T>(jsonStringify(data));
  } catch (error) {
    throw new Error(`Clone failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON comparison
export const jsonEquals = <T>(obj1: T, obj2: T): boolean => {
  try {
    return fp.isEqual(obj1, obj2);
  } catch (error) {
    throw new Error(`Comparison failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// JSON string operations
export const jsonStringifySafe = <T>(data: T): string => {
  try {
    // Remove control chars (0x00-0x1F, 0x7F-0x9F) de forma segura
    const json = jsonStringify(data);
    // Usa função para remover caracteres de controle sem regex literal
    const clean = Array.from(json).filter(c => c >= ' ' || c === '\n' || c === '\r' || c === '\t').join('');
    return clean.trim();
  } catch (error) {
    throw new Error(
      `Safe stringify failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// JSON file operations with validation
export const jsonReadFileSafe = <T>(filePath: string): T => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    return fp.flow(() => fs.readFileSync(filePath, 'utf-8'), fp.trim, jsonParse<T>)();
  } catch (error) {
    throw new Error(`Safe read failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const jsonWriteFileSafe = <T>(filePath: string, data: T): void => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    fp.flow(jsonStringifySafe, (content) => fs.writeFileSync(filePath, content, 'utf-8'))(data);
  } catch (error) {
    throw new Error(`Safe write failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Read and parse a JSON file asynchronously.
 * @throws {Error} If file cannot be read or parsed
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    if (!content.trim()) {
      throw new Error('File is empty');
    }
    return JSON.parse(content) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read JSON file ${filePath}: ${message}`);
  }
}

/**
 * Serialize and write an object as JSON asynchronously.
 * @throws {Error} If data cannot be serialized or file cannot be written
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  if (!isSerializable(data)) {
    throw new Error('Data contains non-serializable values (functions, symbols, etc.)');
  }

  try {
    const json = JSON.stringify(data, null, 2);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, json, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to write JSON file ${filePath}: ${message}`);
  }
}

/**
 * Read and parse a JSON file synchronously.
 * @throws {Error} If file cannot be read or parsed
 */
export function readJsonFileSync<T>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      throw new Error('File is empty');
    }
    return JSON.parse(content) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read JSON file ${filePath}: ${message}`);
  }
}

/**
 * Serialize and write an object as JSON synchronously.
 * @throws {Error} If data cannot be serialized or file cannot be written
 */
export function writeJsonFileSync<T>(filePath: string, data: T): void {
  if (!isSerializable(data)) {
    throw new Error('Data contains non-serializable values (functions, symbols, etc.)');
  }

  try {
    const json = JSON.stringify(data, null, 2);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, json, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to write JSON file ${filePath}: ${message}`);
  }
}

/**
 * Read a chunk of lines from a text file (inclusive, 1-based).
 * @throws {Error} If file cannot be read or line parameters are invalid
 */
export async function readTextFileChunk(
  filePath: string,
  startLine: number,
  endLine: number
): Promise<string[]> {
  if (startLine < 1 || endLine < startLine) {
    throw new Error(
      'Invalid line parameters: startLine must be >= 1 and endLine must be >= startLine'
    );
  }

  const lines: string[] = [];
  let currentLine = 0;

  try {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      currentLine++;
      if (currentLine >= startLine && currentLine <= endLine) {
        lines.push(line);
      }
      if (currentLine > endLine) break;
    }

    rl.close();
    fileStream.destroy();

    if (currentLine < startLine) {
      throw new Error(`File has only ${currentLine} lines, requested start at line ${startLine}`);
    }

    return lines;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read text file chunk ${filePath}: ${message}`);
  }
}

/**
 * Read and merge all JSON files in a directory synchronously.
 * @throws {Error} If directory cannot be read or files cannot be parsed
 */
export function readAllJsonFilesAndMergeSync<T>(directoryPath: string): T[] {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Directory not found: ${directoryPath}`);
  }

  const results: T[] = [];

  try {
    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.join(directoryPath, file));

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.trim()) continue;

      try {
        const parsed = JSON.parse(content) as T;
        if (Array.isArray(parsed)) {
          results.push(...(parsed as T[]));
        } else if (isPlainObject(parsed)) {
          results.push(parsed as T);
        } else {
          console.warn(`Skipping non-object/array JSON file: ${file}`);
        }
      } catch (error) {
        console.error(`Failed to parse JSON file ${file}:`, error);
      }
    }

    return results;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read JSON files from directory ${directoryPath}: ${message}`);
  }
}
