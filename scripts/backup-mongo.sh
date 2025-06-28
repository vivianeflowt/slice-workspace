#!/bin/bash
set -e

# Nome do container MongoDB (ajuste se necessário)
MONGO_CONTAINER="mongo"
# Diretório de destino do backup
BACKUP_DIR="$(dirname "$0")/mongo-backup"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
DUMP_PATH="$BACKUP_DIR/dump-$TIMESTAMP"

mkdir -p "$BACKUP_DIR"

echo "[MCP] Iniciando backup do MongoDB do container '$MONGO_CONTAINER' para '$DUMP_PATH'..."
docker exec "$MONGO_CONTAINER" mongodump --archive --gzip >"$DUMP_PATH.archive.gz"

if [ $? -eq 0 ]; then
    echo "[MCP] Backup concluído com sucesso: $DUMP_PATH.archive.gz"
else
    echo "[MCP] Erro no backup do MongoDB." >&2
    exit 1
fi
