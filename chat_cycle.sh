#!/bin/bash
# chat_cycle.sh — Wrapper para rodar o chat_cycle.py de qualquer lugar do projeto

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/scripts/chat_cycle.py" "$@"
