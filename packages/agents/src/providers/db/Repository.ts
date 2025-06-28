import { castArray } from 'lodash';
import { DuckDBValue } from '@duckdb/node-api';
import { DuckDBAdapter } from './DuckDBAdpapter';
import { RecordRow } from './RecordRow';
import {
  SQL_KEYWORD_SELECT,
  SQL_KEYWORD_FROM,
  SQL_KEYWORD_WHERE,
  SQL_KEYWORD_UPDATE,
  SQL_KEYWORD_DELETE,
  SQL_KEYWORD_INSERT,
  SQL_KEYWORD_VALUES,
  SQL_KEYWORD_SET,
  SQL_KEYWORD_AND,
  SQL_KEYWORD_LIMIT,
} from './constants';
import { Table } from './Table';
import f from 'lodash/fp';

// Abstract repository for generic CRUD operations on DuckDB tables
// Uses RecordRow for return values and constants for SQL

// Type conversion utilities for DuckDB compatibility
function convertToDuckDBValue(value: unknown): DuckDBValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'bigint') return Number(value);
  return String(value);
}

function convertToDuckDBValueArray(values: unknown[]): DuckDBValue[] {
  return values.map(convertToDuckDBValue);
}

export interface IDuckDBRepositoryOptions {
  adapter: DuckDBAdapter;
  tableName: string;
  primaryKeyColumn: string | string[];
}

export abstract class DuckDBRepository {
  protected readonly adapter: DuckDBAdapter;
  protected readonly tableName: string;
  protected readonly primaryKeyColumns: string[];

  constructor(options: IDuckDBRepositoryOptions) {
    this.adapter = options.adapter;
    this.tableName = options.tableName;
    this.primaryKeyColumns = castArray(options.primaryKeyColumn);
  }

  async findAll(): Promise<RecordRow[]> {
    const rows = await this.adapter.fetchAll<unknown>(
      `${SQL_KEYWORD_SELECT} * ${SQL_KEYWORD_FROM} ${this.tableName}`
    );
    return rows.map((row) => new RecordRow(row as Record<string, unknown>));
  }

  async findOneByField(fieldName: string, value: unknown): Promise<RecordRow | null> {
    const row = await this.adapter.fetchOne<unknown>(
      `${SQL_KEYWORD_SELECT} * ${SQL_KEYWORD_FROM} ${this.tableName} ${SQL_KEYWORD_WHERE} ${String(fieldName)} = ? ${SQL_KEYWORD_LIMIT} 1`,
      [convertToDuckDBValue(value)]
    );
    return row ? new RecordRow(row as Record<string, unknown>) : null;
  }

  async findById(primaryKeyValue: number | string): Promise<RecordRow | null> {
    const row = await this.adapter.fetchOne<unknown>(
      `${SQL_KEYWORD_SELECT} * ${SQL_KEYWORD_FROM} ${this.tableName} ${SQL_KEYWORD_WHERE} ${this.primaryKeyColumns.join(` ${SQL_KEYWORD_AND} `)} = ? ${SQL_KEYWORD_LIMIT} 1`,
      [convertToDuckDBValue(primaryKeyValue)]
    );
    return row ? new RecordRow(row as Record<string, unknown>) : null;
  }

  async findManyByField(fieldName: string, value: unknown): Promise<RecordRow[]> {
    const rows = await this.adapter.fetchAll<unknown>(
      `${SQL_KEYWORD_SELECT} * ${SQL_KEYWORD_FROM} ${this.tableName} ${SQL_KEYWORD_WHERE} ${String(fieldName)} = ?`,
      [convertToDuckDBValue(value)]
    );
    return rows.map((row) => new RecordRow(row as Record<string, unknown>));
  }

  async insert(recordToInsert: Record<string, unknown>): Promise<void> {
    const keys = Object.keys(recordToInsert);
    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = convertToDuckDBValueArray(keys.map((key) => recordToInsert[key]));
    await this.adapter.execute(
      `${SQL_KEYWORD_INSERT} ${this.tableName} (${columns}) ${SQL_KEYWORD_VALUES} (${placeholders})`,
      values
    );
  }

