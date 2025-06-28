#!/bin/bash
set -e

# Script simples e robusto para montar RAID0 em /media/data permanentemente
# Uso:
#   ./mount_data_ssd.sh         # monta e garante permanência
#   ./mount_data_ssd.sh --umount  # desmonta

MOUNT_POINT="/media/data"
RAID_DEVICE="/dev/md0" # ajuste se necessário
FS_TYPE="ext4"         # ajuste se necessário
FSTAB_LINE="$RAID_DEVICE $MOUNT_POINT $FS_TYPE defaults,nofail 0 2"

if [[ "$1" == "--umount" || "$1" == "--unmount" ]]; then
    echo "[mount_data_ssd.sh] Desmontando $MOUNT_POINT ..."
    if mount | grep -q "on $MOUNT_POINT "; then
        sudo umount "$MOUNT_POINT"
        echo "[mount_data_ssd.sh] $MOUNT_POINT desmontado."
    else
        echo "[mount_data_ssd.sh] $MOUNT_POINT já está desmontado."
    fi
    sudo grep -v "^${RAID_DEVICE} " /etc/fstab | sudo tee /etc/fstab.tmp >/dev/null
    sudo mv /etc/fstab.tmp /etc/fstab
    echo "[mount_data_ssd.sh] Entrada removida de /etc/fstab."
    exit 0
fi

# 1. Verifica RAID
if ! lsblk | grep -q $(basename ${RAID_DEVICE}); then
    echo "[mount_data_ssd.sh] ERRO: RAID device ${RAID_DEVICE} não encontrado. Ative o RAID antes."
    exit 1
fi

# Detecta se o RAID está montado em outro ponto
MOUNTED_AT=$(lsblk -no MOUNTPOINT ${RAID_DEVICE} | grep -v '^$' | grep -v "$MOUNT_POINT" | head -n1)
if [ -n "$MOUNTED_AT" ]; then
    echo "[mount_data_ssd.sh] RAID está montado em $MOUNTED_AT. Desmontando..."
    sudo umount "$MOUNTED_AT"
    # Remove entrada antiga do fstab se existir
    sudo grep -v "^${RAID_DEVICE} .*${MOUNTED_AT} " /etc/fstab | sudo tee /etc/fstab.tmp >/dev/null
    sudo mv /etc/fstab.tmp /etc/fstab
fi

# 2. Cria ponto de montagem se necessário
sudo mkdir -p "$MOUNT_POINT"

# 3. Garante entrada única no /etc/fstab
if grep -qs "^${RAID_DEVICE} " /etc/fstab; then
    sudo grep -v "^${RAID_DEVICE} " /etc/fstab | sudo tee /etc/fstab.tmp >/dev/null
    sudo mv /etc/fstab.tmp /etc/fstab
fi
echo "$FSTAB_LINE" | sudo tee -a /etc/fstab >/dev/null

# 4. Monta se necessário
if ! mount | grep -q "on $MOUNT_POINT "; then
    sudo mount "$MOUNT_POINT"
fi

# 5. Permissões padrão
USER_NAME=$(logname)
sudo chown -R "$USER_NAME":"$USER_NAME" "$MOUNT_POINT" 2>/dev/null || true
sudo chmod -R 775 "$MOUNT_POINT" 2>/dev/null || true
echo "[mount_data_ssd.sh] Permissões ajustadas para o usuário $USER_NAME. O volume deve aparecer normalmente no gerenciador de arquivos."

df -h "$MOUNT_POINT"
echo "[mount_data_ssd.sh] RAID0 montado permanentemente em $MOUNT_POINT. Pronto para uso."
