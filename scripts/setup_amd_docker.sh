#!/bin/bash
set -e

echo "🔧 Instalando suporte completo para AMD Radeon + ROCm (ajustado para versão 5.7)..."

# Atualiza o sistema
sudo apt update && sudo apt upgrade -y

# Instala drivers AMD padrão (mesa + vulkan)
sudo apt install -y \
    mesa-vulkan-drivers \
    xserver-xorg-video-amdgpu \
    libdrm-amdgpu1 \
    vulkan-utils \
    mesa-utils \
    vulkan-tools

# Verifica se driver está ativo
echo "🎮 GPU detectada:"
lspci | grep -i vga || true
glxinfo | grep "OpenGL renderer" || echo "⚠️ glxinfo não disponível (mesa-utils?)"

# Configura repositório AMD ROCm 5.7 (jammy ou focal, dependendo do seu Ubuntu)
sudo mkdir -p /etc/apt/keyrings
wget -qO - https://repo.radeon.com/rocm/rocm.gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/rocm-archive-keyring.gpg >/dev/null

echo 'deb [signed-by=/etc/apt/keyrings/rocm-archive-keyring.gpg] https://repo.radeon.com/rocm/apt/5.7 jammy main' | sudo tee /etc/apt/sources.list.d/rocm.list

# Prioriza repositório AMD
cat <<EOF | sudo tee /etc/apt/preferences.d/rocm
Package: *
Pin: origin "repo.radeon.com"
Pin-Priority: 1001
EOF

# Atualiza cache e instala componentes principais com versões específicas
sudo apt update

sudo apt install -y \
    rocminfo=1.0.0.50700-63~22.04 \
    rocm-hip-runtime=5.7.0.50700-63~22.04 \
    hipcc \
    librocblas-dev \
    librocfft-dev \
    --allow-downgrades

# Adiciona usuário aos grupos necessários
sudo usermod -aG video $USER
sudo usermod -aG render $USER || true
sudo usermod -aG docker $USER

# Instala Docker (caso não tenha)
sudo apt install -y docker.io
sudo systemctl restart docker

echo "✅ Instalação concluída com sucesso. Reinicie o sistema para aplicar permissões de grupo."
