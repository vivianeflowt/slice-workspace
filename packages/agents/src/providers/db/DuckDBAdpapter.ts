import { DuckDBConnection, DuckDBInstance, DuckDBValue } from '@duckdb/node-api';
import path from 'path';
import { Readable } from 'stream';
import { DuckDBColumnType } from './types';
import { Table } from './Table';
import { Column } from './Column';
import { RecordRow } from './RecordRow';
import f from 'lodash/fp';

// Constantes para comandos de transação
export const SQL_BEGIN = 'BEGIN';
export const SQL_COMMIT = 'COMMIT';
export const SQL_ROLLBACK = 'ROLLBACK';

export interface IDuckDBConfig {
  [configKey: string]: string;
}

export type DuckDBUDF = (...args: unknown[]) => unknown;

/**
 * Adapter para integração com DuckDB.
 * Mapeia tipos, executa SQL, permite hooks de logging/auditoria.
 *
 * @example
 *   const adapter = new DuckDBAdapter();
 *   adapter.mapColumnType('INTEGER'); // 'INTEGER'
 */
export class DuckDBAdapter {
  private duckDBInstance?: DuckDBInstance;
  private duckDBConnection?: DuckDBConnection;
  private readonly databaseFilePath: string;
  private isClosed = false;
  private isInTransaction = false;
  private registeredUDFs: { name: string; fn: DuckDBUDF }[] = [];

  private constructor(databaseFilePath: string) {
    this.databaseFilePath = databaseFilePath;
  }

  /**
   * Cria e inicializa um adapter DuckDB.
   * @param databaseFilePath Caminho do arquivo DuckDB ou ':memory:' para banco temporário em memória.
   * Exemplo: DuckDBAdapter.create(':memory:') ou DuckDBAdapter.create('data/main.duckdb')
   */
  static async create(databaseFilePath = ':memory:'): Promise<DuckDBAdapter> {
    const adapter = new DuckDBAdapter(databaseFilePath);
    await adapter.init();
    return adapter;
  }

  private async init(): Promise<void> {
    this.duckDBInstance = await DuckDBInstance.create(this.databaseFilePath);
    this.duckDBConnection = await this.duckDBInstance.connect();
  }

  private get connection(): DuckDBConnection {
    if (!this.duckDBConnection) throw new Error('DuckDB connection not initialized');
    return this.duckDBConnection;
  }

  /**
   * Executa SQL (stub, depende de implementação real)
   */
  async execute(sql: string): Promise<any> {
    // Implementação real depende do driver DuckDB
    throw new Error('Not implemented');
  }

  async query<T = unknown>(sql: string, parameters?: DuckDBValue[] | Record<string, DuckDBValue>): Promise<T[]> {
    try {
      const result = await this.connection.run(sql, parameters);
      if (typeof result.getRowObjects === 'function') {
        return (await result.getRowObjects()) as T[];
      }
      return [];
    } catch (error: unknown) {
      this.handleError(error, sql);
      return [];
    }
  }

  async fetchAll<T = unknown>(sql: string, parameters?: DuckDBValue[] | Record<string, DuckDBValue>): Promise<T[]> {
    return this.query<T>(sql, parameters);
  }

  async fetchOne<T = unknown>(sql: string, parameters?: DuckDBValue[] | Record<string, DuckDBValue>): Promise<T | undefined> {
    const resultRows = await this.query<T>(sql, parameters);
    return resultRows[0];
  }

  /**
   * Executa um bloco dentro de uma transação, garantindo commit/rollback automático.
   */
  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await fn();
      await this.commitTransaction();
      return result;
    } catch (err) {
      await this.rollbackTransaction();
      throw err;
    }
  }

  /**
   * Prepara um statement do DuckDB para uso manual (prepared statements).
   */
  async prepareStatement(sql: string): Promise<unknown> {
    if (!this.duckDBConnection) throw new Error('DuckDB connection not initialized');
    return this.duckDBConnection.prepare(sql);
  }

  /**
   * Stream de resultados (stub, depende de implementação real)
   *  Limitação: streaming real depende do driver e pode não ser suportado em todos ambientes.
   */
  async *stream(sql: string): AsyncGenerator<RecordRow, void, unknown> {
    throw new Error('Not implemented');
  }

  async importCSV(csvFilePath: string, tableName: string): Promise<void> {
    const absolutePath = path.resolve(csvFilePath);
    await this.execute(`COPY ${tableName} FROM '${absolutePath}' (AUTO_DETECT TRUE, HEADER TRUE)`);
  }

  async importJSON(jsonFilePath: string, tableName: string): Promise<void> {
    const absolutePath = path.resolve(jsonFilePath);
    await this.execute(`COPY ${tableName} FROM '${absolutePath}' (FORMAT JSON)`);
  }

  async beginTransaction(): Promise<void> {
    await this.execute(SQL_BEGIN);
    this.isInTransaction = true;
  }

  async commitTransaction(): Promise<void> {
    await this.execute(SQL_COMMIT);
    this.isInTransaction = false;
  }

  async rollbackTransaction(): Promise<void> {
    await this.execute(SQL_ROLLBACK);
    this.isInTransaction = false;
  }

  async close(): Promise<void> {
    const connection = this.duckDBConnection as unknown as { close?: () => Promise<void> };
    if (connection && typeof connection.close === 'function') {
      await connection.close();
      this.duckDBConnection = undefined;
    }
    const instance = this.duckDBInstance as unknown as { close?: () => Promise<void> };
    if (instance && typeof instance.close === 'function') {
      await instance.close();
      this.duckDBInstance = undefined;
      this.isClosed = true;
    }
  }

  /**
   * Registra uma UDF (User Defined Function) no banco.
   */
  registerUDF(name: string, fn: DuckDBUDF): void {
    this.registeredUDFs.push({ name, fn });
  }

  /**
   * Remove uma UDF registrada.
   */
  unregisterUDF(name: string): void {
    this.registeredUDFs = this.registeredUDFs.filter((u) => u.name !== name);
  }

  /**
   * Mapeia um tipo JS/TS para um tipo SQL DuckDB
   */
  mapColumnType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
      case 'text':
        return 'VARCHAR';
      case 'number':
      case 'float':
      case 'double':
        return 'DOUBLE';
      case 'int':
      case 'integer':
        return 'INTEGER';
      case 'boolean':
      case 'bool':
        return 'BOOLEAN';
      case 'date':
        return 'DATE';
      case 'datetime':
        return 'TIMESTAMP';
      case 'json':
        return 'JSON';
      default:
        return type.toUpperCase();
    }
  }

  private handleError(error: unknown, query?: string): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: string }).message === 'string' &&
      (error as { message: string }).message.includes('syntax error')
    ) {
      throw new QuerySyntaxError((error as { message: string }).message, query);
    }
    throw error;
  }

  /** Hooks para logging/auditoria (estrutura básica) */
  on(event: 'query' | 'error', handler: (info: any) => void): void {
    // Implementação real: registrar handler para eventos
  }
}

export class QuerySyntaxError extends Error {
  constructor(message: string, public query?: string) {
    super(message);
    this.name = 'QuerySyntaxError';
  }
}
