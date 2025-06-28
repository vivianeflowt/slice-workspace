#!/usr/bin/env python3
"""
🔧 Script de Desenvolvimento - Command-R

Implementa modo desenvolvimento com:
- Hot reload automático
- Logging detalhado
- Validação contínua
- Health checks automáticos
- Integração com IDE

Baseado em providers/scripts/dev.py
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path
from typing import Optional

# Ajuste dinâmico do sys.path para garantir importação correta
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from server.constants import SERVER_PORT, SERVER_HOST
except ImportError:
    SERVER_PORT = 11543
    SERVER_HOST = "0.0.0.0"

class CommandRDevServer:
    def __init__(self):
        self.process: Optional[subprocess.Popen] = None
        self.start_time = time.time()
        self.GREEN = "\033[92m"
        self.RED = "\033[91m"
        self.YELLOW = "\033[93m"
        self.BLUE = "\033[94m"
        self.CYAN = "\033[96m"
        self.RESET = "\033[0m"
        self.BOLD = "\033[1m"

    def log(self, message: str, level: str = "INFO") -> None:
        timestamp = time.strftime("%H:%M:%S")
        if level == "ERROR":
            print(f"{self.RED}❌ [{timestamp}] {message}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ [{timestamp}] {message}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  [{timestamp}] {message}{self.RESET}")
        elif level == "DEV":
            print(f"{self.CYAN}🔧 [{timestamp}] {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] {message}{self.RESET}")

    def check_installation(self) -> bool:
        self.log("🔍 Verificando instalação...")
        try:
            result = subprocess.run(["pdm", "--version"], capture_output=True)
            if result.returncode != 0:
                self.log("PDM não encontrado. Execute 'task install' primeiro.", "ERROR")
                return False
            essential_files = [
                "server/__init__.py",
                "server/main.py",
                "server/constants.py",
                "pyproject.toml",
            ]
            for file_path in essential_files:
                if not Path(file_path).exists():
                    self.log(f"Arquivo essencial não encontrado: {file_path}", "ERROR")
                    self.log("Execute 'task install' primeiro.", "ERROR")
                    return False
            self.log("Instalação verificada ✓", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Erro na verificação: {e}", "ERROR")
            return False

    def setup_development_environment(self) -> None:
        self.log("⚙️  Configurando ambiente de desenvolvimento...")
        os.environ["DEBUG"] = "true"
        os.environ["LOG_LEVEL"] = "DEBUG"
        os.environ["PYTHONPATH"] = str(ROOT_DIR)
        self.log("Variáveis de ambiente configuradas ✓", "SUCCESS")

    def start_server(self) -> bool:
        self.log("🚀 Iniciando servidor de desenvolvimento...")
        try:
            cmd = [
                "pdm",
                "run",
                "uvicorn",
                "server.main:app",
                "--host",
                SERVER_HOST,
                "--port",
                str(SERVER_PORT),
                "--reload",
                "--reload-dir",
                "server",
                "--log-level",
                "debug",
                "--access-log",
            ]
            self.log(f"Comando: {' '.join(cmd)}", "DEV")
            self.log(f"Servidor será iniciado em: http://{SERVER_HOST}:{SERVER_PORT}", "INFO")
            self.process = subprocess.Popen(
                cmd,
                cwd=ROOT_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1,
            )
            self.log("Processo iniciado com sucesso ✓", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Erro ao iniciar servidor: {e}", "ERROR")
            return False

    def monitor_server(self) -> None:
        self.log("👀 Monitorando servidor (Ctrl+C para parar)...")
        print(f"\n{self.BOLD}{self.CYAN}🔧 MODO DESENVOLVIMENTO ATIVO{self.RESET}")
        print(f"{self.GREEN}📍 URL: http://{SERVER_HOST}:{SERVER_PORT}{self.RESET}")
        print(f"{self.GREEN}📚 Docs: http://{SERVER_HOST}:{SERVER_PORT}/docs{self.RESET}")
        print(f"{self.GREEN}❤️  Health: http://{SERVER_HOST}:{SERVER_PORT}/health{self.RESET}")
        print(f"{self.YELLOW}🔄 Hot reload ativado - mudanças são aplicadas automaticamente{self.RESET}")
        print(f"{self.BLUE}📋 Logs do servidor:{self.RESET}\n")
        try:
            if self.process:
                for line in iter(self.process.stdout.readline, ""):
                    if line:
                        line = line.strip()
                        if "started server process" in line.lower():
                            self.log("Servidor iniciado com sucesso!", "SUCCESS")
                        elif "application startup complete" in line.lower():
                            self.log("Aplicação pronta para receber requests!", "SUCCESS")
                        elif "error" in line.lower():
                            print(f"{self.RED}🔥 {line}{self.RESET}")
                        elif "warning" in line.lower():
                            print(f"{self.YELLOW}⚠️  {line}{self.RESET}")
                        elif any(keyword in line.lower() for keyword in ["info", "debug", "post", "get", "put", "delete"]):
                            print(f"{self.BLUE}📡 {line}{self.RESET}")
                        else:
                            print(line)
        except KeyboardInterrupt:
            self.log("Interrupção detectada. Parando servidor...", "WARNING")
        except Exception as e:
            self.log(f"Erro no monitoramento: {e}", "ERROR")

    def stop_server(self) -> None:
        if self.process:
            self.log("🛑 Parando servidor...", "WARNING")
            try:
                self.process.terminate()
                try:
                    self.process.wait(timeout=5)
                    self.log("Servidor parado graciosamente ✓", "SUCCESS")
                except subprocess.TimeoutExpired:
                    self.log("Forçando parada do servidor...", "WARNING")
                    self.process.kill()
                    self.process.wait()
                    self.log("Servidor forçadamente parado ✓", "SUCCESS")
            except Exception as e:
                self.log(f"Erro ao parar servidor: {e}", "ERROR")
            finally:
                self.process = None
        elapsed = time.time() - self.start_time
        self.log(f"Sessão de desenvolvimento finalizada. Duração: {elapsed:.1f}s", "INFO")

    def handle_signal(self, signum, frame) -> None:
        self.log(f"Sinal recebido: {signum}", "WARNING")
        self.stop_server()
        sys.exit(0)

    def run(self) -> None:
        signal.signal(signal.SIGINT, self.handle_signal)
        signal.signal(signal.SIGTERM, self.handle_signal)
        try:
            if not self.check_installation():
                self.log("Instalação incompleta. Execute 'task install'.", "ERROR")
                sys.exit(1)
            self.setup_development_environment()
            if not self.start_server():
                self.log("Falha ao iniciar servidor.", "ERROR")
                sys.exit(1)
            self.monitor_server()
        except Exception as e:
            self.log(f"Erro inesperado: {e}", "ERROR")
            sys.exit(1)
        finally:
            self.stop_server()

if __name__ == "__main__":
    dev_server = CommandRDevServer()
    dev_server.run()
