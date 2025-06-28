"""
🤖 Model Downloader - Slice/ALIVE Providers Server
Download e gerenciamento de modelos HuggingFace.

Princípios CONCEPTS.md:
- Baixo Recurso: CPU-only, download incremental
- Incrementalismo: 1 modelo por vez, validação contínua
- Plug-and-Play: Auto-criação de diretórios
- Offline-First: Cache local obrigatório
"""

import logging
import os
os.environ["CUDA_VISIBLE_DEVICES"] = ""
import shutil
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

import torch
import psutil  # Adicionado para controle de prioridade
from transformers import AutoConfig, AutoModel, AutoTokenizer
from huggingface_hub import snapshot_download  # Para download sem carregamento
from server.constants import MODEL_CACHE_DIR, DEFAULT_MODELS, MAX_DOWNLOAD_RETRIES

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def set_low_priority():
    """
    Define a prioridade do processo atual para baixa (CPU e I/O).
    Isso evita que o download congele a máquina.
    """
    try:
        process = psutil.Process(os.getpid())
        if os.name == 'nt':  # Windows
            process.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
        else:  # Linux/macOS
            process.nice(19)  # A prioridade mais baixa
            try:
                # Tenta definir I/O priority para idle (mais suave para o disco)
                process.ionice(psutil.IOPRIO_CLASS_IDLE)
                logger.info("✅ Prioridade de I/O definida como IDLE.")
            except (AttributeError, OSError):
                # ionice pode não estar disponível ou precisar de permissões
                logger.info("⚠️ Não foi possível definir prioridade de I/O.")

        logger.info("✅ Prioridade do processo de download definida como baixa.")
    except Exception as e:
        logger.warning(f"⚠️ Não foi possível definir a prioridade do processo: {e}")


def configure_minimal_resources():
    """
    Configura PyTorch e HuggingFace para usar recursos mínimos.
    """
    # Limita PyTorch a usar apenas 1 thread (evita sobrecarregar CPU)
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)

    # Força CPU e desabilita qualquer aceleração
    os.environ["CUDA_VISIBLE_DEVICES"] = ""
    os.environ["MKL_NUM_THREADS"] = "1"
    os.environ["OPENBLAS_NUM_THREADS"] = "1"
    os.environ["OMP_NUM_THREADS"] = "1"

    # Configura HuggingFace para download mais gentil
    os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "300"  # Timeout maior
    os.environ["HF_HUB_OFFLINE"] = "0"  # Força online mode

    logger.info("✅ Configuração de recursos mínimos aplicada.")


