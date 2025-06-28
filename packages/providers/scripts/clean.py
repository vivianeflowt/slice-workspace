#!/usr/bin/env python3
"""
🧹 Clean Script - Slice/ALIVE Providers Server
Limpeza de arquivos temporários e cache desnecessário.

Princípios CONCEPTS.md:
- Baixo Recurso: Libera espaço e recursos
- Incrementalismo: Limpeza categórica e validada
- Isolamento por Camada: Separa por tipo de arquivo
- Restauração Rápida: Mantém apenas essenciais
"""

import logging
import shutil
import sys
import time
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Diretórios e padrões para limpeza
CLEANUP_PATTERNS = {
    "python_cache": [
        "**/__pycache__",
        "**/*.pyc",
        "**/*.pyo",
        "**/*.pyd",
        ".pytest_cache",
    ],
    "build_artifacts": ["build/", "dist/", "*.egg-info/"],
    "logs": ["*.log", "logs/*.log", "server.log*"],
    "temp_files": ["tmp/", "temp/", "*.tmp", "*.temp", ".coverage"],
    "model_cache": ["models/cache/", ".cache/huggingface/"],
    "test_artifacts": [
        ".pytest_cache/",
        "htmlcov/",
        "coverage.xml",
        "test-results.xml",
    ],
}


def get_directory_size(path):
    """
    Calcula tamanho total de um diretório.

    Args:
        path: Caminho do diretório

    Returns:
        int: Tamanho em bytes
    """
    total_size = 0
    try:
        for dirpath, dirnames, filenames in path.rglob("*"):
            for filename in filenames:
                file_path = dirpath / filename
                if file_path.exists():
                    total_size += file_path.stat().st_size
    except Exception as e:
        logger.warning(f"Erro ao calcular tamanho de {path}: {e}")

    return total_size


def format_size(size_bytes):
    """
    Formata tamanho em bytes para formato legível.

    Args:
        size_bytes: Tamanho em bytes

    Returns:
        str: Tamanho formatado (ex: "1.5 MB")
    """
    if size_bytes == 0:
        return "0 B"

    units = ["B", "KB", "MB", "GB"]
    unit_index = 0
    size = float(size_bytes)

    while size >= 1024 and unit_index < len(units) - 1:
        size /= 1024
        unit_index += 1

    return f"{size:.1f} {units[unit_index]}"


def clean_category(category_name, patterns, dry_run=False):
    """
    Limpa arquivos de uma categoria específica.

    Args:
        category_name: Nome da categoria
        patterns: Lista de padrões glob
        dry_run: Se True, apenas simula a limpeza

    Returns:
        tuple: (arquivos_removidos, espaço_liberado)
    """
    logger.info(f"🧹 Limpando categoria: {category_name}")

    files_removed = 0
    space_freed = 0

    for pattern in patterns:
        try:
            # Usar Path.cwd() para buscar a partir do diretório atual
            base_path = Path.cwd()

            # Buscar arquivos e diretórios que correspondem ao padrão
            if pattern.endswith("/"):
                # É um diretório
                for path in base_path.glob(pattern):
                    if path.is_dir():
                        size = get_directory_size(path)

                        if dry_run:
                            logger.info(
                                f"  [DRY-RUN] Removeria diretório: {path} ({format_size(size)})"
                            )
                        else:
                            logger.info(
                                f"  🗑️  Removendo diretório: {path} ({format_size(size)})"
                            )
                            shutil.rmtree(path, ignore_errors=True)

                        space_freed += size
                        files_removed += 1
            else:
                # São arquivos
                for path in base_path.rglob(pattern):
                    if path.is_file():
                        size = path.stat().st_size

                        if dry_run:
                            logger.info(
                                f"  [DRY-RUN] Removeria arquivo: {path} ({format_size(size)})"
                            )
                        else:
                            logger.info(
                                f"  🗑️  Removendo arquivo: {path} ({format_size(size)})"
                            )
                            path.unlink(missing_ok=True)

                        space_freed += size
                        files_removed += 1

        except Exception as e:
            logger.warning(f"  ⚠️  Erro ao processar padrão '{pattern}': {e}")

    logger.info(
        f"  ✅ {category_name}: {files_removed} itens, {format_size(space_freed)} liberados"
    )
    return files_removed, space_freed


