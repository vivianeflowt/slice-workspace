#!/usr/bin/env python3
"""
🏭 Script de Instalação Enterprise - Command-R

Implementa padrão CLP Industrial: "liga e funciona"
- Plug-and-Play Total
- Validação em cada etapa
- Informações claras de status
- Interrupção em caso de falha
- Restauração rápida se necessário

Inspirado em providers/scripts/install.py
"""

import os
import sys
import subprocess
import time
from pathlib import Path

# Ajuste dinâmico do sys.path para garantir importação correta
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from server.constants import MODELS_DIR, CACHE_DIR, LOGS_DIR
except ImportError:
    MODELS_DIR = "models"
    CACHE_DIR = "cache"
    LOGS_DIR = "logs"

class CommandRInstaller:
    def __init__(self):
        self.start_time = time.time()
        self.steps_completed = []
        self.errors = []
        self.GREEN = "\033[92m"
        self.RED = "\033[91m"
        self.YELLOW = "\033[93m"
        self.BLUE = "\033[94m"
        self.CYAN = "\033[96m"
        self.RESET = "\033[0m"
        self.BOLD = "\033[1m"

    def log(self, message, level="INFO"):
        timestamp = time.strftime("%H:%M:%S")
        if level == "ERROR":
            print(f"{self.RED}❌ [{timestamp}] {message}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ [{timestamp}] {message}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  [{timestamp}] {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] {message}{self.RESET}")

    def install_dependencies(self):
        self.log("🐍 Instalando dependências com PDM...")
        try:
            result = subprocess.run(["pdm", "install"], capture_output=True, text=True)
            if result.returncode == 0:
                self.log("Dependências instaladas com sucesso ✓", "SUCCESS")
                self.steps_completed.append("dependencies")
                return True
            else:
                self.log(f"Erro na instalação: {result.stderr}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Erro inesperado: {e}", "ERROR")
            return False

    def download_models(self):
        self.log("⬇️  Baixando modelos necessários...")
        try:
            result = subprocess.run([sys.executable, "scripts/download_models.py"], capture_output=True, text=True)
            if result.returncode == 0:
                self.log("Modelos baixados/configurados ✓", "SUCCESS")
                self.steps_completed.append("models")
                return True
            else:
                self.log(f"Erro ao baixar modelos: {result.stderr}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Erro inesperado: {e}", "ERROR")
            return False

    def validate_installation(self):
        self.log("🔍 Validando instalação...")
        try:
            # Testa imports principais
            import server.constants
            self.log("✓ Imports principais OK", "SUCCESS")
            # Testa diretórios
            for d in [MODELS_DIR, CACHE_DIR, LOGS_DIR]:
                Path(d).mkdir(parents=True, exist_ok=True)
                self.log(f"✓ Diretório OK: {d}", "SUCCESS")
            self.steps_completed.append("validation")
            return True
        except Exception as e:
            self.log(f"Erro na validação: {e}", "ERROR")
            return False

    def show_success_summary(self):
        elapsed = time.time() - self.start_time
        print(f"\n{self.GREEN}{self.BOLD}🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!{self.RESET}")
        print(f"{self.CYAN}⏱️  Tempo total: {elapsed:.1f}s{self.RESET}")
        print(f"{self.BLUE}📦 Etapas completadas: {len(self.steps_completed)}{self.RESET}")
        print(f"\n{self.BOLD}🚀 PRÓXIMOS PASSOS:{self.RESET}")
        print(f"{self.GREEN}1. task dev{self.RESET}     # Inicia servidor em desenvolvimento")
        print(f"{self.GREEN}2. task test{self.RESET}    # Executa testes automatizados")
        print(f"{self.GREEN}3. task lint{self.RESET}    # Linting e formatação")
        print(f"{self.GREEN}4. task clean{self.RESET}   # Limpeza de temporários")
        print(f"\n{self.CYAN}✨ Command-R pronto para uso! ✨{self.RESET}\n")

    def handle_failure(self, step, error):
        self.errors.append(f"{step}: {error}")
        print(f"\n{self.RED}{self.BOLD}❌ FALHA NA INSTALAÇÃO{self.RESET}")
        print(f"{self.RED}Etapa: {step}{self.RESET}")
        print(f"{self.RED}Erro: {error}{self.RESET}")
        sys.exit(1)

    def run(self):
        print(f"{self.BOLD}{self.CYAN}")
        print("🏭 COMMAND-R - INSTALAÇÃO ENTERPRISE")
        print("=" * 60)
        print("Padrão CLP Industrial: Liga e Funciona")
        print("Plug-and-Play Total | Validação Contínua | Baixo Recurso")
        print(f"={self.RESET}\n")
        if not self.install_dependencies():
            self.handle_failure("dependencies", "Falha na instalação de dependências")
        if not self.download_models():
            self.handle_failure("models", "Falha no download de modelos")
        if not self.validate_installation():
            self.handle_failure("validation", "Falha na validação da instalação")
        self.show_success_summary()

if __name__ == "__main__":
    installer = CommandRInstaller()
    installer.run()
