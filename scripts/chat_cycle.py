#!/usr/bin/env python3
"""
chat_cycle.py — Ciclo incremental de comunicação VC ↔ ELE

Fluxo:
1. Faz backup completo do CHAT.md em docs/CHAT_HISTORY/{timestamp}.md
2. Limpa o CHAT.md, deixando só a mensagem ativa (última interação)
3. Sugere compressão/context chunking se o arquivo crescer demais
4. Garante rastreabilidade, reasoning focado e contexto limpo

Uso:
  python3 scripts/chat_cycle.py [--compress]
"""
import os
import shutil
from datetime import datetime
import sys

CHAT_MD = 'CHAT.md'
HISTORY_DIR = 'docs/CHAT_HISTORY'
COMPRESS_THRESHOLD = 2000  # linhas

os.makedirs(HISTORY_DIR, exist_ok=True)

def backup_chat():
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_path = os.path.join(HISTORY_DIR, f'CHAT_{timestamp}.md')
    shutil.copy2(CHAT_MD, backup_path)
    print(f'🟦 Backup criado: {backup_path}')
    return backup_path

def clean_chat():
    with open(CHAT_MD, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    # Mantém só a última mensagem relevante (pode ajustar para manter mais, se desejar)
    last_msg = []
    for line in reversed(lines):
        if line.strip():
            last_msg.insert(0, line)
            if line.strip().startswith('##') or line.strip().startswith('###'):
                break
    with open(CHAT_MD, 'w', encoding='utf-8') as f:
        f.writelines(last_msg)
    print('🟩 CHAT.md limpo e pronto para nova interação.')

def suggest_compression():
    with open(CHAT_MD, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    if len(lines) > COMPRESS_THRESHOLD:
        print(f'⚠️ CHAT.md tem {len(lines)} linhas. Considere compressão ou chunking para manter reasoning focado.')
        # Aqui pode sugerir sumarização, highlights, ou dividir por tópicos

def main():
    backup_chat()
    suggest_compression()
    clean_chat()
    print('✅ Ciclo concluído. Envie o CHAT.md limpo para o destinatário.')

if __name__ == '__main__':
    main()
