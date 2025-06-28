import fs from 'fs-extra';
import * as fp from 'lodash/fp';
import * as yaml from 'js-yaml';
import { z } from 'zod';

// Type guards
const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

const isValidPath = (value: unknown): value is string =>
  isValidString(value) && !value.includes('..');

// YAML parsing with validation
export const yamlParse = <T>(yamlStr: string): T => {
  if (!isValidString(yamlStr)) {
    throw new Error('Invalid YAML string');
  }

  try {
    return yaml.load(yamlStr) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// YAML stringification with validation
export const yamlStringify = <T>(data: T): string => {
  try {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: true,
    });
  } catch (error) {
    throw new Error(
      `Failed to stringify YAML: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// YAML file operations with validation
export const yamlReadFile = <T>(filePath: string): T => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    return fp.flow(() => fs.readFileSync(filePath, 'utf-8'), fp.trim, yamlParse<T>)();
  } catch (error) {
    throw new Error(
      `Failed to read YAML file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const yamlWriteFile = <T>(filePath: string, data: T): void => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    fp.flow(yamlStringify, (content) => fs.writeFileSync(filePath, content, 'utf-8'))(data);
  } catch (error) {
    throw new Error(
      `Failed to write YAML file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// YAML validation with Zod
export const yamlValidate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }
};

// YAML transformation utilities
export const yamlTransform = <T, R>(data: T, transform: (data: T) => R): R => {
  try {
    return transform(data);
  } catch (error) {
    throw new Error(`Transform failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML merge with deep merge
export const yamlMerge = <T extends object>(...objects: T[]): T => {
  try {
    return fp.mergeAll(objects) as T;
  } catch (error) {
    throw new Error(`Merge failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML diff
export const yamlDiff = <T extends object>(obj1: T, obj2: T): Partial<T> => {
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

// YAML path operations
export const yamlGet = <T>(path: string, data: unknown): T => {
  if (!isValidPath(path)) {
    throw new Error('Invalid YAML path');
  }
  try {
    return fp.get(path, data) as T;
  } catch (error) {
    throw new Error(
      `Failed to get YAML path: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const yamlSet = <T>(path: string, value: T, data: object): object => {
  if (!isValidPath(path)) {
    throw new Error('Invalid YAML path');
  }
  try {
    return fp.set(path, value, data);
  } catch (error) {
    throw new Error(
      `Failed to set YAML path: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// YAML array operations
export const yamlFilter = <T>(predicate: (value: T) => boolean, data: T[]): T[] => {
  try {
    return fp.filter(predicate, data);
  } catch (error) {
    throw new Error(`Filter failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const yamlMap = <T, R>(transform: (value: T) => R, data: T[]): R[] => {
  try {
    return fp.map(transform, data);
  } catch (error) {
    throw new Error(`Map failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML object operations
export const yamlPick = <T extends object>(keys: (keyof T)[], data: T): Partial<T> => {
  try {
    return fp.pick(keys, data);
  } catch (error) {
    throw new Error(`Pick failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const yamlOmit = <T extends object>(keys: (keyof T)[], data: T): Partial<T> => {
  try {
    return fp.omit(keys, data) as Partial<T>;
  } catch (error) {
    throw new Error(`Omit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML validation utilities
export const yamlIsValid = (data: unknown): boolean => {
  try {
    return fp.isObject(data) || Array.isArray(data);
  } catch {
    return false;
  }
};

export const yamlIsEmpty = (data: unknown): boolean => {
  try {
    return fp.isEmpty(data);
  } catch {
    return true;
  }
};

// YAML type checking
export const yamlTypeOf = (data: unknown): string => {
  if (data === null) return 'null';
  if (Array.isArray(data)) return 'array';
  return typeof data;
};

// YAML cloning
export const yamlClone = <T>(data: T): T => {
  try {
    return yamlParse<T>(yamlStringify(data));
  } catch (error) {
    throw new Error(`Clone failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML comparison
export const yamlEquals = <T>(obj1: T, obj2: T): boolean => {
  try {
    return fp.isEqual(obj1, obj2);
  } catch (error) {
    throw new Error(`Comparison failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// YAML string operations
export const yamlStringifySafe = <T>(data: T): string => {
  try {
    const yamlStr = yamlStringify(data);
    // Remove control chars (0x00-0x1F, 0x7F-0x9F) safely
    const clean = Array.from(yamlStr).filter(c => c >= ' ' || c === '\n' || c === '\r' || c === '\t').join('');
    return clean.trim();
  } catch (error) {
    throw new Error(
      `Safe stringify failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// YAML file operations with validation
export const yamlReadFileSafe = <T>(filePath: string): T => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    return fp.flow(() => fs.readFileSync(filePath, 'utf-8'), fp.trim, yamlParse<T>)();
  } catch (error) {
    throw new Error(`Safe read failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const yamlWriteFileSafe = <T>(filePath: string, data: T): void => {
  if (!isValidPath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    fp.flow(yamlStringifySafe, (content) => fs.writeFileSync(filePath, content, 'utf-8'))(data);
  } catch (error) {
    throw new Error(`Safe write failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
