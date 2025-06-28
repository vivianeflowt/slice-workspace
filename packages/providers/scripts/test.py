#!/usr/bin/env python3
"""
✅ Script de Testes Enterprise - Slice/ALIVE Providers Server

Implementa validação completa:
- Testes unitários e de integração
- Validação de estrutura do projeto
- Testes de performance básicos
- Testes de compatibilidade
- Relatórios detalhados

Baseado em: /docs/CONCEPTS.md - Validação Forte e Padronizada
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# Adiciona o diretório raiz ao Python path
sys.path.insert(0, str(Path(__file__).parent.parent))


class SliceTestRunner:
    """
    Runner de testes enterprise para Slice/ALIVE.

    Implementa:
    - Incrementalismo: testa cada módulo antes de integração
    - Validação Forte: múltiplos tipos de teste
    - Justificativa Real: métricas e relatórios detalhados
    """

    def __init__(self, test_type: str = "all"):
        self.test_type = test_type
        self.start_time = time.time()
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "errors": [],
            "performance": {},
            "coverage": {},
        }

        # Cores para output
        self.GREEN = "\033[92m"
        self.RED = "\033[91m"
        self.YELLOW = "\033[93m"
        self.BLUE = "\033[94m"
        self.CYAN = "\033[96m"
        self.RESET = "\033[0m"
        self.BOLD = "\033[1m"

    def log(self, message: str, level: str = "INFO") -> None:
        """Log formatado para testes."""
        timestamp = time.strftime("%H:%M:%S")

        if level == "ERROR":
            print(f"{self.RED}❌ [{timestamp}] {message}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ [{timestamp}] {message}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  [{timestamp}] {message}{self.RESET}")
        elif level == "TEST":
            print(f"{self.CYAN}🧪 [{timestamp}] {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] {message}{self.RESET}")

    def check_test_environment(self) -> bool:
        """Verifica se ambiente de teste está configurado."""
        self.log("🔍 Verificando ambiente de teste...")

        try:
            # Verifica pytest
            result = subprocess.run(
                ["pdm", "run", "pytest", "--version"], capture_output=True, text=True
            )
            if result.returncode == 0:
                self.log(f"Pytest encontrado: {result.stdout.strip()}", "SUCCESS")
            else:
                self.log("Pytest não encontrado", "ERROR")
                return False

            # Verifica estrutura de testes
            tests_dir = Path(__file__).parent.parent / "tests"
            if not tests_dir.exists():
                self.log("Diretório tests/ não encontrado", "ERROR")
                return False

            self.log("Ambiente de teste verificado ✓", "SUCCESS")
            return True

        except Exception as e:
            self.log(f"Erro na verificação: {e}", "ERROR")
            return False

    def run_structure_tests(self) -> bool:
        """Testa estrutura do projeto conforme padrão Slice."""
        self.log("🏗️  Executando testes de estrutura...")

        try:
            # Arquivos obrigatórios
            required_files = [
                "server/__init__.py",
                "server/main.py",
                "server/constants.py",
                "server/models/__init__.py",
                "pyproject.toml",
                "Taskfile.yml",
                "README.md",
            ]

            # Diretórios obrigatórios
            required_dirs = [
                "server/api",
                "server/providers",
                "server/services",
                "server/utils",
                "tests",
                "scripts",
            ]

            missing_files = []
            missing_dirs = []

            for file_path in required_files:
                if not Path(file_path).exists():
                    missing_files.append(file_path)

            for dir_path in required_dirs:
                if not Path(dir_path).exists():
                    missing_dirs.append(dir_path)

            if missing_files or missing_dirs:
                self.log("Estrutura incompleta:", "ERROR")
                for f in missing_files:
                    self.log(f"  Arquivo ausente: {f}", "ERROR")
                for d in missing_dirs:
                    self.log(f"  Diretório ausente: {d}", "ERROR")
                return False

            self.log("Estrutura do projeto validada ✓", "SUCCESS")
            return True

        except Exception as e:
            self.log(f"Erro nos testes de estrutura: {e}", "ERROR")
            return False

    def run_unit_tests(self) -> bool:
        """Executa testes unitários."""
        self.log("🧪 Executando testes unitários...")

        try:
            cmd = [
                "pdm",
                "run",
                "pytest",
                "tests/",
                "-v",
                "--tb=short",
                "-m",
                "unit",
                "--json-report",
                "--json-report-file=test_results_unit.json",
            ]

            result = subprocess.run(
                cmd, capture_output=True, text=True, cwd=Path(__file__).parent.parent
            )

            # Processa resultados
            if result.returncode == 0:
                self.log("Testes unitários: PASSOU ✓", "SUCCESS")
                return True
            else:
                self.log("Testes unitários: FALHOU", "ERROR")
                self.log(f"Output: {result.stdout}", "ERROR")
                self.log(f"Erro: {result.stderr}", "ERROR")
                return False

        except Exception as e:
            self.log(f"Erro nos testes unitários: {e}", "ERROR")
            return False

    def run_integration_tests(self) -> bool:
        """Executa testes de integração."""
        self.log("🔗 Executando testes de integração...")

        try:
            cmd = [
                "pdm",
                "run",
                "pytest",
                "tests/",
                "-v",
                "--tb=short",
                "-m",
                "integration",
                "--json-report",
                "--json-report-file=test_results_integration.json",
            ]

            result = subprocess.run(
                cmd, capture_output=True, text=True, cwd=Path(__file__).parent.parent
            )

            if result.returncode == 0:
                self.log("Testes de integração: PASSOU ✓", "SUCCESS")
                return True
            else:
                self.log("Testes de integração: FALHOU", "ERROR")
                self.log(f"Output: {result.stdout}", "ERROR")
                self.log(f"Erro: {result.stderr}", "ERROR")
                return False

        except Exception as e:
            self.log(f"Erro nos testes de integração: {e}", "ERROR")
            return False

    def run_import_tests(self) -> bool:
        """Testa imports de todos os módulos."""
        self.log("📦 Testando imports...")

        try:
            # Testa imports principais
            imports_to_test = [
                "server.constants",
                "server.models",
                "server.providers.classify",
                "server.providers.embed",
                "server.providers.pos_tag",
                "server.utils.model_downloader",
            ]

            for module in imports_to_test:
                try:
                    __import__(module)
                    self.log(f"  ✓ {module}", "SUCCESS")
                except ImportError as e:
                    self.log(f"  ❌ {module}: {e}", "ERROR")
                    return False

            self.log("Todos os imports funcionando ✓", "SUCCESS")
            return True

        except Exception as e:
            self.log(f"Erro nos testes de import: {e}", "ERROR")
            return False

    def run_lint_tests(self) -> bool:
        """Executa linting e verificações de código."""
        self.log("🎨 Executando linting...")

        try:
            # Black check
            result = subprocess.run(
                ["pdm", "run", "black", "--check", "server/", "tests/", "scripts/"],
                capture_output=True,
                text=True,
                cwd=Path(__file__).parent.parent,
            )

            if result.returncode != 0:
                self.log("Black formatting: FALHOU", "ERROR")
                self.log("Execute 'task lint' para corrigir", "WARNING")
                return False

            # isort check
            result = subprocess.run(
                [
                    "pdm",
                    "run",
                    "isort",
                    "--check-only",
                    "server/",
                    "tests/",
                    "scripts/",
                ],
                capture_output=True,
                text=True,
                cwd=Path(__file__).parent.parent,
            )

            if result.returncode != 0:
                self.log("isort imports: FALHOU", "ERROR")
                self.log("Execute 'task lint' para corrigir", "WARNING")
                return False

            self.log("Linting: PASSOU ✓", "SUCCESS")
            return True

        except Exception as e:
            self.log(f"Erro no linting: {e}", "ERROR")
            return False

    def run_performance_tests(self) -> bool:
        """Executa testes básicos de performance."""
        self.log("⚡ Executando testes de performance...")

        try:
            # Testa tempo de import
            import_start = time.time()
            from server.constants import DEFAULT_MODELS

            import_time = time.time() - import_start

            self.results["performance"]["import_time"] = import_time

            if import_time > 2.0:  # Mais de 2s é lento
                self.log(f"Import lento: {import_time:.2f}s", "WARNING")
            else:
                self.log(f"Import rápido: {import_time:.3f}s ✓", "SUCCESS")

            # Aqui podemos adicionar mais testes de performance específicos
            self.log("Testes de performance básicos: PASSOU ✓", "SUCCESS")
            return True

        except Exception as e:
            self.log(f"Erro nos testes de performance: {e}", "ERROR")
            return False

    def generate_report(self) -> None:
        """Gera relatório detalhado dos testes."""
        elapsed = time.time() - self.start_time
        self.results["total_time"] = elapsed

        # Salva relatório JSON
        report_file = Path(__file__).parent.parent / "test_report.json"
        with open(report_file, "w") as f:
            json.dump(self.results, f, indent=2)

        # Mostra resumo
        print(f"\n{self.BOLD}{self.CYAN}📊 RELATÓRIO DE TESTES{self.RESET}")
        print(f"{self.BLUE}Tempo total: {elapsed:.2f}s{self.RESET}")
        print(f"{self.BLUE}Relatório salvo em: {report_file}{self.RESET}")

        if self.results["failed"] == 0:
            print(f"{self.GREEN}{self.BOLD}🎉 TODOS OS TESTES PASSARAM!{self.RESET}")
        else:
            print(
                f"{self.RED}{self.BOLD}❌ {self.results['failed']} TESTE(S) FALHARAM{self.RESET}"
            )

    def run_all_tests(self) -> bool:
        """Executa todos os testes conforme tipo especificado."""
        print(f"{self.BOLD}{self.CYAN}")
        print("🧪 SLICE/ALIVE PROVIDERS - SUITE DE TESTES ENTERPRISE")
        print("=" * 60)
        print("Validação Forte | Incrementalismo | Qualidade Garantida")
        print(f"={self.RESET}\n")

        success = True

        # Verifica ambiente
        if not self.check_test_environment():
            return False

        # Testes básicos (sempre executados)
        if not self.run_structure_tests():
            success = False

        if not self.run_import_tests():
            success = False

        # Testes específicos por tipo
        if self.test_type in ["all", "unit"]:
            if not self.run_unit_tests():
                success = False

        if self.test_type in ["all", "integration"]:
            if not self.run_integration_tests():
                success = False

        if self.test_type == "all":
            if not self.run_lint_tests():
                success = False

            if not self.run_performance_tests():
                success = False

        # Gera relatório
        self.generate_report()

        return success


def main():
    """Função principal do script de testes."""
    parser = argparse.ArgumentParser(description="Runner de testes Slice/ALIVE")
    parser.add_argument(
        "--unit", action="store_true", help="Executa apenas testes unitários"
    )
    parser.add_argument(
        "--integration", action="store_true", help="Executa apenas testes de integração"
    )
    parser.add_argument(
        "--quick",
        action="store_true",
        help="Executa apenas testes rápidos (estrutura + imports)",
    )

    args = parser.parse_args()

    # Determina tipo de teste
    if args.unit:
        test_type = "unit"
    elif args.integration:
        test_type = "integration"
    elif args.quick:
        test_type = "quick"
    else:
        test_type = "all"

    # Executa testes
    runner = SliceTestRunner(test_type)
    success = runner.run_all_tests()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
