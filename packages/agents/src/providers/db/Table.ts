import { Column } from './Column';
import {
  SQL_ADD_CONSTRAINT,
  SQL_CONSTRAINT_CHECK,
  SQL_CONSTRAINT_FOREIGN_KEY,
  SQL_CONSTRAINT_PRIMARY_KEY,
  SQL_CONSTRAINT_UNIQUE,
  SQL_KEYWORD_ADD_COLUMN,
  SQL_KEYWORD_ALTER_TABLE,
  SQL_KEYWORD_CREATE_INDEX,
  SQL_KEYWORD_CREATE_TABLE,
  SQL_KEYWORD_DEFAULT,
  SQL_KEYWORD_DROP_COLUMN,
  SQL_KEYWORD_DROP_CONSTRAINT,
  SQL_KEYWORD_DROP_INDEX_IF_EXISTS,
  SQL_KEYWORD_DROP_TABLE_IF_EXISTS,
  SQL_KEYWORD_IF_NOT_EXISTS,
  SQL_KEYWORD_NOT_NULL,
  SQL_KEYWORD_REFERENCES,
  SQL_KEYWORD_RENAME_COLUMN,
  SQL_KEYWORD_RENAME_TO,
  SQL_KEYWORD_SET_DATA_TYPE,
  SQL_TYPE_LIST,
  SQL_TYPE_STRUCT,
  SQL_TYPE_UNION,
} from './constants';
import { DuckDBColumnType, DuckDBComplexType, TableConstraintType, ITableIndex } from './types';

// SQL_KEYWORD_ON não existe em constants, definir localmente:
// eslint-disable-next-line @typescript-eslint/naming-convention
const SQL_KEYWORD_ON = 'ON';

/**
 * Value object para tabela DuckDB, geração de SQL DDL, constraints, índices.
 * Métodos para adicionar/remover colunas, índices, constraints.
 *
 * @example
 *   const table = new Table('users').addColumn(new Column({ name: 'id', type: 'INTEGER' }));
 *   table.toCreateTableSQL(); // 'CREATE TABLE IF NOT EXISTS ...'
 */
export class Table {
  public name: string;
  public columns: Column[] = [];
  public indexes: ITableIndex[] = [];
  public constraints: TableConstraintType[] = [];
  public ifNotExists = true;

  constructor(name: string) {
    this.name = name;
  }

  /** Adiciona uma coluna, evitando duplicidade */
  addColumn(column: Column): this {
    if (this.columns.some((c) => c.name === column.name)) {
      throw new Error(`Coluna '${column.name}' já existe na tabela '${this.name}'`);
    }
    this.columns.push(column);
    return this;
  }

  /** Adiciona múltiplas colunas, evitando duplicidade */
  addColumns(columns: Column[]): this {
    columns.forEach((col) => this.addColumn(col));
    return this;
  }

  /** Remove uma coluna pelo nome */
  removeColumn(columnName: string): this {
    this.columns = this.columns.filter((c) => c.name !== columnName);
    return this;
  }

  /** Adiciona um índice, evitando duplicidade */
  addIndex(index: ITableIndex): this {
    if (this.indexes.some((i) => i.name === index.name)) {
      throw new Error(`Índice '${index.name}' já existe na tabela '${this.name}'`);
    }
    this.indexes.push(index);
    return this;
  }

  /** Remove um índice pelo nome */
  removeIndex(indexName: string): this {
    this.indexes = this.indexes.filter((i) => i.name !== indexName);
    return this;
  }

  /** Adiciona uma constraint, evitando duplicidade por nome */
  addConstraint(constraint: TableConstraintType): this {
    if (constraint.name && this.constraints.some((c) => c.name === constraint.name)) {
      throw new Error(`Constraint '${constraint.name}' já existe na tabela '${this.name}'`);
    }
    this.constraints.push(constraint);
    return this;
  }

  /** Remove uma constraint pelo nome */
  removeConstraint(constraintName: string): this {
    this.constraints = this.constraints.filter((c) => c.name !== constraintName);
    return this;
  }

  private getDuckDBTypeSQL(type: DuckDBComplexType | DuckDBColumnType): string {
    if (typeof type === 'object' && type !== null && 'toSQL' in type && typeof (type as any).toSQL === 'function') {
      return (type as any).toSQL();
    }
    if (typeof type === 'string') return type;
    return 'UNKNOWN';
  }

  private formatDefaultValue(value: unknown): string {
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (value === null) return 'NULL';
    return String(value);
  }

  private getColumnDefinition(col: Column): string {
    const columnParts = [
      `"${col.name}"`,
      this.getDuckDBTypeSQL(col.type),
      col.primary ? SQL_CONSTRAINT_PRIMARY_KEY : '',
      col.unique ? SQL_CONSTRAINT_UNIQUE : '',
      col.nullable === false ? SQL_KEYWORD_NOT_NULL : '',
      col.defaultValue !== undefined
        ? `${SQL_KEYWORD_DEFAULT} ${this.formatDefaultValue(col.defaultValue)}`
        : '',
      col.check ? `${SQL_CONSTRAINT_CHECK} (${col.check})` : '',
      col.references
        ? `${SQL_KEYWORD_REFERENCES} ${col.references.table}(${col.references.column})`
        : '',
    ];
    return columnParts.filter(Boolean).join(' ');
  }

