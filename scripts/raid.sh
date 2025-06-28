#!/bin/bash
set -e

# Discos para o RAID
DISK1="/dev/sdc"
DISK2="/dev/sdd"
RAID_DEVICE="/dev/md0"
MOUNT_POINT="/media/data"

# Parar e remover RAID anterior, se existir
if [ -e "$RAID_DEVICE" ]; then
    sudo mdadm --stop $RAID_DEVICE || true
    sudo mdadm --remove $RAID_DEVICE || true
fi

# Desmontar partições se estiverem montadas
sudo umount ${DISK1}1 || true
sudo umount ${DISK2}1 || true

# Apagar superblocos antigos
sudo mdadm --zero-superblock ${DISK1} || true
sudo mdadm --zero-superblock ${DISK2} || true

# Criar RAID 0
sudo mdadm --create --verbose $RAID_DEVICE --level=0 --raid-devices=2 $DISK1 $DISK2 --force

# Criar sistema de arquivos ext4
sudo mkfs.ext4 $RAID_DEVICE

# Criar ponto de montagem
sudo mkdir -p $MOUNT_POINT

# Montar RAID
sudo mount $RAID_DEVICE $MOUNT_POINT

# Adicionar ao /etc/fstab para montagem automática
UUID=$(sudo blkid -s UUID -o value $RAID_DEVICE)
echo "UUID=$UUID $MOUNT_POINT ext4 defaults,nofail,discard 0 0" | sudo tee -a /etc/fstab

# Exibir status do RAID
sudo mdadm --detail $RAID_DEVICE

echo "RAID 0 criado, formatado e montado em $MOUNT_POINT. Pronto para uso."

# Teste de desempenho com fio (opcional)
# echo "\nIniciando teste de desempenho com fio (leitura e escrita sequencial de 4G)..."
# sudo apt-get update && sudo apt-get install -y fio
# sudo fio --name=TESTE_RAID --directory=$MOUNT_POINT --size=4G --bs=1M --rw=rw --ioengine=libaio --numjobs=2 --time_based --runtime=60 --group_reporting

# echo "Teste de desempenho finalizado. Veja os resultados acima."

# sudo apt-get update && sudo apt-get install -y btrfs-progs xfsprogs reiserfsprogs reiser4progs nfs-common

# LXD GUI
# https://192.168.0.15:8443
