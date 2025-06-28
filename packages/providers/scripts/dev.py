#!/usr/bin/env python3
"""
🔧 Script de Desenvolvimento - Slice/ALIVE Providers Server

Implementa modo desenvolvimento com:
- Hot reload automático
- Logging detalhado
- Validação contínua
- Health checks automáticos
- Integração com IDE

Baseado em: /docs/CONCEPTS.md - Incrementalismo e Validação Contínua
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path
from typing import Optional

# Adiciona o diretório raiz ao Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from server.constants import SERVER_PORT, SERVER_HOST, DEBUG_MODE


class SliceDevelopmentServer:
    """
    Servidor de desenvolvimento enterprise.
    
    Implementa:
    - Incrementalismo: validação antes de iniciar
    - Plug-and-Play: funciona imediatamente após install
    - Isolamento: separa dev de prod
    """
    
    def __init__(self):
        self.process: Optional[subprocess.Popen] = None
        self.start_time = time.time()
        
        # Cores para output
        self.GREEN = '\033[92m'
        self.RED = '\033[91m'
        self.YELLOW = '\033[93m'
        self.BLUE = '\033[94m'
        self.CYAN = '\033[96m'
        self.RESET = '\033[0m'
        self.BOLD = '\033[1m'
    
    def log(self, message: str, level: str = "INFO") -> None:
        """Log formatado para desenvolvimento."""
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
        """Verifica se instalação está completa."""
        self.log("🔍 Verificando instalação...")
        
        try:
            # Verifica se pdm está instalado
            result = subprocess.run(["pdm", "--version"], capture_output=True)
            if result.returncode != 0:
                self.log("PDM não encontrado. Execute 'task install' primeiro.", "ERROR")
                return False
            
            # Verifica arquivos essenciais
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
        """Configura ambiente de desenvolvimento."""
        self.log("⚙️  Configurando ambiente de desenvolvimento...")
        
        # Variáveis de ambiente para desenvolvimento
        os.environ["DEBUG"] = "true"
        os.environ["LOG_LEVEL"] = "DEBUG"
        os.environ["PYTHONPATH"] = str(Path(__file__).parent.parent)
        
        self.log("Variáveis de ambiente configuradas ✓", "SUCCESS")
    
    def start_server(self) -> bool:
        """Inicia servidor FastAPI com uvicorn em modo desenvolvimento."""
        self.log("🚀 Iniciando servidor de desenvolvimento...")
        
        try:
            # Comando uvicorn com hot reload
            cmd = [
                "pdm", "run", "uvicorn",
                "server.main:app",
                "--host", SERVER_HOST,
                "--port", str(SERVER_PORT),
                "--reload",
                "--reload-dir", "server",
                "--log-level", "debug",
                "--access-log",
            ]
            
            self.log(f"Comando: {' '.join(cmd)}", "DEV")
            self.log(f"Servidor será iniciado em: http://{SERVER_HOST}:{SERVER_PORT}", "INFO")
            
            # Inicia processo
            self.process = subprocess.Popen(
                cmd,
                cwd=Path(__file__).parent.parent,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            self.log("Processo iniciado com sucesso ✓", "SUCCESS")
            return True
            
        except Exception as e:
            self.log(f"Erro ao iniciar servidor: {e}", "ERROR")
            return False
    
    def monitor_server(self) -> None:
        """Monitora saída do servidor e fornece feedback."""
        self.log("👀 Monitorando servidor (Ctrl+C para parar)...")
        
        print(f"\n{self.BOLD}{self.CYAN}🔧 MODO DESENVOLVIMENTO ATIVO{self.RESET}")
        print(f"{self.GREEN}📍 URL: http://{SERVER_HOST}:{SERVER_PORT}{self.RESET}")
        print(f"{self.GREEN}📚 Docs: http://{SERVER_HOST}:{SERVER_PORT}/docs{self.RESET}")
        print(f"{self.GREEN}❤️  Health: http://{SERVER_HOST}:{SERVER_PORT}/health{self.RESET}")
        print(f"{self.YELLOW}🔄 Hot reload ativado - mudanças são aplicadas automaticamente{self.RESET}")
        print(f"{self.BLUE}📋 Logs do servidor:{self.RESET}\n")
        
        try:
            if self.process:
                # Monitora saída do processo
                for line in iter(self.process.stdout.readline, ''):
                    if line:
                        # Filtra e formata logs importantes
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
        """Para o servidor graciosamente."""
        if self.process:
            self.log("🛑 Parando servidor...", "WARNING")
            
            try:
                # Tenta parar graciosamente
                self.process.terminate()
                
                # Aguarda até 5 segundos
                try:
                    self.process.wait(timeout=5)
                    self.log("Servidor parado graciosamente ✓", "SUCCESS")
                except subprocess.TimeoutExpired:
                    # Force kill se necessário
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
    
    def show_development_info(self) -> None:
        """Mostra informações úteis para desenvolvimento."""
        print(f"\n{self.BOLD}{self.BLUE}🔧 COMANDOS ÚTEIS DURANTE DESENVOLVIMENTO:{self.RESET}")
        print(f"{self.GREEN}• task test{self.RESET}           # Executa testes em paralelo")
        print(f"{self.GREEN}• task test-unit{self.RESET}      # Apenas testes unitários")
        print(f"{self.GREEN}• task lint{self.RESET}           # Formatação e linting")
        print(f"{self.GREEN}• task health{self.RESET}         # Health check do servidor")
        print(f"{self.GREEN}• task models list{self.RESET}    # Lista modelos disponíveis")
        print(f"{self.GREEN}• task validate{self.RESET}       # Validação completa")
        
        print(f"\n{self.BOLD}{self.CYAN}🛠️  ENDPOINTS PARA TESTE:{self.RESET}")
        print(f"• POST /api/v1/classify    # Classificação de texto")
        print(f"• POST /api/v1/embed       # Geração de embeddings")
        print(f"• POST /api/v1/pos-tag     # POS tagging")
        print(f"• GET  /health             # Status do servidor")
        print(f"• GET  /docs               # Documentação interativa")
        print()
    
    def handle_signal(self, signum, frame) -> None:
        """Manipula sinais do sistema."""
        self.log(f"Sinal recebido: {signum}", "WARNING")
        self.stop_server()
        sys.exit(0)
    
    def run(self) -> None:
        """Executa servidor de desenvolvimento."""
        # Registra manipuladores de sinal
        signal.signal(signal.SIGINT, self.handle_signal)
        signal.signal(signal.SIGTERM, self.handle_signal)
        
        try:
            # Verifica instalação
            if not self.check_installation():
                self.log("Instalação incompleta. Execute 'task install'.", "ERROR")
                sys.exit(1)
            
            # Configura ambiente
            self.setup_development_environment()
            
            # Mostra informações
            self.show_development_info()
            
            # Inicia servidor
            if not self.start_server():
                self.log("Falha ao iniciar servidor.", "ERROR")
                sys.exit(1)
            
            # Monitora servidor
            self.monitor_server()
            
        except Exception as e:
            self.log(f"Erro inesperado: {e}", "ERROR")
            sys.exit(1)
        
        finally:
            self.stop_server()


if __name__ == "__main__":
    dev_server = SliceDevelopmentServer()
    dev_server.run()
