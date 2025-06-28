import { StorageStrategy } from '../../base/StorageStrategy';

export class MemoryStorageStrategy implements StorageStrategy {
  private data: Record<string, any> = {};

  async load(): Promise<Record<string, any>> {
    return this.data;
  }

  async save(data: Record<string, any>): Promise<void> {
    this.data = data;
  }
}