  async update(
    primaryKeyValue: number | string,
    fieldsToUpdate: Record<string, unknown>
  ): Promise<void> {
    const keys = Object.keys(fieldsToUpdate);
    const setClause = keys.map((column) => `${column} = ?`).join(', ');
    const values = keys.map((key) => fieldsToUpdate[key]);
    await this.adapter.execute(
      `${SQL_KEYWORD_UPDATE} ${this.tableName} ${SQL_KEYWORD_SET} ${setClause} ${SQL_KEYWORD_WHERE} ${this.primaryKeyColumns.join(` ${SQL_KEYWORD_AND} `)} = ?`,
      [...values, primaryKeyValue]
    );
  }

  async delete(primaryKeyValue: number | string): Promise<void> {
    await this.adapter.execute(
      `${SQL_KEYWORD_DELETE} ${SQL_KEYWORD_FROM} ${this.tableName} ${SQL_KEYWORD_WHERE} ${this.primaryKeyColumns.join(` ${SQL_KEYWORD_AND} `)} = ?`,
      [primaryKeyValue]
    );
  }
}

/**
 * Repositório para operações CRUD em tabela DuckDB.
 * Gera SQL seguro para insert, update, delete, select, incluindo múltiplas PKs.
 *
 * @example
 *   const repo = new Repository(table);
 *   repo.insert({ id: 1, name: 'Alice' });
 *   repo.update({ id: 1 }, { name: 'Bob' });
 */
export class Repository<T extends Record<string, any> = any> {
  public readonly table: Table;

  constructor(table: Table) {
    this.table = table;
  }

  /** Gera SQL de insert para um registro */
  insert(row: T): string {
    const keys = Object.keys(row) as (keyof T)[];
    const values = keys.map((k) => this.formatValue(row[k as keyof T]));
    return `INSERT INTO "${this.table.name}" (${keys.map((k) => `"${String(k)}"`).join(', ')}) VALUES (${values.join(', ')});`;
  }

  /** Gera SQL de insert para múltiplos registros */
  insertMany(rows: T[]): string[] {
    return rows.map((row) => this.insert(row));
  }

  /** Gera SQL de update para um registro, usando PK(s) */
  update(pk: Partial<T>, updates: Partial<T>): string {
    const pkCols = this.getPrimaryKeys() as (keyof T)[];
    if (pkCols.length === 0) throw new Error('Tabela sem primary key');
    const setSQL = Object.entries(updates)
      .map(([k, v]) => `"${k}" = ${this.formatValue(v)}`)
      .join(', ');
    const whereSQL = pkCols.map((k) => `"${String(k)}" = ${this.formatValue(pk[k as keyof T])}`).join(' AND ');
    return `UPDATE "${this.table.name}" SET ${setSQL} WHERE ${whereSQL};`;
  }

  /** Gera SQL de update para múltiplos registros */
  updateMany(pks: Partial<T>[], updates: Partial<T>[]): string[] {
    return pks.map((pk, i) => this.update(pk, updates[i]));
  }

  /** Gera SQL de delete para um registro, usando PK(s) */
  delete(pk: Partial<T>): string {
    const pkCols = this.getPrimaryKeys() as (keyof T)[];
    if (pkCols.length === 0) throw new Error('Tabela sem primary key');
    const whereSQL = pkCols.map((k) => `"${String(k)}" = ${this.formatValue(pk[k as keyof T])}`).join(' AND ');
    return `DELETE FROM "${this.table.name}" WHERE ${whereSQL};`;
  }

  /** Gera SQL de delete para múltiplos registros */
  deleteMany(pks: Partial<T>[]): string[] {
    return pks.map((pk) => this.delete(pk));
  }

  /** Gera SQL de select para todos os registros */
  selectAll(): string {
    return `SELECT * FROM "${this.table.name}";`;
  }

  /** Gera SQL de select por PK(s) */
  selectByPK(pk: Partial<T>): string {
    const pkCols = this.getPrimaryKeys() as (keyof T)[];
    if (pkCols.length === 0) throw new Error('Tabela sem primary key');
    const whereSQL = pkCols.map((k) => `"${String(k)}" = ${this.formatValue(pk[k as keyof T])}`).join(' AND ');
    return `SELECT * FROM "${this.table.name}" WHERE ${whereSQL};`;
  }

  /** Retorna nomes das PKs da tabela */
  getPrimaryKeys(): string[] {
    return this.table.columns.filter((c) => c.primary).map((c) => c.name);
  }

  private formatValue(value: any): string {
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (value === null || value === undefined) return 'NULL';
    return String(value);
  }
}
