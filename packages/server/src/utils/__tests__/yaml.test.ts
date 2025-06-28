import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { readYamlFile, writeYamlFile, readYamlFileSync, writeYamlFileSync } from '../yaml';
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

describe('yaml utils', () => {
  it('should write and read YAML asynchronously', async () => {
    const filePath = path.join(tempDir, `test-yaml-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    const yamlData = { foo: 'bar', n: 42, arr: [1, 2, 3] };
    await writeYamlFile(filePath, yamlData);
    const result = await readYamlFile(filePath);
    expect(result).toEqual(yamlData);
  });

  it('should write and read YAML synchronously', () => {
    const filePath = path.join(tempDir, `test-yaml-sync-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    const yamlData = { foo: 'baz', n: 99, arr: [4, 5, 6] };
    writeYamlFileSync(filePath, yamlData);
    const result = readYamlFileSync(filePath);
    expect(result).toEqual(yamlData);
  });

  it('should throw error for non-existent file (async)', async () => {
    const filePath = path.join(tempDir, `notfound-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    await expect(readYamlFile(filePath)).rejects.toThrow();
  });

  it('should throw error for non-existent file (sync)', () => {
    const filePath = path.join(tempDir, `notfound-sync-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    expect(() => readYamlFileSync(filePath)).toThrow();
  });

  it('should throw error for invalid YAML (async)', async () => {
    const filePath = path.join(tempDir, `invalid-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, 'foo: bar:');
    await expect(readYamlFile(filePath)).rejects.toThrow();
  });

  it('should throw error for invalid YAML (sync)', () => {
    const filePath = path.join(tempDir, `invalid-sync-${Date.now()}-${Math.random()}.yaml`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, 'foo: bar:');
    expect(() => readYamlFileSync(filePath)).toThrow();
  });

  it('should handle permission denied (async)', async () => {
    const filePath = path.join(tempDir, `perm-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    await writeYamlFile(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o000);
    await expect(readYamlFile(filePath)).rejects.toThrow();
    fs.chmodSync(filePath, 0o600);
  });

  it('should handle permission denied (sync)', () => {
    const filePath = path.join(tempDir, `perm-sync-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    writeYamlFileSync(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o000);
    expect(() => readYamlFileSync(filePath)).toThrow();
    fs.chmodSync(filePath, 0o600);
  });

  it('should handle large files', async () => {
    const filePath = path.join(tempDir, `large-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    const bigData = { arr: Array.from({ length: 10000 }, (_, i) => ({ i, v: Math.random() })) };
    await writeYamlFile(filePath, bigData);
    const result = await readYamlFile(filePath);
    expect(result.arr.length).toBe(10000);
  });

  it('should throw when writing unserializable data (sync)', () => {
    const filePath = path.join(tempDir, `unserializable-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    const obj = { a: () => 1, b: Symbol('x') };
    expect(() => writeYamlFileSync(filePath, obj)).toThrow();
  });

  it('should throw when writing unserializable data (async)', async () => {
    const filePath = path.join(tempDir, `unserializable-async-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    const obj = { a: () => 1, b: Symbol('x') };
    await expect(writeYamlFile(filePath, obj)).rejects.toThrow();
  });

  it('should handle read/write multiple files in parallel', async () => {
    const files = Array.from({ length: 5 }, (_, i) =>
      path.join(tempDir, `parallel-${i}-${Date.now()}.yaml`),
    );
    tempFiles.push(...files);
    const dataArr = files.map((_, i) => ({ idx: i, val: Math.random() }));
    await Promise.all(files.map((f, i) => writeYamlFile(f, dataArr[i])));
    const results = await Promise.all(files.map((f) => readYamlFile(f)));
    expect(results).toEqual(dataArr);
  });

  it('should handle corrupted (binary) file', async () => {
    const filePath = path.join(tempDir, `corrupted-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    fs.writeFileSync(filePath, Buffer.from([0, 255, 127, 128, 10, 13]));
    await expect(readYamlFile(filePath)).rejects.toThrow();
  });

  it('should handle read-only file', async () => {
    const filePath = path.join(tempDir, `readonly-${Date.now()}.yaml`);
    tempFiles.push(filePath);
    await writeYamlFile(filePath, { a: 1 });
    fs.chmodSync(filePath, 0o400);
    await expect(writeYamlFile(filePath, { b: 2 })).rejects.toThrow();
    fs.chmodSync(filePath, 0o600);
  });
});
