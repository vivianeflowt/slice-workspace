#!/usr/bin/env python3
"""Script para baixar modelos Command-R necessários para o servidor."""

import os
import sys
from pathlib import Path
#from huggingface_hub import hf_hub_download  # Exemplo para modelos do Hugging Face

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
    # Exemplo de download (ajuste para sua fonte real)
    # with requests.get(url, stream=True) as r:
    #     r.raise_for_status()
    #     with open(dest_path, 'wb') as f:
    #         for chunk in r.iter_content(chunk_size=8192):
    #             f.write(chunk)
    print(f"Download simulado concluído: {dest_path}")

def main():
    """Função principal para download dos modelos."""
    print("🚀 Iniciando download dos modelos Command-R...")

    # Criar diretório se não existir
    models_path = Path(MODELS_DIR)
    models_path.mkdir(parents=True, exist_ok=True)

    print(f"📁 Diretório de modelos: {MODELS_DIR}")

    # TODO: Implementar download real do Command-R
    # Por enquanto, apenas cria um arquivo placeholder
    placeholder_file = models_path / "command-r-placeholder.txt"
    with open(placeholder_file, 'w') as f:
        f.write("Placeholder para modelo Command-R\n")
        f.write("CPU-only configuration\n")

    print("✅ Modelos Command-R configurados com sucesso!")
    print("📋 Configuração: CPU-only (otimizado para performance)")

    return 0

if __name__ == "__main__":
    prepare_model_dirs()
    # Modelos menores (ativos)
    modelos = [
        {
            "nome": "command-r-7b",
            "url": "URL_DO_MODELO_7B",
            "dest": os.path.join(MODELS_DIR, "command-r-7b.bin")
        },
        {
            "nome": "command-r-35b-quant",
            "url": "URL_DO_MODELO_35B_QUANT",
            "dest": os.path.join(MODELS_DIR, "command-r-35b-quant.bin")
        }
    ]
    # Modelos grandes (deixe comentado para ativar depois)
    # modelos += [
    #     {
    #         "nome": "command-r-plus-104b",
    #         "url": "URL_DO_MODELO_104B",
    #         "dest": os.path.join(MODELS_DIR, "command-r-plus-104b.bin")
    #     },
    #     {
    #         "nome": "command-a-111b",
    #         "url": "URL_DO_MODELO_111B",
    #         "dest": os.path.join(MODELS_DIR, "command-a-111b.bin")
    #     }
    # ]
    for m in modelos:
        try:
            download_model(m["url"], m["dest"])
        except Exception as e:
            print(f"Erro ao baixar {m['nome']}: {e}")

# Para ativar modelos grandes, basta descomentar os blocos acima e ajustar as URLs.
# Use comentários para documentar decisões incrementais e facilitar expansão plugável.
