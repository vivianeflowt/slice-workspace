import { SQL_TYPE_STRUCT, SQL_TYPE_LIST, SQL_TYPE_UNION } from './constants';
import { DuckDBColumnType, DuckDBComplexType } from './types';
import isEqual from 'lodash/fp/isEqual';
import f from 'lodash/fp';

// Type guard para validar tipos complexos
export function isComplexTypeObject(value: unknown): value is { toSQL: () => string; toJSON: () => unknown } {
  return typeof value === 'object' && value !== null && 'toSQL' in value && 'toJSON' in value;
}

// Método utilitário para serializar tipos
function serializeType(type: DuckDBColumnType | DuckDBComplexType): string {
  if (isComplexTypeObject(type)) {
    return type.toSQL();
  }
  return String(type);
}

// Base abstract class for complex types
export abstract class ComplexTypeValueObject {
  abstract readonly type: 'STRUCT' | 'LIST' | 'UNION';
  abstract equals(other: unknown): boolean;
  abstract toSQL(): string;
  abstract toJSON(): unknown;
}

// Value Object for STRUCT
export class StructType extends ComplexTypeValueObject {
  readonly type = SQL_TYPE_STRUCT;
  readonly fields: Readonly<Record<string, DuckDBColumnType | DuckDBComplexType>>;

  constructor(fields: Record<string, DuckDBColumnType | DuckDBComplexType>) {
    super();
    if (!fields || typeof fields !== 'object') {
      throw new Error('StructType fields must be a valid object');
    }
    this.fields = Object.freeze({ ...fields });
  }

  equals(other: StructType): boolean {
    if (!other || other.type !== this.type) return false;
    return isEqual(this.fields, other.fields);
  }

  toSQL(): string {
    const fieldsSQL = Object.entries(this.fields)
      .map(([name, type]) => `${name}: ${serializeType(type)}`)
      .join(', ');
    return `${this.type}<${fieldsSQL}>`;
  }

  toJSON(): unknown {
    const jsonFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.fields)) {
      jsonFields[key] = isComplexTypeObject(value) ? value.toJSON() : value;
    }
    return {
      type: this.type,
      fields: jsonFields,
    };
  }
}

// Value Object for LIST
export class ListType extends ComplexTypeValueObject {
  readonly type = SQL_TYPE_LIST;
  readonly elementType: DuckDBColumnType | DuckDBComplexType;
  readonly elements: ReadonlyArray<DuckDBColumnType | DuckDBComplexType>;

  constructor(
    elementType: DuckDBColumnType | DuckDBComplexType,
    elements: Array<DuckDBColumnType | DuckDBComplexType> = [],
  ) {
    super();
    if (!elementType) {
      throw new Error('ListType elementType is required');
    }
    this.elementType = elementType;
    this.elements = Object.freeze([...elements]);
  }

  equals(other: ListType): boolean {
    if (!other || other.type !== this.type) return false;
    return isEqual(this.elementType, other.elementType) && isEqual(this.elements, other.elements);
  }

  toSQL(): string {
    return `${this.type}<${serializeType(this.elementType)}>`;
  }

  toJSON(): unknown {
    return {
      type: this.type,
      elementType: isComplexTypeObject(this.elementType) ? this.elementType.toJSON() : this.elementType,
      elements: this.elements.map(el => isComplexTypeObject(el) ? el.toJSON() : el)
    };
  }

  at(index: number): DuckDBColumnType | DuckDBComplexType | undefined {
    return this.elements[index];
  }

  get length(): number {
    return this.elements.length;
  }
}

// Value Object for UNION
export class UnionType extends ComplexTypeValueObject {
  readonly type = SQL_TYPE_UNION;
  readonly memberTypes: ReadonlyArray<DuckDBColumnType | DuckDBComplexType>;

  constructor(
    memberTypes:
      | Array<DuckDBColumnType | DuckDBComplexType>
      | ReadonlyArray<DuckDBColumnType | DuckDBComplexType>,
  ) {
    super();
    if (!Array.isArray(memberTypes) || memberTypes.length === 0) {
      throw new Error('UnionType memberTypes must be a non-empty array');
    }
    this.memberTypes = Object.freeze(Array.from(memberTypes));
  }

  equals(other: UnionType): boolean {
    if (!other || other.type !== this.type) return false;
    return isEqual(this.memberTypes, other.memberTypes);
  }

  toSQL(): string {
    const typesStr = this.memberTypes.map(serializeType).join(', ');
    return `${this.type}<${typesStr}>`;
  }

  toJSON(): unknown {
    return {
      type: this.type,
      memberTypes: this.memberTypes.map(t =>
        isComplexTypeObject(t) ? t.toJSON() : t
      )
    };
  }

  at(index: number): DuckDBColumnType | DuckDBComplexType | undefined {
    return this.memberTypes[index];
  }

  get length(): number {
    return this.memberTypes.length;
  }
}

/**
 * Value object genérico para tipos aninhados (struct, list, union, etc).
 * Permite navegação, validação e manipulação funcional.
 *
 * @example
 *   const vo = new ValueObject({ a: { b: 1 } });
 *   vo.getDeep(['a', 'b']); // 1
 *   vo.setDeep(['a', 'b'], 2).toObject(); // { a: { b: 2 } }
 */
export class ValueObject<T extends object = object> {
  private readonly data: T;

  constructor(data: T) {
    this.data = f.cloneDeep(data);
  }

  /** Retorna valor profundo por caminho (array de chaves) */
  getDeep<K = unknown>(path: (string | number)[]): K | undefined {
    return f.get(path, this.data) as K | undefined;
  }

  /** Retorna novo ValueObject com valor alterado em caminho profundo */
  setDeep<K = unknown>(path: (string | number)[], value: K): ValueObject<T> {
    return new ValueObject(f.set(path, value, this.data));
  }

  /** Valida recursivamente tipos aninhados (stub, depende de schema real) */
  validate(schema?: (data: T) => boolean): boolean {
    if (typeof schema === 'function') {
      return schema(this.data);
    }
    return true;
  }

  /** Retorna objeto plano */
  toObject(): T {
    return f.cloneDeep(this.data);
  }
}
