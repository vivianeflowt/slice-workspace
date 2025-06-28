#!/usr/bin/env python3
"""
🎨 Script de Linting - Slice/ALIVE Providers Server

Implementa formatação e linting automático:
- Black formatting
- isort imports
- flake8 linting
- mypy type checking (opcional)
- Correção automática quando possível

Baseado em: /docs/CONCEPTS.md - Validação Forte e Padronizada
"""

import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List


class SliceLinter:
    """
    Linter enterprise para Slice/ALIVE.

    Implementa padrões de qualidade de código:
    - Formatação consistente
    - Imports organizados
    - Linting com regras relaxadas mas objetivas
    """

    def __init__(self, auto_fix: bool = True):
        self.auto_fix = auto_fix
        self.start_time = time.time()
        self.results = []

        # Cores
        self.GREEN = "\033[92m"
        self.RED = "\033[91m"
        self.YELLOW = "\033[93m"
        self.BLUE = "\033[94m"
        self.CYAN = "\033[96m"
        self.RESET = "\033[0m"
        self.BOLD = "\033[1m"

    def log(self, message: str, level: str = "INFO") -> None:
        """Log formatado."""
        timestamp = time.strftime("%H:%M:%S")

        if level == "ERROR":
            print(f"{self.RED}❌ [{timestamp}] {message}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ [{timestamp}] {message}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  [{timestamp}] {message}{self.RESET}")
        elif level == "LINT":
            print(f"{self.CYAN}🎨 [{timestamp}] {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] {message}{self.RESET}")

    def run_black_formatting(self) -> bool:
        """Executa formatação Black."""
        self.log("Executando Black formatting...", "LINT")

        try:
            cmd = ["pdm", "run", "black"]
            if not self.auto_fix:
                cmd.append("--check")

            cmd.extend(["server/", "scripts/", "tests/"])

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                if self.auto_fix:
                    self.log("Black: Arquivos formatados ✓", "SUCCESS")
                else:
                    self.log("Black: Formatação OK ✓", "SUCCESS")
                return True
            else:
                if self.auto_fix:
                    self.log("Black: Erro na formatação", "ERROR")
                else:
                    self.log("Black: Arquivos precisam de formatação", "WARNING")
                    self.log("Execute 'task lint' para corrigir", "INFO")
                return False

        except Exception as e:
            self.log(f"Erro no Black: {e}", "ERROR")
            return False

    def run_isort_imports(self) -> bool:
        """Organiza imports com isort."""
        self.log("Organizando imports com isort...", "LINT")

        try:
            cmd = ["pdm", "run", "isort"]
            if not self.auto_fix:
                cmd.extend(["--check-only", "--diff"])

            cmd.extend(["server/", "scripts/", "tests/"])

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                if self.auto_fix:
                    self.log("isort: Imports organizados ✓", "SUCCESS")
                else:
                    self.log("isort: Imports OK ✓", "SUCCESS")
                return True
            else:
                if self.auto_fix:
                    self.log("isort: Erro na organização", "ERROR")
                else:
                    self.log("isort: Imports precisam de organização", "WARNING")
                    self.log("Execute 'task lint' para corrigir", "INFO")
                return False

        except Exception as e:
            self.log(f"Erro no isort: {e}", "ERROR")
            return False

    def run_flake8_linting(self) -> bool:
        """Executa linting com flake8."""
        self.log("Executando flake8 linting...", "LINT")

        try:
            cmd = [
                "pdm",
                "run",
                "flake8",
                "server/",
                "scripts/",
                "tests/",
                "--max-line-length=88",
                "--extend-ignore=E203,W503,E501",  # Compatível com Black
                "--max-complexity=10",
                "--statistics",
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                self.log("flake8: Nenhum problema encontrado ✓", "SUCCESS")
                return True
            else:
                self.log("flake8: Problemas encontrados", "WARNING")
                # Mostra apenas primeiros problemas
                lines = result.stdout.split("\n")[:10]
                for line in lines:
                    if line.strip():
                        self.log(f"  {line}", "WARNING")

                if len(result.stdout.split("\n")) > 10:
                    self.log("  ... (mais problemas encontrados)", "WARNING")

                return False

        except Exception as e:
            self.log(f"Erro no flake8: {e}", "ERROR")
            return False

    def run_mypy_typing(self) -> bool:
        """Executa verificação de tipos com mypy (opcional)."""
        self.log("Verificando tipos com mypy...", "LINT")

        try:
            cmd = [
                "pdm",
                "run",
                "mypy",
                "server/",
                "--ignore-missing-imports",
                "--no-strict-optional",
                "--show-error-codes",
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                self.log("mypy: Tipos OK ✓", "SUCCESS")
                return True
            else:
                self.log("mypy: Problemas de tipagem encontrados", "WARNING")
                # Mypy não é obrigatório, então só avisa
                return True

        except FileNotFoundError:
            self.log("mypy: Não instalado (opcional)", "INFO")
            return True
        except Exception as e:
            self.log(f"Erro no mypy: {e}", "WARNING")
            return True  # Não falha o linting

    def show_summary(self) -> None:
        """Mostra resumo do linting."""
        elapsed = time.time() - self.start_time

        passed = sum(1 for result in self.results if result)
        total = len(self.results)

        print(f"\n{self.BOLD}{self.CYAN}🎨 RESUMO DO LINTING{self.RESET}")
        print(f"{self.BLUE}Tempo: {elapsed:.2f}s{self.RESET}")
        print(f"{self.BLUE}Verificações: {passed}/{total} passaram{self.RESET}")

        if passed == total:
            print(f"{self.GREEN}{self.BOLD}✨ CÓDIGO EM PERFEITO ESTADO!{self.RESET}")
        else:
            print(f"{self.YELLOW}⚠️  Algumas verificações falharam{self.RESET}")
            if self.auto_fix:
                print(
                    f"{self.BLUE}💡 Problemas corrigíveis foram arrumados automaticamente{self.RESET}"
                )
            else:
                print(
                    f"{self.BLUE}💡 Execute sem --check para corrigir automaticamente{self.RESET}"
                )

    def run(self, check_only: bool = False) -> bool:
        """Executa linting completo."""
        if check_only:
            self.auto_fix = False

        print(f"{self.BOLD}{self.CYAN}")
        print("🎨 SLICE/ALIVE PROVIDERS - LINTING ENTERPRISE")
        print("=" * 60)
        print(f"Modo: {'CHECK ONLY' if check_only else 'AUTO-FIX'}")
        print(f"={self.RESET}\n")

        # Executa ferramentas de linting
        linting_tools = [
            ("Black Formatting", self.run_black_formatting),
            ("isort Imports", self.run_isort_imports),
            ("flake8 Linting", self.run_flake8_linting),
            ("mypy Typing", self.run_mypy_typing),
        ]

        for name, tool_func in linting_tools:
            try:
                result = tool_func()
                self.results.append(result)
            except Exception as e:
                self.log(f"Erro em {name}: {e}", "ERROR")
                self.results.append(False)

        # Mostra resumo
        self.show_summary()

        # Retorna True se pelo menos 75% passou
        passed = sum(1 for result in self.results if result)
        return (passed / len(self.results)) >= 0.75


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Linting enterprise Slice/ALIVE")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Apenas verifica, não corrige automaticamente",
    )

    args = parser.parse_args()

    linter = SliceLinter()
    success = linter.run(check_only=args.check)

    sys.exit(0 if success else 1)
