import duckdb
import os

DB_DIR = os.path.join(os.path.dirname(__file__), '..', 'db')
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, 'duckdb.db')

# Conexão padrão para uso em todo o backend
conn = duckdb.connect(DB_PATH)
