#!/bin/bash
set -e

# Nome do container MongoDB (ajuste se necessário)
MONGO_CONTAINER="mongo"
# Diretório dos backups
BACKUP_DIR="$(dirname "$0")/mongo-backup"

if [ -z "$1" ]; then
    echo "Uso: $0 <arquivo-backup.archive.gz>"
    echo "Exemplo: $0 dump-20240607-153000.archive.gz"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "[MCP] Arquivo de backup não encontrado: $BACKUP_FILE" >&2
    exit 2
fi

echo "[MCP] Restaurando backup do MongoDB do arquivo '$BACKUP_FILE' para o container '$MONGO_CONTAINER'..."
cat "$BACKUP_FILE" | docker exec -i "$MONGO_CONTAINER" mongorestore --archive --gzip --drop

if [ $? -eq 0 ]; then
    echo "[MCP] Restore concluído com sucesso."
else
    echo "[MCP] Erro ao restaurar backup do MongoDB." >&2
    exit 1
fi
