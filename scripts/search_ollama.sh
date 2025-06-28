#!/bin/bash

echo "🔍 Procurando modelos do Ollama no sistema..."

# Padrões de arquivos típicos de modelos
MODELO_PADROES="*.gguf *.bin Modelfile"

# Diretórios comuns onde os modelos podem estar
DIRETORIOS_COMUNS=(
    "$HOME/.ollama"
    "/root/.ollama"
    "/usr/share"
    "/var/lib"
    "/mnt"
    "/media"
    "/opt"
)

# Lista para armazenar os resultados encontrados
modelos_encontrados=()

# Busca pelos modelos nos diretórios especificados
for diretorio_base in "${DIRETORIOS_COMUNS[@]}"; do
    if [ -d "$diretorio_base" ]; then
        echo "🔎 Checando: $diretorio_base"
        while IFS= read -r caminho_modelo; do
            modelos_encontrados+=("$caminho_modelo")
        done < <(find "$diretorio_base" -type f \( -name "*.gguf" -o -name "*.bin" -o -name "Modelfile" \) 2>/dev/null)
    fi
done

# Exibe os resultados
echo ""
if [ ${#modelos_encontrados[@]} -eq 0 ]; then
    echo "❌ Nenhum modelo encontrado."
else
    echo "✅ Modelos encontrados:"
    for modelo in "${modelos_encontrados[@]}"; do
        echo "   - $modelo"
    done
fi

# Dica para mover os modelos para um SSD
cat <<EOF

💡 Dica: Para mover os modelos para um SSD e apontar o Ollama para lá:

1. Mova os arquivos:
   mkdir -p /mnt/seu-ssd/ollama
   mv ~/.ollama/* /mnt/seu-ssd/ollama/

2. Configure a variável de ambiente no .bashrc ou .zshrc:
   export OLLAMA_MODELS="/mnt/seu-ssd/ollama"

3. Rode novamente o terminal ou use: source ~/.bashrc

EOF

# SSD_MODELS_DIR="/mnt/seu-ssd/ollama"

# if [ ! -d "$SSD_MODELS_DIR" ]; then
#     echo "📁 Criando diretório para modelos no SSD: $SSD_MODELS_DIR"
#     sudo mkdir -p "$SSD_MODELS_DIR"
# fi

# if [ -d "$HOME/.ollama" ]; then
#     echo "🚚 Movendo modelos existentes para o SSD..."
#     mv "$HOME/.ollama"/* "$SSD_MODELS_DIR/"
# fi

# echo "🔧 Configurando variável de ambiente OLLAMA_MODELS..."
# export OLLAMA_MODELS="$SSD_MODELS_DIR"
# echo 'export OLLAMA_MODELS="/mnt/seu-ssd/ollama"' >> ~/.bashrc
# source ~/.bashrc
