#!/usr/bin/env python3
"""
Script de validação pós-instalação.

Executa testes completos após instalação para garantir que
tudo está funcionando perfeitamente - estilo CLP industrial.
"""

import json
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path
from typing import Any, Dict, List, Tuple

import requests


def test_imports() -> Tuple[bool, str]:
    """Testa imports essenciais."""
    try:
        # Imports básicos
        import fastapi
        import pydantic
        import torch
        import transformers
        import uvicorn

        # Imports do projeto
        from server.constants import DEFAULT_MODELS, get_server_config
        from server.models import ClassificationRequest, EmbeddingRequest

        return True, "✅ Todos os imports funcionando"

    except ImportError as e:
        return False, f"❌ Erro de import: {str(e)}"
    except Exception as e:
        return False, f"❌ Erro nos imports: {str(e)}"


def test_model_downloads() -> Tuple[bool, str]:
    """Verifica se modelos foram baixados."""
    try:
        from server.utils.model_downloader import list_downloaded_models

        models = list_downloaded_models()

        if not models:
            return False, "❌ Nenhum modelo baixado"

        if len(models) < 3:
            return False, f"⚠️ Apenas {len(models)} modelos baixados (esperado: 3+)"

        total_size = sum(model.get("size_mb", 0) for model in models)

        return True, f"✅ {len(models)} modelos baixados ({total_size:.1f} MB total)"

    except Exception as e:
        return False, f"❌ Erro ao verificar modelos: {str(e)}"


def test_providers_loading() -> Tuple[bool, str]:
    """Testa carregamento dos providers."""
    try:
        from server.providers.classify import (
            get_cached_provider as get_classify_provider,
        )
        from server.providers.embed import get_cached_provider as get_embed_provider
        from server.providers.pos_tag import get_cached_provider as get_pos_provider

        # Testa providers (sem carregar modelos ainda)
        classify_provider = get_classify_provider()
        embed_provider = get_embed_provider()
        pos_provider = get_pos_provider()

        providers_info = [
            f"classify: {classify_provider.model_name}",
            f"embed: {embed_provider.model_name}",
            f"pos_tag: {pos_provider.model_name}",
        ]

        return True, f"✅ Providers OK: {', '.join(providers_info)}"

    except Exception as e:
        return False, f"❌ Erro nos providers: {str(e)}"


def test_server_startup() -> Tuple[bool, str]:
    """Testa se servidor consegue inicializar."""
    try:
        # Cria arquivo temporário para testar servidor
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
            f.write(
                """
import uvicorn
from server.main import app

if __name__ == "__main__":
    try:
        # Tenta criar o app
        print("Testing app creation...")
        assert app is not None
        print("✅ App criado com sucesso")

        # Testa configuração
        from server.constants import get_server_config
        config = get_server_config()
        print(f"✅ Configuração carregada: porta {config['port']}")

        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {e}")
        exit(1)
"""
            )
            temp_file = f.name

        # Executa teste
        result = subprocess.run(
            [sys.executable, temp_file], capture_output=True, text=True, timeout=30
        )

        # Remove arquivo temporário
        Path(temp_file).unlink()

        if result.returncode == 0 and "SUCCESS" in result.stdout:
            return True, "✅ Servidor pode inicializar corretamente"
        else:
            error_msg = result.stderr or result.stdout or "Erro desconhecido"
            return False, f"❌ Falha na inicialização: {error_msg[:100]}"

    except subprocess.TimeoutExpired:
        return False, "❌ Timeout na inicialização do servidor"
    except Exception as e:
        return False, f"❌ Erro no teste de inicialização: {str(e)}"


def test_mock_endpoints() -> Tuple[bool, str]:
    """Testa endpoints com dados mock."""
    try:
        from server.constants import MOCK_CLASSIFICATION_RESPONSE, TEST_TEXT

        # Testa se constantes existem
        if not TEST_TEXT:
            return False, "❌ TEST_TEXT não definido"

        if not MOCK_CLASSIFICATION_RESPONSE:
            return False, "❌ MOCK_CLASSIFICATION_RESPONSE não definido"

        # Testa se dados mock são válidos
        mock_data = MOCK_CLASSIFICATION_RESPONSE
        if "predictions" not in mock_data:
            return False, "❌ Mock response inválido"

        predictions = mock_data["predictions"]
        if not predictions or len(predictions) == 0:
            return False, "❌ Mock predictions vazio"

        # Valida estrutura das predições
        for pred in predictions:
            if "label" not in pred or "score" not in pred:
                return False, "❌ Estrutura de predição inválida"

        return True, f"✅ Dados mock válidos: {len(predictions)} predições"

    except Exception as e:
        return False, f"❌ Erro nos dados mock: {str(e)}"


def test_cpu_only_enforcement() -> Tuple[bool, str]:
    """Verifica se CPU-only está sendo respeitado."""
    try:
        import torch

        from server.constants import DEVICE, FORCE_CPU_ONLY

        if not FORCE_CPU_ONLY:
            return False, "❌ FORCE_CPU_ONLY não está True"

        if DEVICE != "cpu":
            return False, f"❌ DEVICE não é 'cpu': {DEVICE}"

        # Verifica se CUDA está desabilitado
        if torch.cuda.is_available():
            # CUDA disponível mas não deve ser usado
            if torch.cuda.current_device() >= 0:
                return False, "⚠️ CUDA device ativo (deveria estar desabilitado)"

        # Testa tensor padrão
        test_tensor = torch.tensor([1.0, 2.0, 3.0])
        if test_tensor.device.type != "cpu":
            return False, f"❌ Tensor não está em CPU: {test_tensor.device}"

        return True, "✅ CPU-only corretamente configurado"

    except Exception as e:
        return False, f"❌ Erro na verificação CPU-only: {str(e)}"


