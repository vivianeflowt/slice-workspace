#!/usr/bin/env python3
"""
Script de verificação pré-instalação para o Servidor Providers.

Executa verificações completas do sistema antes da instalação,
garantindo que todos os pré-requisitos estejam atendidos.
"""

import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple


def check_python_version() -> Tuple[bool, str]:
    """Verifica versão do Python."""
    try:
        version = sys.version_info
        if version >= (3, 10):
            return True, f"✅ Python {version.major}.{version.minor}.{version.micro}"
        else:
            return (
                False,
                f"❌ Python {version.major}.{version.minor} - Necessário 3.10+",
            )
    except Exception as e:
        return False, f"❌ Erro ao verificar Python: {str(e)}"


def check_pdm() -> Tuple[bool, str]:
    """Verifica se PDM está instalado."""
    try:
        result = subprocess.run(
            ["pdm", "--version"], capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            version = result.stdout.strip()
            return True, f"✅ PDM {version}"
        else:
            return False, "❌ PDM não responde corretamente"
    except FileNotFoundError:
        return False, "❌ PDM não encontrado - Execute: pip install pdm"
    except subprocess.TimeoutExpired:
        return False, "❌ PDM timeout"
    except Exception as e:
        return False, f"❌ Erro ao verificar PDM: {str(e)}"


def check_git() -> Tuple[bool, str]:
    """Verifica se Git está disponível."""
    try:
        result = subprocess.run(
            ["git", "--version"], capture_output=True, text=True, timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.strip()
            return True, f"✅ {version}"
        else:
            return False, "❌ Git não responde"
    except FileNotFoundError:
        return False, "❌ Git não encontrado (opcional)"
    except Exception:
        return False, "⚠️  Git indisponível (opcional)"


def check_system_resources() -> Tuple[bool, str]:
    """Verifica recursos do sistema."""
    try:
        import psutil

        # Memória
        memory = psutil.virtual_memory()
        memory_gb = memory.total / (1024**3)

        # Espaço em disco
        disk = psutil.disk_usage("/")
        disk_free_gb = disk.free / (1024**3)

        # CPU
        cpu_count = psutil.cpu_count()

        issues = []
        if memory_gb < 4:
            issues.append(f"Pouca RAM: {memory_gb:.1f}GB (recomendado: 4GB+)")

        if disk_free_gb < 5:
            issues.append(
                f"Pouco espaço: {disk_free_gb:.1f}GB livres (necessário: 5GB+)"
            )

        if cpu_count < 2:
            issues.append(f"Poucas CPUs: {cpu_count} (recomendado: 2+)")

        if issues:
            return False, f"⚠️  Recursos limitados: {'; '.join(issues)}"

        return (
            True,
            f"✅ Recursos OK: {memory_gb:.1f}GB RAM, {disk_free_gb:.1f}GB livres, {cpu_count} CPUs",
        )

    except ImportError:
        return True, "⚠️  psutil não disponível - recursos não verificados"
    except Exception as e:
        return False, f"❌ Erro ao verificar recursos: {str(e)}"


def check_network_access() -> Tuple[bool, str]:
    """Verifica acesso à internet para download de modelos."""
    try:
        import urllib.request

        # Testa HuggingFace Hub
        response = urllib.request.urlopen("https://huggingface.co", timeout=10)

        if response.getcode() == 200:
            return True, "✅ Acesso à internet OK (HuggingFace Hub acessível)"
        else:
            return False, "❌ HuggingFace Hub inacessível"

    except Exception as e:
        return False, f"❌ Sem acesso à internet: {str(e)}"


def check_port_availability() -> Tuple[bool, str]:
    """Verifica se porta 5115 está disponível."""
    try:
        import socket

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(("localhost", 5115))
            return True, "✅ Porta 5115 disponível"

    except OSError as e:
        if "Address already in use" in str(e):
            return False, "❌ Porta 5115 em uso - pare outros serviços"
        else:
            return False, f"❌ Erro na porta 5115: {str(e)}"
    except Exception as e:
        return False, f"❌ Erro ao verificar porta: {str(e)}"


def check_permissions() -> Tuple[bool, str]:
    """Verifica permissões de escrita."""
    try:
        current_dir = Path.cwd()
        test_file = current_dir / ".test_write_permission"

        # Testa escrita
        test_file.write_text("test")
        test_file.unlink()

        # Verifica diretório de cache
        cache_dir = Path.home() / ".cache" / "slice-providers"
        cache_dir.mkdir(parents=True, exist_ok=True)

        test_cache = cache_dir / ".test_write"
        test_cache.write_text("test")
        test_cache.unlink()

        return True, "✅ Permissões de escrita OK"

    except PermissionError:
        return False, "❌ Permissões insuficientes para escrita"
    except Exception as e:
        return False, f"❌ Erro de permissão: {str(e)}"


def get_system_info() -> Dict[str, Any]:
    """Coleta informações do sistema."""
    return {
        "platform": platform.platform(),
        "python": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "architecture": platform.architecture()[0],
        "processor": platform.processor() or "unknown",
        "cwd": str(Path.cwd()),
    }


def main():
    """Executa todas as verificações."""
    print("🔍 VERIFICAÇÃO PRÉ-INSTALAÇÃO - Servidor Providers HuggingFace")
    print("=" * 70)

    # Lista de verificações
    checks = [
        ("Python 3.10+", check_python_version),
        ("PDM Package Manager", check_pdm),
        ("Git (opcional)", check_git),
        ("Recursos do Sistema", check_system_resources),
        ("Acesso à Internet", check_network_access),
        ("Porta 5115", check_port_availability),
        ("Permissões", check_permissions),
    ]

    results = []
    critical_failures = 0

    print("\n📋 VERIFICAÇÕES:")

    for check_name, check_func in checks:
        try:
            success, message = check_func()
            results.append((check_name, success, message))

            print(f"  {message}")

            # Conta falhas críticas (não opcionais)
            if not success and not message.startswith("⚠️"):
                critical_failures += 1

        except Exception as e:
            message = f"❌ Erro interno: {str(e)}"
            results.append((check_name, False, message))
            print(f"  {message}")
            critical_failures += 1

    # Informações do sistema
    print("\n💻 INFORMAÇÕES DO SISTEMA:")
    sys_info = get_system_info()
    for key, value in sys_info.items():
        print(f"  • {key.title()}: {value}")

    # Resultado final
    print("\n" + "=" * 70)

    if critical_failures == 0:
        print("🎉 SISTEMA PRONTO PARA INSTALAÇÃO!")
        print("\n🚀 Execute agora:")
        print("   task install")
        print("\n   Ou para start completo:")
        print("   task quick-start")
        return 0
    else:
        print(f"❌ {critical_failures} PROBLEMA(S) CRÍTICO(S) ENCONTRADO(S)")
        print("\n🔧 AÇÕES NECESSÁRIAS:")

        for check_name, success, message in results:
            if not success and not message.startswith("⚠️"):
                print(f"   • {check_name}: {message}")

        print("\n📖 Consulte INSTALL.md para instruções detalhadas")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
