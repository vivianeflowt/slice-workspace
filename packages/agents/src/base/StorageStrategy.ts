// MOVA ESTE ARQUIVO PARA src/base/StorageStrategy.ts
// Interface para estratégias de armazenamento de endpoints (OCP/SOLID)
export interface StorageStrategy {
  load(): Promise<Record<string, any>>;
  save(data: Record<string, any>): Promise<void>;
}
