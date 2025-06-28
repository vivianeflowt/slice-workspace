import f from 'lodash/fp';

/**
 * Value object para linha de registro de tabela (imutável).
 * Permite acesso seguro, navegação profunda, serialização e manipulação funcional.
 *
 * @example
 *   const row = new RecordRow({ id: 1, name: 'Alice', meta: { age: 30 } });
 *   row.get('name'); // 'Alice'
 *   row.getDeep(['meta', 'age']); // 30
 *   row.pick(['id', 'name']).toObject(); // { id: 1, name: 'Alice' }
 */
export class RecordRow<T extends object = any> {
  private readonly data: T;

  constructor(data: T) {
    this.data = f.cloneDeep(data);
  }

  /** Retorna valor de uma chave */
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  /** Retorna valor profundo por caminho (array de chaves) */
  getDeep(path: (string | number)[]): any {
    return f.get(path, this.data);
  }

  /** Retorna novo RecordRow apenas com as chaves selecionadas */
  pick(keys: (keyof T)[]): RecordRow<Pick<T, keyof T>> {
    return new RecordRow(f.pick(keys, this.data));
  }

  /** Retorna novo RecordRow omitindo as chaves selecionadas */
  omit(keys: (keyof T)[]): RecordRow<Omit<T, keyof T>> {
    return new RecordRow(f.omit(keys, this.data));
  }

  /** Retorna objeto plano */
  toObject(): T {
    return f.cloneDeep(this.data);
  }

  /** Serializa para JSON, lidando com arrays de value-objects */
  toJSON(): string {
    return JSON.stringify(this.data, (key, value) => {
      if (Array.isArray(value)) {
        return value.map((v) => (typeof v?.toObject === 'function' ? v.toObject() : v));
      }
      if (typeof value?.toObject === 'function') {
        return value.toObject();
      }
      return value;
    });
  }

  equals(other: RecordRow): boolean {
    return f.isEqual(this.data, other.data);
  }

  clone(overrides: Partial<T> = {}): RecordRow<T> {
    return new RecordRow({ ...this.data, ...overrides });
  }
}
