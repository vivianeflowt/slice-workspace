#!/bin/bash
set -e

echo "🔧 Instalando drivers NVIDIA + CUDA + Docker Toolkit..."

# Atualiza o sistema
sudo apt update && sudo apt upgrade -y

# Instala driver NVIDIA recomendado
sudo ubuntu-drivers install

# Instala CUDA Toolkit + painel da NVIDIA
sudo apt install -y nvidia-cuda-toolkit nvidia-settings

sudo apt install -y mesa-utils vulkan-tools

# Testa se driver está ok
nvidia-smi || echo "⚠️ Verifique se a GPU está conectada e o driver foi carregado."

# Instala toolkit NVIDIA pro Docker
sudo apt install -y nvidia-container-toolkit

# Configura runtime NVIDIA no Docker manualmente
sudo tee /etc/docker/daemon.json >/dev/null <<EOF
{
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },
  "default-runtime": "nvidia"
}
EOF

# Reinicia Docker com novo runtime
sudo systemctl restart docker

# Valida se runtime está funcionando
docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi || echo "⚠️ Docker com GPU ainda não funcional — verifique driver e toolkit"

echo "✅ NVIDIA configurada com sucesso!"
