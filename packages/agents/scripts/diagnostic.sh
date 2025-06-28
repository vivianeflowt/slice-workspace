#!/bin/bash
# diagnostic.sh — Diagnóstico completo do ambiente Slice/ALIVE
# -------------------------------------------------------------
# Diagnostica recursos, rede, containers, VPN, GPU, permissões e dependências.
# Uso: bash scripts/diagnostic.sh
# Torne executável: chmod +x scripts/diagnostic.sh
# Expanda os checks conforme necessidade do projeto.
# -------------------------------------------------------------

set -e

LOGFILE="diagnostic_$(date +%Y%m%d_%H%M%S).log"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

log() { echo -e "$1" | tee -a "$LOGFILE"; }

log "${YELLOW}==[ Diagnóstico Slice/ALIVE ]==${NC}"

# 1. Identidade do host e usuário
log "\n${GREEN}Host/Usuário:${NC}"
log "Hostname: $(hostname)"
log "Usuário: $(whoami)"
log "Data: $(date)"

# 2. Recursos do sistema
log "\n${GREEN}Recursos do Sistema:${NC}"
log "CPU: $(lscpu | grep 'Model name' | head -1)"
log "RAM: $(free -h | grep Mem)"
log "Disco: $(df -h / | tail -1)"
log "Swap: $(free -h | grep Swap)"

# 3. Rede
log "\n${GREEN}Rede:${NC}"
log "IP local: $(hostname -I | awk '{print $1}')"
log "IP público: $(curl -s ifconfig.me || echo 'N/A')"
log "DNS: $(cat /etc/resolv.conf | grep nameserver)"
log "Ping Google: $(ping -c 1 8.8.8.8 >/dev/null && echo OK || echo FAIL)"
log "VPN ativa: $(ifconfig | grep -E 'tun|nord|proton' || echo 'Nenhuma detectada')"

# 4. Permissões em volumes Docker (checa múltiplos caminhos para robustez)
log "\n${GREEN}Permissões em Volumes Docker:${NC}"
# [Volumes Docker padronizados em /media/data]
# Checa apenas caminhos em /media/data conforme novo padrão do projeto.
VOLUME_PATH="/media/data/textgen"
log "Checando: $VOLUME_PATH"
log "$(ls -ld $VOLUME_PATH 2>/dev/null || echo 'Volume não encontrado')"

# 5. Docker e containers
log "\n${GREEN}Docker:${NC}"
log "Docker: $(docker --version 2>/dev/null || echo 'Não instalado')"
log "Containers ativos:"
docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "Docker não disponível"

# 6. VPN
log "\n${GREEN}VPN:${NC}"
log "NordVPN: $(systemctl is-active nordvpn 2>/dev/null || echo 'Não instalado')"
log "ProtonVPN: $(systemctl is-active protonvpn 2>/dev/null || echo 'Não instalado')"

# 7. GPU
log "\n${GREEN}GPU:${NC}"
log "nvidia-smi:"
nvidia-smi 2>/dev/null || echo "NVIDIA não detectada"
log "lspci | grep VGA:"
lspci | grep VGA

# 8. Dependências essenciais
# Checa apenas dependências modernas e relevantes para o projeto (docker compose, não docker-compose legacy)
for dep in curl docker nvidia-smi; do
  command -v $dep >/dev/null && log "$dep: OK" || log "$dep: FALTA"
done
# docker-compose legacy removido do check, pois o padrão é 'docker compose'.

# 8b. Dependências de linguagem e build (Node.js, npm, pnpm, Python)
for dep in node npm pnpm python3 pip; do
  command -v $dep >/dev/null && log "$dep: OK" || log "$dep: FALTA"
done

# 8c. Checagem de arquivo .env
log "\n${GREEN}Arquivo .env:${NC}"
[ -f .env ] && log ".env encontrado" || log ".env NÃO encontrado"

# 8d. Checagem de variável de ambiente Hugging Face
log "\n${GREEN}Variável HUGGINGFACE_HUB_TOKEN:${NC}"
[ -z "$HUGGINGFACE_HUB_TOKEN" ] && log "HUGGINGFACE_HUB_TOKEN NÃO setada" || log "HUGGINGFACE_HUB_TOKEN setada (valor oculto)"

# 8e. Checagem de updates pendentes (Debian/Ubuntu)
log "\n${GREEN}Atualizações de sistema:${NC}"
if command -v apt >/dev/null; then
  UPDATES=$(apt list --upgradable 2>/dev/null | grep -v "Listing..." | wc -l)
  log "Pacotes com atualização pendente: $UPDATES"
else
  log "apt não encontrado (sistema não Debian/Ubuntu ou permissão insuficiente)"
fi

# 9. Logs recentes
log "\n${GREEN}Logs recentes (docker):${NC}"
docker logs $(docker ps -q | head -1) --tail 10 2>/dev/null || echo "Sem logs"

# 10. Diagnóstico textgen-webui
log "\n${GREEN}textgen-webui:${NC}"
docker ps | grep textgen && log "textgen-webui rodando" || log "textgen-webui NÃO rodando"

log "\n${YELLOW}==[ Diagnóstico concluído! ]==${NC}"
log "Log salvo em $LOGFILE"

# [Resumo Fácil de Ler]
# Gera um resumo limpo dos principais status (erros, volumes, serviços, dependências) para facilitar troubleshooting humano/IA.
SUMMARY_FILE="diagnostic_summary.log"
echo -e "${YELLOW}==[ Resumo Rápido: Diagnóstico Slice/ALIVE ]==${NC}" | tee "$SUMMARY_FILE"
grep -E 'FALTA|FAIL|NÃO|Volume não encontrado|rodando|OK|Checando:' "$LOGFILE" | tee -a "$SUMMARY_FILE"
echo -e "${YELLOW}==[ Fim do Resumo ]==${NC}\nResumo salvo em $SUMMARY_FILE\n"

# [Expansão] Adicione novos checks abaixo seguindo o padrão:
# log "\n${GREEN}Novo Check:${NC}"
# ...