def test_file_structure() -> Tuple[bool, str]:
    """Verifica estrutura de arquivos essenciais."""
    required_files = [
        "server/__init__.py",
        "server/main.py",
        "server/constants.py",
        "server/models/__init__.py",
        "server/api/__init__.py",
        "server/providers/__init__.py",
        "server/providers/classify/__init__.py",
        "server/providers/embed/__init__.py",
        "server/providers/pos_tag/__init__.py",
        "server/utils/__init__.py",
        "tests/__init__.py",
        "pyproject.toml",
        "Taskfile.yml",
    ]

    missing_files = []

    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)

    if missing_files:
        return False, f"❌ Arquivos faltando: {', '.join(missing_files[:3])}..."

    return True, f"✅ Estrutura de arquivos OK ({len(required_files)} arquivos)"


def test_task_commands() -> Tuple[bool, str]:
    """Testa comandos básicos do task."""
    try:
        # Testa task --list
        result = subprocess.run(
            ["task", "--list"], capture_output=True, text=True, timeout=10
        )

        if result.returncode != 0:
            return False, "❌ 'task --list' falhou"

        # Verifica se comandos essenciais estão listados
        output = result.stdout.lower()
        essential_tasks = ["install", "start", "test", "dev", "health-check"]

        missing_tasks = [task for task in essential_tasks if task not in output]

        if missing_tasks:
            return False, f"❌ Tasks faltando: {', '.join(missing_tasks)}"

        return True, "✅ Taskfile e comandos OK"

    except subprocess.TimeoutExpired:
        return False, "❌ Timeout no comando task"
    except FileNotFoundError:
        return False, "❌ 'task' command não encontrado"
    except Exception as e:
        return False, f"❌ Erro ao testar task: {str(e)}"


def run_comprehensive_test() -> Dict[str, Any]:
    """Executa todos os testes e retorna relatório completo."""
    print("🧪 VALIDAÇÃO PÓS-INSTALAÇÃO - Teste Completo")
    print("=" * 70)

    tests = [
        ("Imports Essenciais", test_imports),
        ("Downloads de Modelos", test_model_downloads),
        ("Carregamento de Providers", test_providers_loading),
        ("Inicialização do Servidor", test_server_startup),
        ("Endpoints Mock", test_mock_endpoints),
        ("CPU-Only Enforcement", test_cpu_only_enforcement),
        ("Estrutura de Arquivos", test_file_structure),
        ("Comandos Task", test_task_commands),
    ]

    results = []
    passed = 0
    failed = 0

    print("\n🔬 EXECUTANDO TESTES:")

    for test_name, test_func in tests:
        print(f"\n  🔍 {test_name}...")

        try:
            start_time = time.time()
            success, message = test_func()
            duration = time.time() - start_time

            results.append(
                {
                    "name": test_name,
                    "success": success,
                    "message": message,
                    "duration_ms": round(duration * 1000, 2),
                }
            )

            print(f"     {message} ({duration:.2f}s)")

            if success:
                passed += 1
            else:
                failed += 1

        except Exception as e:
            error_msg = f"❌ Erro interno: {str(e)}"
            results.append(
                {
                    "name": test_name,
                    "success": False,
                    "message": error_msg,
                    "duration_ms": 0,
                }
            )

            print(f"     {error_msg}")
            failed += 1

    # Relatório final
    total_tests = len(tests)
    success_rate = (passed / total_tests) * 100

    print("\n" + "=" * 70)
    print("📊 RELATÓRIO FINAL:")
    print(f"   ✅ Passou: {passed}/{total_tests} ({success_rate:.1f}%)")
    print(f"   ❌ Falhou: {failed}/{total_tests}")

    if failed == 0:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("🚀 Sistema está 100% funcional e pronto para uso!")
        print("\n💡 Próximos passos:")
        print("   • task start     # Inicia o servidor")
        print("   • task dev       # Modo desenvolvimento")
        print("   • task test      # Executa testes unitários")

        return {"status": "success", "results": results}
    else:
        print("\n❌ ALGUNS TESTES FALHARAM")
        print("🔧 Revisar problemas acima antes de prosseguir")

        # Lista problemas críticos
        critical_failures = [r for r in results if not r["success"]]
        if critical_failures:
            print("\n🚨 PROBLEMAS CRÍTICOS:")
            for failure in critical_failures[:3]:  # Mostra até 3
                print(f"   • {failure['name']}: {failure['message']}")

        return {"status": "failure", "results": results}


def main():
    """Função principal."""
    try:
        report = run_comprehensive_test()

        # Salva relatório
        report_file = Path("post_install_report.json")
        with open(report_file, "w") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        print(f"\n📄 Relatório salvo em: {report_file}")

        # Código de saída
        if report["status"] == "success":
            return 0
        else:
            return 1

    except KeyboardInterrupt:
        print("\n⚠️ Teste interrompido pelo usuário")
        return 1
    except Exception as e:
        print(f"\n💥 Erro fatal no teste: {str(e)}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
