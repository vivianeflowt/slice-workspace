"""
Utilitário para download e gerenciamento de modelos HuggingFace.

Este módulo é responsável por:
- Baixar modelos padrão na instalação
- Listar modelos disponíveis 
- Validar modelos baixados
- Gerenciar cache de modelos
"""

import os
import time
from typing import List, Dict, Any
from pathlib import Path
import torch
from transformers import AutoTokenizer, AutoModel, AutoConfig
from server.constants import (
    DEFAULT_MODELS,
    MODEL_CACHE_DIR,
    DOWNLOAD_TIMEOUT,
    MAX_DOWNLOAD_RETRIES,
    FORCE_CPU_ONLY,
)


def ensure_cache_dir() -> Path:
    """Garante que o diretório de cache existe."""
    cache_path = Path(MODEL_CACHE_DIR)
    cache_path.mkdir(parents=True, exist_ok=True)
    return cache_path


def download_model(model_name: str, force_cpu: bool = FORCE_CPU_ONLY) -> bool:
    """
    Baixa um modelo específico do HuggingFace.
    
    Args:
        model_name: Nome do modelo no HuggingFace Hub
        force_cpu: Se deve forçar CPU apenas
        
    Returns:
        True se download foi bem-sucedido, False caso contrário
    """
    print(f"📥 Baixando modelo: {model_name}")
    
    try:
        # Configura device para CPU apenas se necessário
        if force_cpu:
            torch.set_default_tensor_type('torch.FloatTensor')
        
        # Baixa tokenizer
        print(f"  ├── Baixando tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            trust_remote_code=False,
        )
        
        # Baixa configuração
        print(f"  ├── Baixando configuração...")
        config = AutoConfig.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            trust_remote_code=False,
        )
        
        # Baixa modelo
        print(f"  ├── Baixando modelo...")
        model = AutoModel.from_pretrained(
            model_name,
            cache_dir=MODEL_CACHE_DIR,
            torch_dtype=torch.float32 if force_cpu else "auto",
            device_map=None if force_cpu else "auto",
            trust_remote_code=False,
        )
        
        # Move para CPU se necessário
        if force_cpu:
            model = model.to("cpu")
        
        print(f"  └── ✅ Modelo {model_name} baixado com sucesso!")
        return True
        
    except Exception as e:
        print(f"  └── ❌ Erro ao baixar {model_name}: {str(e)}")
        return False


def download_default_models() -> Dict[str, bool]:
    """
    Baixa todos os modelos padrão definidos em constants.py.
    
    Returns:
        Dicionário com status de download de cada modelo
    """
    print("🚀 Iniciando download dos modelos padrão...")
    ensure_cache_dir()
    
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
            
            success = download_model(model_name)
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
                f.stat().st_size 
                for f in model_dir.rglob("*") 
                if f.is_file()
            )
            size_mb = size_bytes / (1024 * 1024)
            
            # Extrai nome do modelo do caminho
            model_name = str(model_dir.relative_to(cache_path))
            if "--" in model_name:
                model_name = model_name.replace("--", "/")
            
            models.append({
                "name": model_name,
                "path": str(model_dir),
                "size_mb": round(size_mb, 2),
                "files": len(list(model_dir.rglob("*"))),
            })
    
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
    """
    Obtém informações detalhadas sobre um modelo.
    
    Args:
        model_name: Nome do modelo
        
    Returns:
        Dicionário com informações do modelo
    """
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
                print(f"Modelo {model_name}: {'✅ Válido' if is_valid else '❌ Inválido'}")
            else:
                print("Usage: python model_downloader.py validate <model_name>")
        else:
            print("Comandos disponíveis: download, list, cleanup, validate")
    else:
        print("Usage: python model_downloader.py <command>")
        print("Comandos: download, list, cleanup, validate")
