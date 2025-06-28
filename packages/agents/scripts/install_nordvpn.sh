#!/bin/bash
# install_nordvpn.sh — Instalação e restauração fácil da NordVPN no Linux
# Uso: bash scripts/install_nordvpn.sh

set -e

# Função para restaurar serviço NordVPN caso esteja masked
restaurar_servico() {
  echo -e "\n[!] Tentando restaurar serviço NordVPN (caso esteja masked)..."
  if [ -L /lib/systemd/system/nordvpn.service ]; then
    sudo rm /lib/systemd/system/nordvpn.service
    sudo systemctl daemon-reload
    echo "- Symlink /lib/systemd/system/nordvpn.service removido."
  fi
  sudo apt install --reinstall nordvpn -y
  sudo systemctl unmask nordvpn.service || true
  sudo systemctl daemon-reload
  sudo systemctl enable nordvpn
  sudo systemctl start nordvpn
  sudo systemctl status nordvpn --no-pager
  echo -e "\n[OK] Serviço NordVPN restaurado!"
}

# Menu interativo
echo ""
echo "[NordVPN Installer]"
echo "1) Instalar/Atualizar NordVPN normalmente"
echo "2) Restaurar serviço NordVPN (caso esteja masked)"
echo "3) Sair"
echo -n "Escolha uma opção [1-3]: "
read OPCAO

if [ "$OPCAO" = "2" ]; then
  restaurar_servico
  exit 0
elif [ "$OPCAO" = "3" ]; then
  echo "Saindo."
  exit 0
fi

# 1. Checagem de dependências
command -v curl >/dev/null 2>&1 || { echo >&2 "[ERRO] curl não está instalado. Instale com: sudo apt install curl"; exit 1; }

# 2. Instalação do pacote NordVPN
printf "\n[1/3] ⏬ Baixando e instalando NordVPN...\n"
sh <(curl -sSf https://downloads.nordcdn.com/apps/linux/install.sh)

# 3. Instruções pós-instalação
cat <<EOF

[2/3] ✅ NordVPN instalado!

[3/3] 🚦 Próximos passos:
1. Faça login na NordVPN (irá abrir o navegador para autenticação):
   nordvpn login

2. Conecte-se a um servidor VPN:
   nordvpn connect
   # ou escolha um país, ex: nordvpn connect br

3. Verifique seu novo IP:
   curl ifconfig.me

4. Para desconectar:
   nordvpn disconnect

Dica: Para ver status e opções, use 'nordvpn --help'

[OK] Script finalizado!
EOF
