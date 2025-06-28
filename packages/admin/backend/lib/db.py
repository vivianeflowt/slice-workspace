"""
Abstração centralizada para acesso ao DuckDB local.

- Encapsula conexão, execução e consulta ao banco.
- Interface simples: DB.execute, DB.fetchall, DB.fetchone.
- Oculta detalhes de path, conexão e parâmetros.
- Facilita manutenção, testes e futuras extensões.
- Segue SRP: toda lógica de banco fica isolada neste módulo.

Exemplo de uso:
    from lib.db import DB
    DB.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT)')
    DB.execute('INSERT INTO users VALUES (?, ?)', (1, 'Alice'))
    users = DB.fetchall('SELECT * FROM users')
"""
import duckdb
import os
from typing import Any, Optional, List, Tuple

DB_DIR = os.path.join(os.path.dirname(__file__), '..', 'db')
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, 'duckdb.db')

class DB:
    _conn = duckdb.connect(DB_PATH)

    @classmethod
    def execute(cls, sql: str, params: Optional[Tuple[Any, ...]] = None) -> None:
        if params:
            cls._conn.execute(sql, params)
        else:
            cls._conn.execute(sql)

    @classmethod
    def fetchall(cls, sql: str, params: Optional[Tuple[Any, ...]] = None) -> List[tuple]:
        if params:
            return cls._conn.execute(sql, params).fetchall()
        return cls._conn.execute(sql).fetchall()

    @classmethod
    def fetchone(cls, sql: str, params: Optional[Tuple[Any, ...]] = None) -> Optional[tuple]:
        if params:
            return cls._conn.execute(sql, params).fetchone()
        return cls._conn.execute(sql).fetchone()
