#!/bin/bash
set -euo pipefail

# Caminho para o script de pipeline de relevância incremental (pré-processamento dos chunks)
PIPELINE_SCRIPT="scripts/pipeline_relevancia_incremental.ts"

# Caminho para o script principal de brainstorm multi-IA
BRAINSTORM_SCRIPT="src/bainstorm.ts"

# Número de iterações do ciclo brainstorm+pipeline (ajuste para rodar múltiplas vezes)
LOOP_COUNT=5

clear
for ((i=1; i<=LOOP_COUNT; i++)); do
    echo -e "\n🧠 Iniciando processo de brainstorm... (Iteração $i de $LOOP_COUNT)\n"

    # Pipeline
    npx tsx "$PIPELINE_SCRIPT"
    echo -e "\n✅ Pipeline concluído\n"
    # Remove resultados e chunks existentes e recria estrutura

    # Brainstorm
    npx tsx "$BRAINSTORM_SCRIPT"
    echo -e "\n✅ Brainstorm concluído. Resultados em tmp/BRAINSTORM-RESULTS.md\n"
done
