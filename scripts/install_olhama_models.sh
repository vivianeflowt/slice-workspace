#!/bin/bash
# Script para baixar todos os modelos listados no Ollama

MODELS=(
    "gemma:2b"
    "gemma:7b"
    "mistral:7b"
    "openchat:7b"
    "llava:13b"
    "mixtral:8x7b"
    "mixtral:8x22b"
)

for model in "${MODELS[@]}"; do
    echo "Baixando modelo: $model..."
    trickle -d 100 ollama pull "$model" || echo "⚠️ Falha ao baixar $model, verifique manualmente."
    # ollama pull "$model" || echo "⚠️ Falha ao baixar $model, verifique manualmente."
done

echo "Removendo modelos não utilizados..."
ollama list | awk 'NR>1 {print $1}' | while read -r model; do
    keep=false
    for m in "${MODELS[@]}"; do
        if [[ "$model" == "$m" ]]; then
            keep=true
            break
        fi
    done
    if [ "$keep" = false ]; then
        echo "Removendo modelo extra: $model"
        ollama rm "$model"
    fi
done

echo "✅ Todos os modelos processados e ambiente limpo."
