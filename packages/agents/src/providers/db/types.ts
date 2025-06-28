import {
  SQL_COMPLEX_DATA_TYPES,
  SQL_CONSTRAINT_CHECK,
  SQL_CONSTRAINT_FOREIGN_KEY,
  SQL_CONSTRAINT_PRIMARY_KEY,
  SQL_CONSTRAINT_TYPES,
  SQL_CONSTRAINT_UNIQUE,
  SQL_DATA_TYPES,
  SQL_TYPE_LIST,
  SQL_TYPE_STRUCT,
  SQL_TYPE_UNION,
} from './constants';

// Types and interfaces for defining columns, constraints, complex types, and DuckDB schemas
// Used in value objects, Table, Column, and integration with Adapter

// Tipos principais para abstração DuckDB

/**
 * Tipos primitivos suportados pelo DuckDB
 */
export type DuckDBColumnType =
  | 'TINYINT'
  | 'UTINYINT'
  | 'SMALLINT'
  | 'USMALLINT'
  | 'INTEGER'
  | 'UINTEGER'
  | 'BIGINT'
  | 'UBIGINT'
  | 'HUGEINT'
  | 'FLOAT'
  | 'DOUBLE'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'VARCHAR'
  | 'STRING'
  | 'DATE'
  | 'TIMESTAMP'
  | 'TIME'
  | 'INTERVAL'
  | 'BLOB'
  | 'UUID'
  | 'JSON'
  | 'BIT'
  | 'BITSTRING';

/**
 * Tipos complexos (struct, list, union, etc)
 */
export type DuckDBComplexType =
  | { type: 'STRUCT'; fields: Record<string, DuckDBColumnType | DuckDBComplexType> }
  | { type: 'LIST'; elementType: DuckDBColumnType | DuckDBComplexType }
  | { type: 'UNION'; memberTypes: (DuckDBColumnType | DuckDBComplexType)[] };

// Complex type abstractions
export interface IStructType {
  type: typeof SQL_TYPE_STRUCT;
  fields: { [fieldName: string]: DuckDBColumnType | IStructType | IListType | IUnionType };
}
export interface IListType {
  type: typeof SQL_TYPE_LIST;
  elementType: DuckDBColumnType | IStructType | IUnionType | IListType;
}
export interface IUnionType {
  type: typeof SQL_TYPE_UNION;
  memberTypes: (DuckDBColumnType | IStructType | IListType)[];
}

/**
 * Definição de coluna de tabela
 */
export interface ITableColumn {
  name: string;
  type: DuckDBColumnType | DuckDBComplexType;
  nullable?: boolean;
  unique?: boolean;
  primary?: boolean;
  autoIncrement?: boolean;
  default?: unknown;
  check?: string;
  references?: { table: string; column: string };
}

/**
 * Definição de índice de tabela
 */
export interface ITableIndex {
  name: string;
  columns: string[];
  unique?: boolean;
}

/**
 * Definição de constraint de tabela
 */
export interface TableConstraintType {
  type: string;
  name?: string;
  columns?: string[];
  expression?: string;
  references?: { table: string; columns: string[] };
}

export type ConstraintType = (typeof SQL_CONSTRAINT_TYPES)[number];

export interface IDuckDBColumnSchema {
  name: string;
  type: string;
}

export interface IDuckDBTableSchema {
  columns: IDuckDBColumnSchema[];
}

export type DuckDBDatabaseSchema = Record<string, IDuckDBTableSchema>;