  private getConstraintDefinition(constraint: TableConstraintType): string | null {
    return formatConstraintSQL(constraint);
  }

  /** Gera SQL CREATE TABLE com colunas e constraints */
  toCreateTableSQL(): string {
    const columnDefs = this.columns.map((col) => this.getColumnDefinition(col));
    const constraintDefs = this.constraints
      .map((constraint) => this.getConstraintDefinition(constraint))
      .filter(Boolean) as string[];
    const allDefs = [...columnDefs, ...constraintDefs];
    const ifNotExistsSQL = this.ifNotExists ? `${SQL_KEYWORD_IF_NOT_EXISTS} ` : '';
    return `${SQL_KEYWORD_CREATE_TABLE} ${ifNotExistsSQL}"${this.name}" (\n  ${allDefs.join(',\n  ')}\n);`;
  }

  toAddColumnSQL(column: Column): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_KEYWORD_ADD_COLUMN} ${this.getColumnDefinition(column)};`;
  }

  toCreateIndexSQL(index: ITableIndex): string {
    const uniqueSQL = index.unique ? `${SQL_CONSTRAINT_UNIQUE} ` : '';
    return `${SQL_KEYWORD_CREATE_INDEX} ${uniqueSQL}"${index.name}" ${SQL_KEYWORD_ON} "${this.name}" (${index.columns.map((n: string) => `"${n}"`).join(', ')});`;
  }

  toAddConstraintSQL(constraint: TableConstraintType): string {
    const constraintSQL = formatConstraintSQL(constraint);
    if (!constraintSQL)
      throw new Error('Tipo de constraint não suportado ou dados insuficientes');
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_ADD_CONSTRAINT} "${constraint.name ?? ''}" ${constraintSQL};`;
  }

  toSQLScript(): string {
    const statements = [this.toCreateTableSQL()];
    statements.push(...this.indexes.map((idx) => this.toCreateIndexSQL(idx)));
    statements.push(
      ...this.constraints
        .filter((c) => c.type === SQL_CONSTRAINT_CHECK || c.type === SQL_CONSTRAINT_FOREIGN_KEY)
        .map((c) => this.toAddConstraintSQL(c)),
    );
    return statements.join('\n');
  }

  toDropTableSQL(): string {
    return `${SQL_KEYWORD_DROP_TABLE_IF_EXISTS} "${this.name}";`;
  }

  toDropIndexSQL(indexName: string): string {
    return `${SQL_KEYWORD_DROP_INDEX_IF_EXISTS} "${indexName}";`;
  }

  toDropConstraintSQL(constraintName: string): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_KEYWORD_DROP_CONSTRAINT} "${constraintName}";`;
  }

  toRenameTableSQL(newName: string): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_KEYWORD_RENAME_TO} "${newName}";`;
  }

  toRenameColumnSQL(oldName: string, newName: string): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_KEYWORD_RENAME_COLUMN} "${oldName}" TO "${newName}";`;
  }

  toAlterColumnTypeSQL(columnName: string, newType: DuckDBComplexType | DuckDBColumnType): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ALTER COLUMN "${columnName}" ${SQL_KEYWORD_SET_DATA_TYPE} ${this.getDuckDBTypeSQL(newType)};`;
  }

  toDropColumnSQL(columnName: string): string {
    return `${SQL_KEYWORD_ALTER_TABLE} "${this.name}" ${SQL_KEYWORD_DROP_COLUMN} "${columnName}";`;
  }
}

// Helper para gerar SQL de constraints
function formatConstraintSQL(constraint: TableConstraintType): string | null {
  switch (constraint.type) {
    case SQL_CONSTRAINT_PRIMARY_KEY:
    case SQL_CONSTRAINT_UNIQUE:
      return constraint.columns && constraint.columns.length
        ? `${constraint.type} (${constraint.columns.map((col) => `"${col}"`).join(', ')})`
        : null;
    case SQL_CONSTRAINT_CHECK:
      return constraint.expression ? `${SQL_CONSTRAINT_CHECK} (${constraint.expression})` : null;
    case SQL_CONSTRAINT_FOREIGN_KEY:
      return constraint.columns && constraint.references
        ? `${SQL_CONSTRAINT_FOREIGN_KEY} (${constraint.columns.map((col) => `"${col}"`).join(', ')}) ${SQL_KEYWORD_REFERENCES} ${constraint.references.table}(${constraint.references.columns.map((col) => `"${col}"`).join(', ')})`
        : null;
    default:
      return null;
  }
}