class ModelDownloader:
    """
    Gerenciador de download e cache de modelos HuggingFace.

    Funcionalidades:
    - Download sequencial (1 modelo por vez)
    - Auto-criação de diretórios
    - Validação de modelos baixados
    - Limpeza de cache
    """

    def __init__(
        self, models_dir: Optional[str] = None, cache_dir: Optional[str] = None
    ):
        """
        Inicializa downloader com auto-criação de paths.

        Args:
            models_dir: Diretório para modelos (usa constants se None)
            cache_dir: Diretório para cache (usa constants se None)
        """
        # Configurar recursos mínimos ANTES de qualquer operação
        configure_minimal_resources()

        # Importar constants aqui para evitar circular imports
        try:
            from server.constants import (
                CACHE_DIR,
                DEFAULT_MODELS,
                FORCE_CPU_ONLY,
                MODELS_DIR,
            )

            self.models_dir = Path(models_dir or MODELS_DIR)
            self.cache_dir = Path(cache_dir or CACHE_DIR)
            self.force_cpu_only = FORCE_CPU_ONLY
            self.default_models = DEFAULT_MODELS
        except ImportError:
            # Fallback se constants não disponível
            self.models_dir = Path(models_dir or "/media/data/llvm/general/models")
            self.cache_dir = Path(cache_dir or "/media/data/llvm/general/cache")
            self.force_cpu_only = True
            self.default_models = {}

        # Auto-criar diretórios necessários
        self._ensure_directories()

        # Configurar torch para CPU-only se necessário
        if self.force_cpu_only:
            torch.set_default_tensor_type("torch.FloatTensor")
            os.environ["CUDA_VISIBLE_DEVICES"] = ""

    def _ensure_directories(self):
        """
        Garante que todos os diretórios necessários existem.
        """
        # O cache da HuggingFace é gerenciado pela própria lib,
        # precisamos apenas garantir o diretório raiz.
        directories = [
            self.models_dir,
            self.cache_dir,
        ]

        for directory in directories:
            try:
                directory.mkdir(parents=True, exist_ok=True)
                logger.debug(f"📁 Diretório garantido: {directory}")
            except Exception as e:
                logger.warning(f"⚠️ Falha ao criar diretório {directory}: {e}")

    def download_model(self, model_name: str, max_retries: int = 3) -> bool:
        """
        Baixa um modelo específico do HuggingFace SEM carregar na memória.

        Esta versão otimizada faz APENAS o download dos arquivos,
        sem carregar o modelo na RAM, evitando travamentos.

        Args:
            model_name: Nome do modelo no HuggingFace Hub
            max_retries: Número máximo de tentativas

        Returns:
            bool: True se download foi bem-sucedido
        """
        logger.info(f"📥 Iniciando download: {model_name}")

        # Tenta carregar localmente primeiro (verificação mais robusta)
        if self.is_model_downloaded(model_name):
            logger.info(f"✅ Modelo já baixado e validado localmente: {model_name}")
            return True

        # Garantir diretórios antes do download
        self._ensure_directories()

        for attempt in range(1, max_retries + 1):
            logger.info(f"🔄 Tentativa {attempt}/{max_retries} para {model_name}")

            try:
                start_time = time.time()

                # OTIMIZAÇÃO CRÍTICA: Usar snapshot_download em vez de from_pretrained
                # Isso baixa APENAS os arquivos, sem carregar na memória
                logger.info(f"📦 Baixando arquivos do modelo (sem carregar na RAM)...")

                model_path = snapshot_download(
                    repo_id=model_name,
                    cache_dir=str(self.cache_dir),
                    resume_download=True,
                    max_workers=1,  # Limite de 1 thread para download mais suave
                    local_files_only=False,
                )

                elapsed_time = time.time() - start_time

                # Validação leve: apenas verificar se os arquivos essenciais existem
                if self._validate_downloaded_files(model_name, model_path):
                    logger.info(
                        f"✅ Download concluído: {model_name} ({elapsed_time:.1f}s)"
                    )
                    return True
                else:
                    logger.warning(f"⚠️ Validação de arquivos falhou para {model_name}")

            except Exception as e:
                logger.error(f"❌ Erro no download (tentativa {attempt}): {e}")

                if attempt < max_retries:
                    wait_time = 2**attempt  # Backoff exponencial
                    logger.info(
                        f"⏳ Aguardando {wait_time}s antes da próxima tentativa..."
                    )
                    time.sleep(wait_time)

        logger.error(
            f"💥 Falha no download após {max_retries} tentativas: {model_name}"
        )
        return False

    def is_model_downloaded(self, model_name: str) -> bool:
        """
        Verifica se um modelo já foi baixado e pode ser carregado localmente.
        Esta é uma verificação mais robusta do que procurar por um arquivo .bin.

        Args:
            model_name: Nome do modelo no HuggingFace Hub

        Returns:
            bool: True se o modelo já foi baixado, False caso contrário
        """
        try:
            # Tenta carregar a configuração SOMENTE de arquivos locais.
            # Se funcionar, o modelo está presente e provavelmente íntegro.
            _ = AutoConfig.from_pretrained(
                model_name, cache_dir=str(self.cache_dir), local_files_only=True
            )
            return True
        except Exception:
            return False

    def _validate_downloaded_files(self, model_name: str, model_path: str) -> bool:
        """
        Validação LEVE que verifica apenas se os arquivos essenciais existem.
        Não carrega o modelo na memória, evitando travamentos.

        Args:
            model_name: Nome do modelo no HuggingFace Hub
            model_path: Caminho onde o modelo foi baixado

        Returns:
            bool: True se os arquivos essenciais existem
        """
        try:
            model_dir = Path(model_path)

            # Verifica arquivos essenciais
            essential_files = [
                "config.json",  # Configuração do modelo
            ]

            # Verifica se pelo menos os arquivos de configuração existem
            for file_name in essential_files:
                file_path = model_dir / file_name
                if not file_path.exists():
                    logger.error(f"❌ Arquivo essencial não encontrado: {file_path}")
                    return False

            # Verifica se existe pelo menos um arquivo de modelo (.bin, .safetensors, .onnx, etc.)
            model_files = list(model_dir.glob("*.bin")) + \
                         list(model_dir.glob("*.safetensors")) + \
                         list(model_dir.glob("*.onnx"))

            if not model_files:
                logger.error(f"❌ Nenhum arquivo de modelo encontrado em: {model_path}")
                return False

            # Se chegou até aqui, o modelo parece estar íntegro
            logger.info(f"🔍 Validação de arquivos bem-sucedida para {model_name}")
            logger.info(f"   📁 Localização: {model_path}")
            logger.info(f"   📄 Arquivos de modelo: {len(model_files)}")

            return True

        except Exception as e:
            logger.error(f"❌ Erro na validação de arquivos para {model_name}: {str(e)}")
            return False

    def _validate_model(
        self,
        model_name: str,
        tokenizer: AutoTokenizer,
        model: AutoModel,
    ) -> bool:
        """
        Valida se um modelo baixado é válido.

        Args:
            model_name: Nome do modelo no HuggingFace Hub
            tokenizer: Tokenizer do modelo
            model: Modelo baixado

        Returns:
            bool: True se o modelo é válido, False caso contrário
        """
        try:
            # Testa tokenização e uma pequena inferência para garantir
            test_text = "Teste de validação do modelo."
            inputs = tokenizer(test_text, return_tensors="pt")

            # Move os inputs para a CPU se necessário
            if self.force_cpu_only:
                inputs = {k: v.to("cpu") for k, v in inputs.items()}

            with torch.no_grad():
                outputs = model(**inputs)

            # Verifica se a saída tem a estrutura esperada
            if hasattr(outputs, 'last_hidden_state') and outputs.last_hidden_state.shape[1] > 0:
                logger.info(f"🔍 Validação bem-sucedida para {model_name}")
                return True

        except Exception as e:
            logger.error(f"❌ Erro na validação do modelo {model_name}: {str(e)}")

        return False


