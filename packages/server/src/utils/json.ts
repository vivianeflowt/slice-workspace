import fs from 'fs-extra';
import path from 'path';

/**
 * Read and parse a JSON file asynchronously.
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  try {
    return await fs.readJson(filePath);
  } catch (error) {
    console.error(`[readJsonFile] Failed to read ${filePath}:`, error);
    throw new Error(
      `Failed to read JSON: ${filePath} - ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Serialize and write an object as JSON asynchronously.
 */
export async function writeJsonFile<T = Record<string, unknown>>(
  filePath: string,
  data: T,
): Promise<void> {
  try {
    const json = JSON.stringify(data);
    if (typeof data === 'object' && data !== null) {
      const dataObj = data as Record<string, unknown>;
      for (const key of Object.keys(dataObj)) {
        const value = dataObj[key];
        if (typeof value === 'function' || typeof value === 'symbol') {
          throw new Error('Cannot serialize function or symbol to JSON');
        }
      }
    }
    await fs.promises.writeFile(filePath, json, 'utf-8');
  } catch (error) {
    console.error(`[writeJsonFile] Failed to write ${filePath}:`, error);
    throw error;
  }
}

/**
 * Read and parse a JSON file synchronously.
 */
export function readJsonFileSync<T = any>(filePath: string): T {
  try {
    return fs.readJsonSync(filePath);
  } catch (error) {
    console.error(`[readJsonFileSync] Failed to read ${filePath}:`, error);
    throw new Error(
      `Failed to read JSON (sync): ${filePath} - ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Serialize and write an object as JSON synchronously.
 */
export function writeJsonFileSync(filePath: string, data: Record<string, unknown>) {
  try {
    const json = JSON.stringify(data);
    if (typeof data === 'object' && data !== null) {
      const dataObj = data as Record<string, unknown>;
      for (const key of Object.keys(dataObj)) {
        const value = dataObj[key];
        if (typeof value === 'function' || typeof value === 'symbol') {
          throw new Error('Cannot serialize function or symbol to JSON');
        }
      }
    }
    fs.writeFileSync(filePath, json, 'utf-8');
  } catch (error) {
    throw error;
  }
}

/**
 * Read a chunk of lines from a text file (inclusive, 1-based).
 */
export async function readTextFileChunk(
  filePath: string,
  startLine: number,
  endLine: number,
): Promise<string[]> {
  if (startLine < 1 || endLine < startLine) throw new Error('Invalid line parameters');
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const readline = await import('readline/promises');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  const lines: string[] = [];
  let currentLine = 1;
  for await (const line of rl) {
    if (currentLine >= startLine && currentLine <= endLine) lines.push(line);
    if (currentLine > endLine) break;
    currentLine++;
  }
  rl.close();
  fileStream.close();
  return lines;
}

/**
 * Read and merge all JSON files in a directory synchronously.
 */
export function readAllJsonFilesAndMergeSync(directoryPath: string): any[] {
  if (!fs.existsSync(directoryPath)) throw new Error(`Directory ${directoryPath} not found`);
  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(directoryPath, file))
    .reduce<any[]>((merged, file) => {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        if (!content.trim()) return merged;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return merged.concat(parsed);
        if (typeof parsed === 'object' && parsed !== null) return merged.concat([parsed]);
        console.warn(`[readAllJsonFilesAndMergeSync] Ignoring non-object file: ${file}`);
      } catch (error) {
        console.error(`[readAllJsonFilesAndMergeSync] Failed to read ${file}:`, error);
      }
      return merged;
    }, []);
}
