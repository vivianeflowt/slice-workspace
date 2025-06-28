#!/bin/bash
set -e

echo "🧠 Otimizando Pop!_OS para uso com IA..."

### 1. Desativa input method (caso não use idiomas asiáticos)
echo "Desativando input method (GTK/QT)..."
{
    echo 'export GTK_IM_MODULE=xim'
    echo 'export QT_IM_MODULE=xim'
    echo 'export XMODIFIERS=""'
} >>~/.profile

### 2. Define CPU no modo performance
echo "Configurando CPU para modo performance..."
sudo apt install -y cpufrequtils
echo 'GOVERNOR="performance"' | sudo tee /etc/default/cpufrequtils
sudo systemctl disable ondemand || true
sudo systemctl enable cpufrequtils

### 3. Desativa swap/zram (para evitar thrash em memória em IA)
echo "Desativando swap/zram..."
sudo swapoff -a || true
sudo systemctl mask systemd-zram-setup@zram0 || true

### 4. Sugestão para otimizar disco (manual)
echo "📝 Verifique seu /etc/fstab e adicione: noatime,discard em partições SSD confiáveis"

### 5. Docker: Força overlay2 e reinicia
echo "Ajustando storage-driver do Docker para overlay2..."
sudo tee /etc/docker/daemon.json >/dev/null <<EOF
{
  "storage-driver": "overlay2"
}
EOF
sudo systemctl restart docker

### 6. Instala ferramentas úteis para monitoramento e CLI
echo "Instalando utilitários recomendados..."
sudo apt install -y htop iotop nvtop bpytop bat exa btop fzf

### 7. Sugere desativação de serviços não essenciais (manual)
echo "📝 Sugestão: desativar serviços desnecessários como bluetooth, cups, etc."
echo "    Ex: sudo systemctl disable bluetooth.service"

### 8. Instala poetry (ambientes Python isolados)
echo "Instalando Poetry para gerenciamento de ambientes Python..."
curl -sSL https://install.python-poetry.org | python3 - || true

echo "✅ Otimizações aplicadas. Reboot recomendado para aplicar tudo."
