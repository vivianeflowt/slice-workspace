#!/usr/bin/env python3
"""Script para baixar modelos Command-R necessários para o servidor."""

import os
import sys
from pathlib import Path
import requests
from huggingface_hub import hf_hub_download

# Ajuste dinâmico do sys.path para garantir importação correta
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from server.constants import MODELS_DIR, CACHE_DIR, LOGS_DIR

def prepare_model_dirs():
    for d in [MODELS_DIR, CACHE_DIR, LOGS_DIR]:
        os.makedirs(d, exist_ok=True)

def download_model(url, dest_path):
    if os.path.exists(dest_path):
        print(f"Modelo já existe: {dest_path}")
        return
    print(f"Baixando modelo de {url} para {dest_path} ...")
    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            total = int(r.headers.get('content-length', 0))
            with open(dest_path, 'wb') as f:
                downloaded = 0
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total:
                            done = int(50 * downloaded / total)
                            sys.stdout.write(f"\r[{'=' * done}{' ' * (50-done)}] {downloaded/1024/1024:.2f}MB/{total/1024/1024:.2f}MB")
                            sys.stdout.flush()
        print(f"\nDownload concluído: {dest_path}")
    except Exception as e:
        print(f"Erro ao baixar {url}: {e}")

def main():
    """Função principal para download dos modelos."""
    print("🚀 Iniciando download dos modelos Command-R...")

    # Criar diretório se não existir
    models_path = Path(MODELS_DIR)
    models_path.mkdir(parents=True, exist_ok=True)

    print(f"📁 Diretório de modelos: {MODELS_DIR}")

    # Download dos shards safetensors e tokenizer via huggingface_hub
    repo_id = "CohereLabs/c4ai-command-r-v01"
    files = [
        "pytorch_model-00001-of-00002.safetensors",
        "pytorch_model-00002-of-00002.safetensors",
        "tokenizer.model",
        "config.json"
    ]
    for fname in files:
        try:
            print(f"Baixando {fname} do HuggingFace...")
            local_path = hf_hub_download(repo_id=repo_id, filename=fname, cache_dir=MODELS_DIR, token=os.environ.get("HUGGINGFACE_TOKEN"))
            print(f"✔️  {fname} salvo em {local_path}")
        except Exception as e:
            print(f"Erro ao baixar {fname}: {e}")

    print("✅ Modelos Command-R baixados e prontos para uso!")
    print("📋 Configuração: safetensors (Transformers, uso enterprise)")

    return 0

if __name__ == "__main__":
    prepare_model_dirs()
    main()

# Para ativar modelos grandes, basta descomentar os blocos acima e ajustar as URLs.
# Use comentários para documentar decisões incrementais e facilitar expansão plugável.
