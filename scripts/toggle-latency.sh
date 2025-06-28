#!/bin/bash
# Simula latência crescente na interface de rede usando tc/netem
# Uso: ./toggle-latency.sh [interface] [latência_inicial_ms] [latência_max_ms] [passo_ms] [intervalo_s]
# Exemplo: ./toggle-latency.sh enp3s0 100 500 100 5
# Exemplo: ./toggle-latency.sh wlo1 100 500 100 5

INTERFACE="${1:-eth0}"
LAT_MIN="${2:-100}"
LAT_MAX="${3:-500}"
STEP="${4:-100}"
INTERVAL="${5:-5}"

if ! command -v tc &>/dev/null; then
    echo "[ERRO] 'tc' não encontrado. Instale o pacote 'iproute2'."
    exit 1
fi

if [[ $EUID -ne 0 ]]; then
    echo "[ERRO] Rode como root (sudo)."
    exit 1
fi

# Remove qualquer configuração anterior
sudo tc qdisc del dev "$INTERFACE" root netem 2>/dev/null

LAT=$LAT_MIN
while [ $LAT -le $LAT_MAX ]; do
    echo "[INFO] Aplicando latência de ${LAT}ms na interface $INTERFACE..."
    sudo tc qdisc replace dev "$INTERFACE" root netem delay ${LAT}ms
    sleep $INTERVAL
    LAT=$((LAT + STEP))
done

echo "[INFO] Removendo simulação de latência."
sudo tc qdisc del dev "$INTERFACE" root netem

echo "[OK] Latência simulada finalizada."
