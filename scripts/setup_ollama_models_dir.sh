#!/bin/zsh
# Script robusto para configurar e garantir funcionamento do Ollama como serviço systemd
# Uso: sudo ./setup_ollama_models_dir.sh /caminho/para/modelos
set -e

# --- Configurações ---
MODELS_PATH=${1:-/media/data/llvm/ollama}
OLLAMA_SERVICE="ollama.service"
OLLAMA_USER="ollama"
OLLAMA_BIN="/usr/local/bin/ollama"

# --- Funções auxiliares ---
fail() {
    printf "\n[ERRO] %s\n" "$1" >&2
    exit 1
}

# --- Checagens iniciais ---
[ "$EUID" -ne 0 ] && fail "Execute como root (sudo)!"
[ ! -x "$OLLAMA_BIN" ] && fail "Binário $OLLAMA_BIN não encontrado ou não executável."

# --- Criação de diretórios e permissões ---
mkdir -p "$MODELS_PATH" || fail "Não foi possível criar $MODELS_PATH"
chown -R $OLLAMA_USER:$OLLAMA_USER "$MODELS_PATH"
chmod -R 775 "$MODELS_PATH"

# Permissão de travessia em todo o caminho
CAMINHO="$MODELS_PATH"
while [ "$CAMINHO" != "/" ]; do
    chmod o+x "$CAMINHO" 2>/dev/null || true
    CAMINHO="$(dirname "$CAMINHO")"
done

# --- Corrige permissões do diretório de configuração do Ollama ---
OLLAMA_CONFIG_DIR="/usr/share/ollama/.ollama"
mkdir -p "$OLLAMA_CONFIG_DIR"
chown -R $OLLAMA_USER:$OLLAMA_USER "/usr/share/ollama"
chmod -R 700 "$OLLAMA_CONFIG_DIR"

# --- Cria override do systemd ---
mkdir -p /etc/systemd/system/$OLLAMA_SERVICE.d

# workstation
# printf "[Service]\nEnvironment=\"OLLAMA_MODELS=%s\"\nEnvironment=\"CUDA_VISIBLE_DEVICES=0\"\nEnvironment=\"NVIDIA_VISIBLE_DEVICES=all\"\n" "$MODELS_PATH" > /etc/systemd/system/$OLLAMA_SERVICE.d/override.conf

# localcloud
printf "[Service]\n\
Environment=\"OLLAMA_MODELS=%s\"\n\
Environment=\"OLLAMA_HOST=0.0.0.0\"\n\
Environment=\"OLLAMA_NUM_THREADS=%s\"\n\
Environment=\"OLLAMA_MAX_LOADED=1\"\n" \
    "$MODELS_PATH" "$(nproc)" >/etc/systemd/system/$OLLAMA_SERVICE.d/override.conf

# --- Reinicia serviço ---
systemctl daemon-reload
systemctl restart $OLLAMA_SERVICE
sleep 2

# --- Verifica status e mostra logs em caso de erro ---
if ! systemctl is-active --quiet $OLLAMA_SERVICE; then
    printf "\n[ERRO] Serviço Ollama não está ativo. Últimos logs:\n"
    journalctl -u $OLLAMA_SERVICE -n 20 --no-pager
    exit 1
fi

systemctl status $OLLAMA_SERVICE --no-pager
printf "\n[OK] Configuração concluída! O Ollama usará: %s\n" "$MODELS_PATH"
