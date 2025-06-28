import fs from 'fs-extra';
import YAML from 'yaml';

/**
 * Read and parse a YAML file asynchronously.
 */
export async function readYamlFile(filePath: string): Promise<any> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const parsed = YAML.parse(content);
    if (typeof parsed === 'string') throw new Error('Invalid/corrupted YAML file');
    return parsed;
  } catch (error) {
    throw error;
  }
}

/**
 * Serialize and write an object as YAML asynchronously.
 */
export async function writeYamlFile<T = any>(filePath: string, data: T): Promise<void> {
  try {
    const yamlContent = YAML.stringify(data);
    await fs.outputFile(filePath, yamlContent, 'utf8');
  } catch (error) {
    console.error(`[writeYamlFile] Failed to write ${filePath}:`, error);
    throw new Error(
      `Failed to write YAML: ${filePath} - ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Read and parse a YAML file synchronously.
 */
export function readYamlFileSync<T = any>(filePath: string): T {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return YAML.parse(fileContent) as T;
  } catch (error) {
    console.error(`[readYamlFileSync] Failed to read ${filePath}:`, error);
    throw new Error(
      `Failed to read YAML (sync): ${filePath} - ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Serialize and write an object as YAML synchronously.
 */
export function writeYamlFileSync<T = any>(filePath: string, data: T): void {
  try {
    const yamlContent = YAML.stringify(data);
    fs.outputFileSync(filePath, yamlContent, 'utf8');
  } catch (error) {
    console.error(`[writeYamlFileSync] Failed to write ${filePath}:`, error);
    throw new Error(
      `Failed to write YAML (sync): ${filePath} - ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