def download_default_models() -> Dict[str, bool]:
    """
    Baixa todos os modelos padrão definidos em constants.py.

    Returns:
        Dicionário com status de download de cada modelo
    """
    from server.utils.model_downloader import ModelDownloader

    # Configurações para evitar travamentos
    configure_minimal_resources()
    set_low_priority()

    model_downloader = ModelDownloader()
    print("🚀 Iniciando download dos modelos padrão...")
    print("⚙️  Modo de baixo recurso ativado para evitar travamentos.")

    # Garantir que o diretório de cache existe (padrão Slice/ALIVE)
    Path(MODEL_CACHE_DIR).mkdir(parents=True, exist_ok=True)

    results = {}
    total_models = len(DEFAULT_MODELS)

    for i, (function_name, model_name) in enumerate(DEFAULT_MODELS.items(), 1):
        print(f"\n[{i}/{total_models}] Função: {function_name}")

        # Tenta download com retry
        success = False
        for attempt in range(MAX_DOWNLOAD_RETRIES):
            if attempt > 0:
                print(f"  🔄 Tentativa {attempt + 1}/{MAX_DOWNLOAD_RETRIES}")
                time.sleep(2)  # Pausa entre tentativas

            success = model_downloader.download_model(model_name)
            if success:
                break

        results[function_name] = success

        if not success:
            print(f"  ⚠️  Falha após {MAX_DOWNLOAD_RETRIES} tentativas")

    # Relatório final
    successful = sum(1 for v in results.values() if v)
    print(f"\n📊 Relatório final:")
    print(f"  ✅ Sucessos: {successful}/{total_models}")
    print(f"  ❌ Falhas: {total_models - successful}/{total_models}")

    if successful == total_models:
        print("🎉 Todos os modelos foram baixados com sucesso!")
    else:
        print("⚠️  Alguns modelos falharam. Verifique logs acima.")

    return results


def list_downloaded_models() -> List[Dict[str, Any]]:
    """
    Lista todos os modelos baixados no cache.

    Returns:
        Lista de dicionários com informações dos modelos
    """
    cache_path = Path(MODEL_CACHE_DIR)
    if not cache_path.exists():
        print("📁 Cache de modelos não encontrado.")
        return []

    models = []

    # Busca por diretórios de modelos
    for model_dir in cache_path.rglob("*"):
        if model_dir.is_dir() and (model_dir / "config.json").exists():
            # Calcula tamanho do modelo
            size_bytes = sum(
                f.stat().st_size for f in model_dir.rglob("*") if f.is_file()
            )
            size_mb = size_bytes / (1024 * 1024)

            # Extrai nome do modelo do caminho
            model_name = str(model_dir.relative_to(cache_path))
            if "--" in model_name:
                model_name = model_name.replace("--", "/")

            models.append(
                {
                    "name": model_name,
                    "path": str(model_dir),
                    "size_mb": round(size_mb, 2),
                    "files": len(list(model_dir.rglob("*"))),
                }
            )

    if models:
        print(f"📦 Modelos baixados ({len(models)} encontrados):")
        for model in models:
            print(f"  • {model['name']} ({model['size_mb']} MB)")
    else:
        print("📦 Nenhum modelo encontrado no cache.")

    return models