def clean_models_cache(dry_run=False):
    """
    Limpeza específica do cache de modelos HuggingFace.

    Args:
        dry_run: Se True, apenas simula a limpeza

    Returns:
        tuple: (arquivos_removidos, espaço_liberado)
    """
    logger.info("🧹 Limpando cache de modelos HuggingFace...")

    # Diretórios de cache do HuggingFace
    cache_dirs = [
        Path.home() / ".cache" / "huggingface",
        Path.cwd() / ".cache" / "huggingface",
        Path.cwd() / "models" / "cache",
    ]

    total_files = 0
    total_space = 0

    for cache_dir in cache_dirs:
        if cache_dir.exists():
            size = get_directory_size(cache_dir)

            if size > 0:
                if dry_run:
                    logger.info(
                        f"  [DRY-RUN] Removeria cache: {cache_dir} ({format_size(size)})"
                    )
                else:
                    logger.info(
                        f"  🗑️  Removendo cache: {cache_dir} ({format_size(size)})"
                    )
                    shutil.rmtree(cache_dir, ignore_errors=True)

                total_files += 1
                total_space += size

    return total_files, total_space


def get_current_disk_usage():
    """
    Retorna uso atual do disco.

    Returns:
        dict: Informações de uso do disco
    """
    try:
        disk_usage = shutil.disk_usage(Path.cwd())
        return {
            "total": disk_usage.total,
            "used": disk_usage.used,
            "free": disk_usage.free,
            "percent_used": (disk_usage.used / disk_usage.total) * 100,
        }
    except Exception as e:
        logger.warning(f"Erro ao obter uso do disco: {e}")
        return {}


def main():
    """Executa limpeza completa do sistema."""
    import argparse

    parser = argparse.ArgumentParser(description="Limpeza de arquivos temporários")
    parser.add_argument(
        "--dry-run", action="store_true", help="Simula limpeza sem remover arquivos"
    )
    parser.add_argument(
        "--category", type=str, help="Limpa apenas categoria específica"
    )
    parser.add_argument(
        "--skip-models", action="store_true", help="Pula limpeza do cache de modelos"
    )

    args = parser.parse_args()

    logger.info("🧹 Iniciando Limpeza - Slice/ALIVE Providers Server")

    if args.dry_run:
        logger.info("🔍 Modo DRY-RUN ativado - nenhum arquivo será removido")

    logger.info("=" * 60)

    # Verificar uso do disco antes
    disk_before = get_current_disk_usage()
    if disk_before:
        logger.info(
            f"💾 Disco antes: {format_size(disk_before['used'])}/{format_size(disk_before['total'])} "
            f"({disk_before['percent_used']:.1f}% usado)"
        )

    start_time = time.time()
    total_files_removed = 0
    total_space_freed = 0

    # Limpeza por categoria
    if args.category:
        if args.category in CLEANUP_PATTERNS:
            files, space = clean_category(
                args.category, CLEANUP_PATTERNS[args.category], args.dry_run
            )
            total_files_removed += files
            total_space_freed += space
        else:
            logger.error(f"❌ Categoria '{args.category}' não encontrada")
            logger.info(f"Categorias disponíveis: {', '.join(CLEANUP_PATTERNS.keys())}")
            sys.exit(1)
    else:
        # Limpeza completa
        for category, patterns in CLEANUP_PATTERNS.items():
            files, space = clean_category(category, patterns, args.dry_run)
            total_files_removed += files
            total_space_freed += space

    # Limpeza específica de modelos (se não foi skipada)
    if not args.skip_models:
        files, space = clean_models_cache(args.dry_run)
        total_files_removed += files
        total_space_freed += space

    # Verificar uso do disco após
    disk_after = get_current_disk_usage()

    elapsed_time = time.time() - start_time
    logger.info("=" * 60)
    logger.info(f"🧹 Limpeza Finalizada - {elapsed_time:.2f}s")

    if args.dry_run:
        logger.info(
            f"🔍 [DRY-RUN] Seria removido: {total_files_removed} itens, {format_size(total_space_freed)}"
        )
    else:
        logger.info(
            f"✅ Removido: {total_files_removed} itens, {format_size(total_space_freed)} liberados"
        )

        if disk_after and disk_before:
            space_change = disk_before["used"] - disk_after["used"]
            logger.info(
                f"💾 Disco após: {format_size(disk_after['used'])}/{format_size(disk_after['total'])} "
                f"({disk_after['percent_used']:.1f}% usado)"
            )
            if space_change > 0:
                logger.info(f"🎉 Espaço real liberado: {format_size(space_change)}")


if __name__ == "__main__":
    main()
