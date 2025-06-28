#!/bin/bash

# === Configs personalizáveis ===
HOSTNAME="localcloud"
USERNAME="ubuntu"
SSH_KEY_FILE="$HOME/.ssh/id_ed25519.pub"
OUTPUT_ISO="seed.iso"
TMP_DIR=$(mktemp -d)

# === Verificações básicas ===
if [ ! -f "$SSH_KEY_FILE" ]; then
    echo "❌ Chave SSH não encontrada em $SSH_KEY_FILE"
    exit 1
fi

# === Criar user-data ===
cat >"$TMP_DIR/user-data" <<EOF
#cloud-config
hostname: $HOSTNAME
manage_etc_hosts: true
users:
  - name: $USERNAME
    groups: sudo
    shell: /bin/bash
    sudo: ["ALL=(ALL) NOPASSWD:ALL"]
    ssh_authorized_keys:
      - $(cat "$SSH_KEY_FILE")
package_update: true
package_upgrade: true
packages:
  - htop
  - net-tools
  - qemu-system-x86
  - bridge-utils
  - libvirt-clients
  - libvirt-daemon-system
  - lxd
  - linux-firmware
  - firmware-amd-graphics
  - mesa-utils
  - mesa-vulkan-drivers
  - libdrm-amdgpu1
  - xserver-xorg-video-amdgpu
  - vainfo
  - clinfo
  - python3
  - python3-pip
  - python3-venv
  - build-essential
  - software-properties-common
  - nano
  - nmap
  - net-tools
  - iputils-ping
  - dnsutils
  - traceroute
  - tcpdump
  - git
  - dialog
  - whiptail
  - jq
  - tree
  - unzip
  - zip
  - rsync
  - sshpass
  - pipx
  - virtualenv
runcmd:
  - echo 'Servidor provisionado via cloud-init' > /etc/motd
EOF

# === Criar meta-data ===
cat >"$TMP_DIR/meta-data" <<EOF
instance-id: $HOSTNAME-001
local-hostname: $HOSTNAME
EOF

# === Gerar ISO ===
genisoimage -output "$OUTPUT_ISO" -volid cidata -joliet -rock "$TMP_DIR/user-data" "$TMP_DIR/meta-data"

# === Limpeza ===
rm -rf "$TMP_DIR"

echo "✅ ISO de cloud-init gerada: $OUTPUT_ISO"
