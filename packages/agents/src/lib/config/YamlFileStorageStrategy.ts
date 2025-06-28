import { StorageStrategy } from '../../base/StorageStrategy';
import { yamlReadFile, yamlWriteFile } from '../../utils/yaml';

export class YamlFileStorageStrategy implements StorageStrategy {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async load(): Promise<Record<string, any>> {
    try {
      return yamlReadFile<Record<string, any>>(this.filePath);
    } catch {
      return {};
    }
  }

  async save(data: Record<string, any>): Promise<void> {
    yamlWriteFile(this.filePath, data);
  }
}
