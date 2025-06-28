#!/bin/bash
set -e

clear

# Mata qualquer instância antiga do backend na porta 11111
pkill -f 'uvicorn main:app --host 0.0.0.0 --port 11111' 2>/dev/null || true
sleep 1

clear

# Inicia backend Python FastAPI (modo produção, sem reload, log em background)
cd "$(dirname "$0")/../backend" || exit 1
uvicorn main:app --host 0.0.0.0 --port 11111 >backend.log 2>&1 &
BACKEND_PID=$!

# Inicia frontend React (em primeiro plano)
cd ../ && pnpm dev

# (Opcional) Espera backend se desejar monitorar
# wait $BACKEND_PID