def validate_model(model_name: str) -> bool:
    """
    Valida se um modelo está corretamente baixado e pode ser carregado.

    Args:
        model_name: Nome do modelo para validar

    Returns:
        True se modelo é válido, False caso contrário
    """
    try:
        # Tenta carregar tokenizer
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            local_files_only=True,
        )

        # Tenta carregar configuração
        config = AutoConfig.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            local_files_only=True,
        )

        # Testa tokenização simples
        test_text = "Teste de validação"
        tokens = tokenizer.encode(test_text, return_tensors="pt")

        if len(tokens[0]) > 0:
            return True

    except Exception as e:
        print(f"❌ Erro na validação do modelo {model_name}: {str(e)}")

    return False


def cleanup_cache() -> Dict[str, Any]:
    """
    Limpa arquivos antigos e corrompidos do cache.

    Returns:
        Estatísticas da limpeza
    """
    cache_path = Path(MODEL_CACHE_DIR)
    if not cache_path.exists():
        return {"cleaned": 0, "freed_mb": 0, "errors": []}

    cleaned_files = 0
    freed_bytes = 0
    errors = []

    print("🧹 Limpando cache de modelos...")

    # Remove arquivos temporários
    for temp_file in cache_path.rglob("*.tmp"):
        try:
            size = temp_file.stat().st_size
            temp_file.unlink()
            cleaned_files += 1
            freed_bytes += size
            print(f"  🗑️  Removido: {temp_file.name}")
        except Exception as e:
            errors.append(f"Erro ao remover {temp_file}: {str(e)}")

    # Remove diretórios vazios
    for empty_dir in cache_path.rglob("*"):
        if empty_dir.is_dir() and not any(empty_dir.iterdir()):
            try:
                empty_dir.rmdir()
                print(f"  📁 Diretório vazio removido: {empty_dir.name}")
            except Exception as e:
                errors.append(f"Erro ao remover diretório {empty_dir}: {str(e)}")

    freed_mb = freed_bytes / (1024 * 1024)

    print(f"✨ Limpeza concluída:")
    print(f"  • Arquivos removidos: {cleaned_files}")
    print(f"  • Espaço liberado: {freed_mb:.2f} MB")
    if errors:
        print(f"  • Erros: {len(errors)}")

    return {
        "cleaned": cleaned_files,
        "freed_mb": round(freed_mb, 2),
        "errors": errors,
    }


def get_model_info(model_name: str) -> Dict[str, Any]:
    import os
    os.environ["CUDA_VISIBLE_DEVICES"] = ""  # Desativa GPU se tiver
    try:
        config = AutoConfig.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            local_files_only=True,
        )

        return {
            "name": model_name,
            "architecture": config.architectures[0] if config.architectures else "unknown",
            "vocab_size": getattr(config, "vocab_size", "unknown"),
            "hidden_size": getattr(config, "hidden_size", "unknown"),
            "num_layers": getattr(config, "num_hidden_layers", "unknown"),
            "max_position": getattr(config, "max_position_embeddings", "unknown"),
            "model_type": getattr(config, "model_type", "unknown"),
        }

    except Exception as e:
        return {
            "name": model_name,
            "error": str(e),
            "available": False,
        }


if __name__ == "__main__":
    import sys

    # Configurações para evitar travamentos ao executar o script diretamente
    configure_minimal_resources()
    set_low_priority()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "download":
            download_default_models()
        elif command == "list":
            list_downloaded_models()
        elif command == "cleanup":
            cleanup_cache()
        elif command == "validate":
            if len(sys.argv) > 2:
                model_name = sys.argv[2]
                is_valid = validate_model(model_name)
                print(
                    f"Modelo {model_name}: {'✅ Válido' if is_valid else '❌ Inválido'}"
                )
            else:
                print("Usage: python model_downloader.py validate <model_name>")
        else:
            print("Comandos disponíveis: download, list, cleanup, validate")
    else:
        print("Usage: python model_downloader.py <command>")
        print("Comandos: download, list, cleanup, validate")
        print("💡 Dica: Use 'download' para baixar todos os modelos padrão com baixo recurso.")
