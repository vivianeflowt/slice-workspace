import { DuckDBInstance, DuckDBConnection } from '@duckdb/node-api';
import { DuckDBAdapter } from './DuckDBAdpapter';
import { DuckDBColumnType, DuckDBDatabaseSchema, IDuckDBTableSchema, ITableColumn } from './types';
import f from 'lodash/fp';

// Otimiza o mapeamento de tipos de coluna
export function mapToDuckDBColumnType(
  adapter: DuckDBAdapter,
  columnType: string,
): DuckDBColumnType {
  if (!columnType) {
    throw new Error('Column type is required');
  }
  return adapter.mapColumnType(columnType);
}

// Converte schema DuckDB para formato da tabela
export function convertDuckDBSchemaToTableColumns(
  adapter: DuckDBAdapter,
  tableSchema: IDuckDBTableSchema,
): ITableColumn[] {
  if (!tableSchema?.columns) {
    return [];
  }

  return tableSchema.columns.map((column): ITableColumn => {
    if (!column.name || !column.type) {
      throw new Error(`Invalid column definition: name and type are required`);
    }
    return {
      name: column.name,
      type: mapToDuckDBColumnType(adapter, column.type),
      nullable: true,
    };
  });
}

// Helper para fechar conexões com segurança
async function safeCloseConnection(connection: unknown): Promise<void> {
  if (connection && typeof (connection as { close: () => Promise<void> }).close === 'function') {
    await (connection as { close: () => Promise<void> }).close();
  }
}

// Otimização da exportação do schema do banco
export async function exportDuckDBDatabaseSchema(
  databaseFilePath: string,
): Promise<DuckDBDatabaseSchema> {
  let duckDB: DuckDBInstance | undefined;
  let connection: DuckDBConnection | undefined;

  try {
    duckDB = await DuckDBInstance.create(databaseFilePath);
    connection = await duckDB.connect();

    const schemaQuery = "WITH table_list AS MATERIALIZED (SELECT t.table_name FROM information_schema.tables t WHERE t.table_schema = 'main'), " +
      "column_info AS MATERIALIZED (SELECT c.table_name, c.column_name, c.data_type, c.ordinal_position FROM information_schema.columns c " +
      "JOIN table_list tl ON c.table_name = tl.table_name WHERE c.table_schema = 'main') " +
      "SELECT ci.table_name, ci.column_name, ci.data_type FROM column_info ci ORDER BY ci.table_name, ci.ordinal_position;";

    const queryResult = await connection.run(schemaQuery);
    const rawRows = await queryResult.getRowObjects();

    const databaseSchema = rawRows.reduce<DuckDBDatabaseSchema>((schema, row: Record<string, unknown>) => {
      const tableName = String(row.table_name);
      const columnName = String(row.column_name);
      const dataType = String(row.data_type);

      if (!schema[tableName]) {
        schema[tableName] = { columns: [] };
      }

      schema[tableName].columns.push({
        name: columnName,
        type: dataType,
      });

      return schema;
    }, {});

    return databaseSchema;

  } finally {
    try {
      await safeCloseConnection(connection);
      await safeCloseConnection(duckDB);
    } catch (error) {
      console.error('Error closing DuckDB connections:', error);
    }
  }
}

/**
 * Utilitários para manipulação de schemas e conversão de dados DuckDB.
 *
 * @example
 *   const obj = duckdbRowToObject(['id', 'name'], [1, 'Alice']);
 *   // { id: 1, name: 'Alice' }
 */
export function duckdbRowToObject(columns: string[], values: any[]): Record<string, any> {
  if (columns.length !== values.length) {
    throw new Error('Colunas e valores de tamanhos diferentes');
  }
  return f.zipObject(columns, values);
}

/**
 * Valida e importa schema (stub, depende de implementação real)
 */
export function importSchema(schema: any): any {
  // Exemplo: validar se schema é objeto ou função
  if (!schema || (typeof schema !== 'object' && typeof schema !== 'function')) {
    throw new Error('Schema inválido');
  }
  // Retornar schema processado (stub)
  return schema;
}
