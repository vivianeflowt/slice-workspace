#!/usr/bin/env python3
"""
🔄 Reset Script - Slice/ALIVE Providers Server
Restauração rápida e completa do ambiente em < 30 minutos.

Princípios CONCEPTS.md:
- Restauração Rápida: Sistema operacional em < 30 min
- Incrementalismo: Etapas validadas e priorizadas
- Plug-and-Play: Reset automático sem intervenção manual
- Baixo Recurso: Prioriza recursos críticos primeiro
"""

import logging
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def run_command(command, description, critical=True, timeout=300):
    """
    Executa comando com logging e tratamento de erro.

    Args:
        command: Lista com comando e argumentos
        description: Descrição da operação
        critical: Se True, falha para script se comando falhar
        timeout: Timeout em segundos

    Returns:
        bool: True se comando executou com sucesso
    """
    logger.info(f"🔄 {description}...")

    try:
        result = subprocess.run(
            command, capture_output=True, text=True, timeout=timeout, cwd=Path.cwd()
        )

        if result.returncode == 0:
            logger.info(f"✅ {description} - Concluído")
            if result.stdout.strip():
                logger.debug(f"Output: {result.stdout.strip()}")
            return True
        else:
            logger.error(f"❌ {description} - Falhou (exit code: {result.returncode})")
            if result.stderr.strip():
                logger.error(f"Error: {result.stderr.strip()}")

            if critical:
                logger.error("💥 Operação crítica falhou - Interrompendo reset")
                sys.exit(1)
            return False

    except subprocess.TimeoutExpired:
        logger.error(f"⏰ {description} - Timeout ({timeout}s)")
        if critical:
            sys.exit(1)
        return False
    except Exception as e:
        logger.error(f"💥 {description} - Erro: {e}")
        if critical:
            sys.exit(1)
        return False


