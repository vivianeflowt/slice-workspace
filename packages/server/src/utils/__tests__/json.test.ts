import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { readJsonFile, writeJsonFile, readJsonFileSync, writeJsonFileSync } from '../json';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

const tempDir = os.tmpdir();
let tempFiles: string[] = [];

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
  for (const filePath of tempFiles) {
    if (await fs.pathExists(filePath)) await fs.remove(filePath);
  }
  tempFiles = [];
  vi.restoreAllMocks();
});

describe('json utils', () => {
  it('should write and read JSON asynchronously', async () => {
    const filePath = path.join(tempDir, `test-json-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    const jsonData = { foo: 'bar', n: 42, arr: [1, 2, 3] };
    await writeJsonFile(filePath, jsonData);
    const result = await readJsonFile(filePath);
    expect(result).toEqual(jsonData);
  });

  it('should write and read JSON synchronously', () => {
    const filePath = path.join(tempDir, `test-json-sync-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    const jsonData = { foo: 'baz', n: 99, arr: [4, 5, 6] };
    writeJsonFileSync(filePath, jsonData);
    const result = readJsonFileSync(filePath);
    expect(result).toEqual(jsonData);
  });

  it('should throw error for non-existent file (async)', async () => {
    const filePath = path.join(tempDir, `notfound-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    await expect(readJsonFile(filePath)).rejects.toThrow();
  });

  it('should throw error for non-existent file (sync)', () => {
    const filePath = path.join(tempDir, `notfound-sync-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    expect(() => readJsonFileSync(filePath)).toThrow();
  });

  it('should throw error for invalid JSON (async)', async () => {
    const filePath = path.join(tempDir, `invalid-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, '{ invalid }');
    await expect(readJsonFile(filePath)).rejects.toThrow();
  });

  it('should throw error for invalid JSON (sync)', () => {
    const filePath = path.join(tempDir, `invalid-sync-${Date.now()}-${Math.random()}.json`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, '{ invalid }');
    expect(() => readJsonFileSync(filePath)).toThrow();
  });

  it('should handle permission denied (async)', async () => {
    const filePath = path.join(tempDir, `perm-${Date.now()}.json`);
    tempFiles.push(filePath);
    await writeJsonFile(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o000);
    await expect(readJsonFile(filePath)).rejects.toThrow();
    fs.chmodSync(filePath, 0o600);
  });

  it('should handle permission denied (sync)', () => {
    const filePath = path.join(tempDir, `perm-sync-${Date.now()}.json`);
    tempFiles.push(filePath);
    writeJsonFileSync(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o000);
    expect(() => readJsonFileSync(filePath)).toThrow();
    fs.chmodSync(filePath, 0o600);
  });

  it('should handle large files', async () => {
    const filePath = path.join(tempDir, `large-${Date.now()}.json`);
    tempFiles.push(filePath);
    const bigData = { arr: Array.from({ length: 10000 }, (_, i) => ({ i, v: Math.random() })) };
    await writeJsonFile(filePath, bigData);
    const result = await readJsonFile(filePath);
    expect(result.arr.length).toBe(10000);
  });

  it('should throw when writing unserializable data (sync)', () => {
    const filePath = path.join(tempDir, `unserializable-${Date.now()}.json`);
    tempFiles.push(filePath);
    const obj = { a: () => 1, b: Symbol('x') };
    expect(() => writeJsonFileSync(filePath, obj)).toThrow();
  });

  it('should throw when writing unserializable data (async)', async () => {
    const filePath = path.join(tempDir, `unserializable-async-${Date.now()}.json`);
    tempFiles.push(filePath);
    const obj = { a: () => 1, b: Symbol('x') };
    await expect(writeJsonFile(filePath, obj)).rejects.toThrow();
  });

  it('should handle read/write multiple files in parallel', async () => {
    const files = Array.from({ length: 5 }, (_, i) =>
      path.join(tempDir, `parallel-${i}-${Date.now()}.json`),
    );
    tempFiles.push(...files);
    const dataArr = files.map((_, i) => ({ idx: i, val: Math.random() }));
    await Promise.all(files.map((f, i) => writeJsonFile(f, dataArr[i])));
    const results = await Promise.all(files.map((f) => readJsonFile(f)));
    expect(results).toEqual(dataArr);
  });

  it('should handle corrupted (binary) file', async () => {
    const filePath = path.join(tempDir, `corrupted-${Date.now()}.json`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, Buffer.from([0, 255, 127, 128, 10, 13]));
    await expect(readJsonFile(filePath)).rejects.toThrow();
  });

  it('should handle read-only file', async () => {
    const filePath = path.join(tempDir, `readonly-${Date.now()}.json`);
    tempFiles.push(filePath);
    await writeJsonFile(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o400);
    await expect(writeJsonFile(filePath, { b: 2 })).rejects.toThrow();
    fs.chmodSync(filePath, 0o600);
  });
});
