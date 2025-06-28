#!/bin/bash
# Script para remover Docker Desktop, instalar Docker Engine puro e configurar ambiente
# Uso: bash scripts/remove_docker_desktop_and_install_engine.sh

set -e

# 1. Remover Docker Desktop
echo "==> Removendo Docker Desktop (se instalado)..."
sudo apt-get remove --purge -y docker-desktop || true
sudo dpkg --purge docker-desktop || true

# 2. Limpar arquivos residuais
echo "==> Removendo arquivos residuais do Docker Desktop..."
rm -rf ~/.docker/desktop
rm -rf ~/.docker/features

# 3. Remover possíveis versões antigas do Docker Engine
echo "==> Removendo possíveis versões antigas do Docker Engine..."
sudo apt-get remove --purge -y docker-ce docker-ce-cli containerd.io || true

# 4. Instalar dependências
echo "==> Instalando dependências para repositório HTTPS..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 5. Adicionar chave GPG oficial do Docker
echo "==> Adicionando chave GPG oficial do Docker..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 6. Adicionar repositório Docker
echo "==> Adicionando repositório Docker..."
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" |
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

# 7. Instalar Docker Engine
echo "==> Atualizando repositórios e instalando Docker Engine (Community Edition)..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 8. Habilitar e iniciar o serviço Docker
echo "==> Habilitando e iniciando o serviço Docker..."
sudo systemctl enable docker
sudo systemctl start docker

# 9. Adicionar usuário ao grupo docker
echo "==> Adicionando usuário $USER ao grupo docker..."
sudo usermod -aG docker $USER

# 10. Resetar contexto do Docker CLI
if command -v docker &>/dev/null; then
    echo "==> Resetando contexto do Docker CLI para default..."
    docker context use default || true
fi

echo ""
echo "==> Docker Engine instalado e configurado!"
echo "==> Faça logout/login ou reinicie o sistema para o grupo docker ter efeito."
echo "==> Teste com: docker info"
echo "==> Agora você pode usar docker swarm init normalmente."

# docker swarm init --advertise-addr 192.168.0.10