def backup_critical_data():
    """
    Backup de dados críticos antes do reset.

    Returns:
        Path: Caminho do backup ou None se falhou
    """
    logger.info("💾 Criando backup de dados críticos...")

    backup_dir = (
        Path.cwd() / "backup" / f"reset_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    )
    backup_dir.mkdir(parents=True, exist_ok=True)

    # Arquivos críticos para backup
    critical_files = [
        "server/constants.py",
        "pyproject.toml",
        "Taskfile.yml",
        ".env",
        "health_report.json",
    ]

    backed_up = 0
    for file_path in critical_files:
        source = Path.cwd() / file_path
        if source.exists():
            try:
                destination = backup_dir / file_path
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                logger.info(f"  📁 Backup: {file_path}")
                backed_up += 1
            except Exception as e:
                logger.warning(f"  ⚠️  Falha ao fazer backup de {file_path}: {e}")

    if backed_up > 0:
        logger.info(f"✅ Backup criado: {backed_up} arquivos em {backup_dir}")
        return backup_dir
    else:
        logger.warning("⚠️  Nenhum arquivo crítico encontrado para backup")
        return None


def clean_environment():
    """
    Limpa ambiente atual (cache, temporários, builds).
    """
    logger.info("🧹 Limpando ambiente atual...")

    # Usar o script de limpeza existente
    clean_script = Path.cwd() / "scripts" / "clean.py"
    if clean_script.exists():
        run_command(
            ["python", str(clean_script)], "Limpeza completa via script", critical=False
        )
    else:
        logger.warning("⚠️  Script de limpeza não encontrado - limpeza manual")

        # Limpeza manual básica
        dirs_to_clean = ["__pycache__", ".pytest_cache", "build", "dist", ".cache"]

        for dir_name in dirs_to_clean:
            dir_path = Path.cwd() / dir_name
            if dir_path.exists():
                try:
                    shutil.rmtree(dir_path)
                    logger.info(f"  🗑️  Removido: {dir_name}")
                except Exception as e:
                    logger.warning(f"  ⚠️  Erro ao remover {dir_name}: {e}")


def reinstall_dependencies():
    """
    Reinstala dependências do zero.
    """
    logger.info("📦 Reinstalando dependências...")

    # Verificar se pip existe
    run_command(["pip", "--version"], "Verificando pip", critical=True)

    # Upgrade pip
    run_command(
        ["pip", "install", "--upgrade", "pip"], "Upgrade do pip", critical=False
    )

    # Instalar dependências via pyproject.toml
    pyproject_path = Path.cwd() / "pyproject.toml"
    if pyproject_path.exists():
        run_command(
            ["pip", "install", "-e", "."],
            "Instalação via pyproject.toml",
            critical=True,
            timeout=600,  # 10 minutos para download de dependências
        )
    else:
        logger.error("❌ pyproject.toml não encontrado")
        sys.exit(1)


def download_essential_models():
    """
    Download apenas dos modelos essenciais (em background se possível).
    """
    logger.info("🤖 Baixando modelos essenciais...")

    # Usar script de models existente
    models_script = Path.cwd() / "scripts" / "models.py"
    if models_script.exists():
        # Download apenas modelos pequenos/essenciais primeiro
        run_command(
            ["python", str(models_script), "download", "--essential"],
            "Download de modelos essenciais",
            critical=False,
            timeout=900,  # 15 minutos para modelos essenciais
        )
    else:
        logger.warning("⚠️  Script de models não encontrado - pulando download")


def validate_installation():
    """
    Valida se a instalação está funcionando.
    """
    logger.info("🔍 Validando instalação...")

    # Usar script de validação existente
    validate_script = Path.cwd() / "scripts" / "validate.py"
    if validate_script.exists():
        return run_command(
            ["python", str(validate_script)], "Validação completa", critical=False
        )
    else:
        logger.warning("⚠️  Script de validação não encontrado")

        # Validação básica manual
        try:
            # Testar imports básicos
            import server
            import server.main
            from server.constants import MODELS

            logger.info("✅ Imports básicos funcionando")
            return True
        except Exception as e:
            logger.error(f"❌ Falha nos imports básicos: {e}")
            return False


def start_services():
    """
    Inicia serviços em modo teste.
    """
    logger.info("🚀 Testando inicialização de serviços...")

    # Testar start rápido (apenas validação)
    start_script = Path.cwd() / "scripts" / "start.py"
    if start_script.exists():
        run_command(
            ["python", str(start_script), "--test"],
            "Teste de inicialização",
            critical=False,
            timeout=60,
        )
    else:
        logger.warning("⚠️  Script de start não encontrado")


def main():
    """Executa reset completo do ambiente."""
    import argparse

    parser = argparse.ArgumentParser(description="Reset completo do ambiente")
    parser.add_argument(
        "--no-backup", action="store_true", help="Pula backup de dados críticos"
    )
    parser.add_argument(
        "--skip-models", action="store_true", help="Pula download de modelos"
    )
    parser.add_argument(
        "--fast", action="store_true", help="Reset rápido (pula validações opcionais)"
    )

    args = parser.parse_args()

    logger.info("🔄 Iniciando Reset - Slice/ALIVE Providers Server")
    logger.info("🎯 Meta: Sistema operacional em < 30 minutos")
    logger.info("=" * 60)

    start_time = time.time()

    # Etapa 1: Backup (se solicitado)
    if not args.no_backup:
        backup_path = backup_critical_data()
    else:
        logger.info("⏭️  Pulando backup (--no-backup)")
        backup_path = None

    # Etapa 2: Limpeza
    clean_environment()

    # Etapa 3: Reinstalação de dependências
    reinstall_dependencies()

    # Etapa 4: Download de modelos (se não skipado)
    if not args.skip_models:
        download_essential_models()
    else:
        logger.info("⏭️  Pulando download de modelos (--skip-models)")

    # Etapa 5: Validação
    if not args.fast:
        validation_ok = validate_installation()
        if not validation_ok:
            logger.warning("⚠️  Validação falhou - sistema pode ter problemas")
    else:
        logger.info("⏭️  Pulando validação completa (--fast)")

    # Etapa 6: Teste de serviços
    if not args.fast:
        start_services()

    elapsed_time = time.time() - start_time
    minutes = elapsed_time / 60

    logger.info("=" * 60)
    logger.info(f"🔄 Reset Finalizado - {elapsed_time:.1f}s ({minutes:.1f} min)")

    if minutes < 30:
        logger.info("🎉 ✅ Meta atingida: Reset em < 30 minutos!")
    else:
        logger.warning(f"⚠️  Meta não atingida: Reset levou {minutes:.1f} minutos")

    if backup_path:
        logger.info(f"💾 Backup disponível em: {backup_path}")

    logger.info("🚀 Sistema pronto para uso!")
    logger.info("💡 Próximos passos:")
    logger.info("   1. Execute 'task health' para verificar status")
    logger.info("   2. Execute 'task start' para iniciar servidor")
    logger.info("   3. Execute 'task test' para validar funcionamento")


if __name__ == "__main__":
    main()
