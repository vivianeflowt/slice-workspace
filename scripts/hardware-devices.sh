#!/bin/bash
set -e

echo -e "\n📛 HOSTNAME: $(hostname)"

echo -e "\n🧠 CPU:"
lscpu | grep -E 'Model name|Socket|Core|Thread'

echo -e "\n🎮 GPU:"
lspci | grep -iE 'vga|3d|nvidia|amd|radeon' || echo "GPU não detectada via PCI"

echo -e "\n💾 MEMÓRIA:"
free -h

echo -e "\n🖴 DISCO:"
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT

echo -e "\n🖥️ SISTEMA:"
grep -E 'PRETTY_NAME|VERSION_ID|ID=' /etc/os-release

echo -e "\n🧰 Kernel:"
uname -r

echo -e "\n🐳 DOCKER:"
if ! command -v docker &>/dev/null; then
    echo "Docker não instalado."
else
    docker version --format '{{.Server.Version}}' || echo "Docker não configurado."
    echo -e "\n📦 Swarm:"
    if docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
        ROLE=$(docker info --format '{{.Swarm.ControlAvailable}}')
        if [[ "$ROLE" == "true" ]]; then
            echo "➡️ Este nó é um MANAGER"
        else
            echo "➡️ Este nó é um WORKER"
        fi
        docker node inspect self --format 'Labels: {{json .Spec.Labels}}'
        docker node inspect self --format 'Generic Resources: {{json .Description.Resources.GenericResources}}'
    else
        echo "Este nó não faz parte de nenhum Swarm."
    fi
fi
