import { DuckDBColumnType, DuckDBComplexType, ITableColumn } from './types';
import {
  SQL_KEYWORD_DEFAULT,
  SQL_KEYWORD_NOT_NULL,
  SQL_KEYWORD_UNIQUE,
  SQL_KEYWORD_PRIMARY_KEY,
  SQL_KEYWORD_REFERENCES,
  SQL_KEYWORD_CHECK,
} from './constants';
import f from 'lodash/fp';
import { isComplexTypeObject } from './value-objects';

/**
 * Value object para coluna de tabela DuckDB (imutável).
 * Suporta tipos primitivos e complexos, métodos utilitários e geração de SQL.
 *
 * @example
 *   const col = new Column({ name: 'id', type: 'INTEGER', primary: true });
 *   col.toSQL(); // '"id" INTEGER PRIMARY KEY'
 */
export class Column {
  public readonly name: string;
  public readonly type: DuckDBColumnType | DuckDBComplexType;
  public readonly nullable: boolean;
  public readonly unique: boolean;
  public readonly primary: boolean;
  public readonly autoIncrement: boolean;
  public readonly defaultValue?: unknown;
  public readonly check?: string;
  public readonly references?: { table: string; column: string };

  constructor({
    name,
    type,
    nullable = true,
    unique = false,
    primary = false,
    primaryKey = false,
    autoIncrement = false,
    default: defaultValue,
    check,
    references,
  }: ITableColumn & { primaryKey?: boolean }) {
    this.name = String(name);
    this.type = type;
    this.nullable = Boolean(nullable);
    this.unique = Boolean(unique);
    this.primary = Boolean(primary || primaryKey); // compatível com ambos
    this.autoIncrement = Boolean(autoIncrement);
    this.defaultValue = defaultValue;
    this.check = check;
    this.references = references;
  }

  /** Checa se o tipo é complexo (Struct, List, Union, etc) */
  private isComplexType(): boolean {
    return typeof this.type === 'object' && this.type !== null && 'toSQL' in this.type;
  }

  /** Compara se duas colunas são idênticas */
  equals(other: Column): boolean {
    return (
      this.name === other.name &&
      f.isEqual(this.type, other.type) &&
      this.nullable === other.nullable &&
      this.unique === other.unique &&
      this.primary === other.primary &&
      this.autoIncrement === other.autoIncrement &&
      f.isEqual(this.defaultValue, other.defaultValue) &&
      this.check === other.check &&
      f.isEqual(this.references, other.references)
    );
  }

  /** Cria uma cópia da coluna com possíveis overrides */
  clone(overrides: Partial<ITableColumn> = {}): Column {
    return new Column({ ...this.toObject(), ...overrides });
  }

  /** Retorna a coluna como objeto plano */
  toObject(): ITableColumn {
    return {
      name: this.name,
      type: this.type,
      nullable: this.nullable,
      unique: this.unique,
      primary: this.primary,
      autoIncrement: this.autoIncrement,
      default: this.defaultValue,
      check: this.check,
      references: this.references,
    };
  }

  /** Gera o SQL para definição da coluna */
  toSQL(): string {
    const sqlParts = [
      `"${this.name}"`,
      isComplexTypeObject(this.type)
        ? this.type.toSQL()
        : f.isString(this.type)
        ? this.type
        : '[complex type]',
      this.primary ? SQL_KEYWORD_PRIMARY_KEY : '',
      this.unique ? SQL_KEYWORD_UNIQUE : '',
      this.nullable === false ? SQL_KEYWORD_NOT_NULL : '',
      !f.isNil(this.defaultValue)
        ? `${SQL_KEYWORD_DEFAULT} ${this.formatDefaultValue(this.defaultValue)}`
        : '',
      this.check ? `${SQL_KEYWORD_CHECK} (${this.check})` : '',
      this.references
        ? `${SQL_KEYWORD_REFERENCES} ${this.references.table}(${this.references.column})`
        : '',
    ];
    return sqlParts.filter(Boolean).join(' ');
  }

  /** Formata valor default para SQL */
  private formatDefaultValue(value: unknown): string {
    if (f.isString(value)) return `'${value.replace(/'/g, "''")}'`;
    if (f.isNil(value)) return 'NULL';
    return String(value);
  }
}
