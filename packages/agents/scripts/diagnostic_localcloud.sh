#!/bin/bash
# diagnostic_localcloud.sh — Diagnóstico remoto da LOCALCLOUD via SSH
# Uso: bash scripts/diagnostic_localcloud.sh <IP ou hostname da localcloud>
# Variáveis: defina REMOTE_USER=usuario para sobrescrever (padrão: ubuntu)
# Exemplo: REMOTE_USER=admin bash scripts/diagnostic_localcloud.sh 192.168.100.101
# Pré-requisito: acesso SSH sem senha (chave pública já instalada para o usuário)

set -e

if [ -z "$1" ]; then
  echo "[ERRO] Informe o IP ou hostname da localcloud como argumento."
  echo "Exemplo: bash scripts/diagnostic_localcloud.sh 192.168.100.101"
  exit 1
fi

REMOTE_HOST=$1
: "${REMOTE_USER:=ubuntu}"
LOGFILE="diagnostic_localcloud_${REMOTE_HOST}_$(date +%Y%m%d_%H%M%S).log"

# Comando remoto: coleta as mesmas infos do diagnostic.sh, mas sem docker
REMOTE_CMD='echo "==[ Diagnóstico LOCALCLOUD ]=="
echo "Hostname: $(hostname)"
echo "Usuário: $(whoami)"
echo "Data: $(date)"
echo "CPU: $(lscpu | grep \"Model name\" | head -1 || grep \"model name\" /proc/cpuinfo | head -1)"
echo "Arquitetura: $(uname -m)"
echo "RAM: $(free -h | grep Mem)"
echo "Disco: $(df -h / | tail -1)"
echo "Swap: $(free -h | grep Swap)"
echo "IP local: $(hostname -I | awk \"{print \\$1}\")"
echo "IP público: $(curl -s ifconfig.me || echo N/A)"
echo "DNS: $(cat /etc/resolv.conf | grep nameserver)"
echo "Ping Google: $(ping -c 1 8.8.8.8 >/dev/null && echo OK || echo FAIL)"
echo "lspci | grep VGA:"
lspci | grep VGA || echo "N/A"
echo "Sistema: $(lsb_release -d 2>/dev/null | cut -f2- || cat /etc/os-release | grep PRETTY_NAME)"
echo "Pacotes com atualização pendente: $(if command -v apt >/dev/null; then apt list --upgradable 2>/dev/null | grep -v \"Listing...\" | wc -l; else echo N/A; fi)"
'

# Executa comando remoto via SSH e salva log local
ssh -o BatchMode=yes -o ConnectTimeout=5 ${REMOTE_USER}@${REMOTE_HOST} "$REMOTE_CMD" | tee "$LOGFILE"

SUMMARY_FILE="diagnostic_localcloud_summary_${REMOTE_HOST}.log"
echo -e "\nResumo rápido:" | tee "$SUMMARY_FILE"
grep -E 'FAIL|N/A|Hostname|Usuário|CPU|RAM|Disco|VGA|Sistema|atualização' "$LOGFILE" | tee -a "$SUMMARY_FILE"
echo -e "\nResumo salvo em $SUMMARY_FILE\n"

# Instrução final
cat <<EOF

[OK] Diagnóstico remoto da localcloud concluído!
- Log completo: $LOGFILE
- Resumo: $SUMMARY_FILE

Para preencher o NETWORK.md, use os dados do resumo.
EOF
