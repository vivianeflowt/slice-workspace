#!/usr/bin/env python3
"""
▶️ Script de Produção - Slice/ALIVE Providers Server

Implementa inicialização enterprise para produção:
- Pré-validações obrigatórias
- Configuração otimizada para produção
- Monitoramento de recursos
- Logging estruturado
- Graceful shutdown

Baseado em: /docs/CONCEPTS.md - Baixo Recurso & Custo Mínimo
"""

import os
import sys
import signal
import time
import subprocess
import psutil
from pathlib import Path
from typing import Optional

# Adiciona o diretório raiz ao Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from server.constants import (
    SERVER_PORT,
    SERVER_HOST,
    CPU_THREADS,
    LOG_LEVEL,
)


class SliceProductionServer:
    """
    Servidor de produção enterprise.
    
    Implementa:
    - Validação antes de iniciar
    - Configuração otimizada para CPU
    - Monitoramento de recursos
    - Shutdown gracioso
    """
    
    def __init__(self):
        self.process: Optional[subprocess.Popen] = None
        self.start_time = time.time()
        self.is_shutting_down = False
        
        # Cores para output
        self.GREEN = '\033[92m'
        self.RED = '\033[91m'
        self.YELLOW = '\033[93m'
        self.BLUE = '\033[94m'
        self.CYAN = '\033[96m'
        self.RESET = '\033[0m'
        self.BOLD = '\033[1m'
    
    def log(self, message: str, level: str = "INFO") -> None:
        """Log estruturado para produção."""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        if level == "ERROR":
            print(f"{self.RED}❌ [{timestamp}] PROD: {message}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ [{timestamp}] PROD: {message}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  [{timestamp}] PROD: {message}{self.RESET}")
        elif level == "PROD":
            print(f"{self.CYAN}🏭 [{timestamp}] PROD: {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] PROD: {message}{self.RESET}")
    
    def check_production_requirements(self) -> bool:
        """
        Verifica requisitos para produção conforme padrão Slice.
        
        Implementa validação de:
        - Recursos do sistema
        - Configurações de produção
        - Dependências críticas
        """
        self.log("🔍 Verificando requisitos para produção...")
        
        try:
            # Verifica recursos do sistema
            cpu_count = psutil.cpu_count()
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            self.log(f"CPU: {cpu_count} núcleos", "INFO")
            self.log(f"RAM: {memory.total // (1024**3)}GB total, {memory.available // (1024**3)}GB disponível", "INFO")
            self.log(f"Disco: {disk.free // (1024**3)}GB livres", "INFO")
            
            # Validações mínimas (conforme CONCEPTS.md)
            if memory.available < 2 * 1024**3:  # Mínimo 2GB livres
                self.log("RAM insuficiente para produção (mínimo: 2GB livres)", "ERROR")
                return False
            
            if disk.free < 5 * 1024**3:  # Mínimo 5GB livres
                self.log("Espaço em disco insuficiente (mínimo: 5GB livres)", "ERROR")
                return False
            
            # Verifica se instalação está completa
            if not self.check_installation():
                return False
            
            # Verifica configurações de produção
            if not self.validate_production_config():
                return False
            
            self.log("Requisitos para produção atendidos ✓", "SUCCESS")
            return True
            
        except Exception as e:
            self.log(f"Erro na verificação de requisitos: {e}", "ERROR")
            return False
    
    def check_installation(self) -> bool:
        """Verifica se instalação está completa."""
        self.log("📦 Verificando instalação...")
        
        try:
            # Verifica arquivos críticos
            critical_files = [
                "server/main.py",
                "server/constants.py",
                "pyproject.toml",
            ]
            
            for file_path in critical_files:
                if not Path(file_path).exists():
                    self.log(f"Arquivo crítico ausente: {file_path}", "ERROR")
                    self.log("Execute 'task install' antes de iniciar produção", "ERROR")
                    return False
            
            # Testa imports críticos
            try:
                import server.main
                import server.constants
                self.log("Imports críticos verificados ✓", "SUCCESS")
            except ImportError as e:
                self.log(f"Erro de import: {e}", "ERROR")
                self.log("Execute 'task install' para corrigir dependências", "ERROR")
                return False
            
            return True
            
        except Exception as e:
            self.log(f"Erro na verificação de instalação: {e}", "ERROR")
            return False
    
    def validate_production_config(self) -> bool:
        """Valida configurações para produção."""
        self.log("⚙️  Validando configurações de produção...")
        
        try:
            # Força configurações de produção
            os.environ["DEBUG"] = "false"
            os.environ["LOG_LEVEL"] = "INFO"
            os.environ["PYTHONPATH"] = str(Path(__file__).parent.parent)
            
            # Configurações de CPU otimizadas
            os.environ["OMP_NUM_THREADS"] = str(CPU_THREADS)
            os.environ["MKL_NUM_THREADS"] = str(CPU_THREADS)
            os.environ["NUMEXPR_NUM_THREADS"] = str(CPU_THREADS)
            
            # Força CPU-only
            os.environ["CUDA_VISIBLE_DEVICES"] = ""
            
            self.log(f"Threads CPU configuradas: {CPU_THREADS}", "INFO")
            self.log("Modo CPU-only forçado ✓", "SUCCESS")
            self.log("Configurações de produção aplicadas ✓", "SUCCESS")
            
            return True
            
        except Exception as e:
            self.log(f"Erro na configuração: {e}", "ERROR")
            return False
    
    def start_production_server(self) -> bool:
        """Inicia servidor em modo produção."""
        self.log("🚀 Iniciando servidor de produção...")
        
        try:
            # Comando otimizado para produção
            cmd = [
                "pdm", "run", "uvicorn",
                "server.main:app",
                "--host", SERVER_HOST,
                "--port", str(SERVER_PORT),
                "--workers", "1",  # Single worker para economizar recursos
                "--log-level", LOG_LEVEL.lower(),
                "--no-access-log",  # Reduz overhead de logging
                "--loop", "uvloop",  # Loop otimizado
                "--http", "httptools",  # Parser HTTP otimizado
            ]
            
            self.log(f"Comando: {' '.join(cmd)}", "PROD")
            
            # Inicia processo
            self.process = subprocess.Popen(
                cmd,
                cwd=Path(__file__).parent.parent,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # Aguarda inicialização
            time.sleep(2)
            
            if self.process.poll() is None:
                self.log("Servidor iniciado com sucesso ✓", "SUCCESS")
                return True
            else:
                self.log("Falha ao iniciar servidor", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Erro ao iniciar servidor: {e}", "ERROR")
            return False
    
    def monitor_production_server(self) -> None:
        """Monitora servidor em produção."""
        self.log("👀 Monitorando servidor de produção...")
        
        print(f"\n{self.BOLD}{self.GREEN}🏭 SLICE PROVIDERS - PRODUÇÃO ATIVA{self.RESET}")
        print(f"{self.CYAN}📍 URL: http://{SERVER_HOST}:{SERVER_PORT}{self.RESET}")
        print(f"{self.CYAN}❤️  Health: http://{SERVER_HOST}:{SERVER_PORT}/health{self.RESET}")
        print(f"{self.CYAN}📚 Docs: http://{SERVER_HOST}:{SERVER_PORT}/docs{self.RESET}")
        print(f"{self.YELLOW}⚡ Modo otimizado para CPU{self.RESET}")
        print(f"{self.BLUE}📋 Logs filtrados (apenas importantes):{self.RESET}\n")
        
        last_resource_check = time.time()
        
        try:
            if self.process:
                for line in iter(self.process.stdout.readline, ''):
                    if line and not self.is_shutting_down:
                        line = line.strip()
                        
                        # Filtra apenas logs importantes em produção
                        if any(keyword in line.lower() for keyword in [
                            "error", "critical", "warning", "started", "shutdown"
                        ]):
                            if "error" in line.lower() or "critical" in line.lower():
                                print(f"{self.RED}🔥 {line}{self.RESET}")
                            elif "warning" in line.lower():
                                print(f"{self.YELLOW}⚠️  {line}{self.RESET}")
                            else:
                                print(f"{self.GREEN}✅ {line}{self.RESET}")
                        
                        # Monitoramento de recursos (a cada 5 minutos)
                        if time.time() - last_resource_check > 300:
                            self.check_resources()
                            last_resource_check = time.time()
                
        except KeyboardInterrupt:
            self.log("Sinal de interrupção recebido", "WARNING")
        except Exception as e:
            self.log(f"Erro no monitoramento: {e}", "ERROR")
    
    def check_resources(self) -> None:
        """Verifica recursos do sistema periodicamente."""
        try:
            memory = psutil.virtual_memory()
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Alerta se recursos baixos
            if memory.percent > 90:
                self.log(f"⚠️  Uso de RAM alto: {memory.percent:.1f}%", "WARNING")
            
            if cpu_percent > 80:
                self.log(f"⚠️  Uso de CPU alto: {cpu_percent:.1f}%", "WARNING")
            
            # Log normal se tudo OK
            if memory.percent < 80 and cpu_percent < 60:
                self.log(f"Recursos OK - RAM: {memory.percent:.1f}%, CPU: {cpu_percent:.1f}%", "INFO")
                
        except Exception as e:
            self.log(f"Erro no monitoramento de recursos: {e}", "WARNING")
    
    def shutdown_server(self) -> None:
        """Para servidor graciosamente."""
        if self.is_shutting_down:
            return
        
        self.is_shutting_down = True
        self.log("🛑 Iniciando shutdown gracioso...", "WARNING")
        
        if self.process:
            try:
                # Sinal TERM primeiro (gracioso)
                self.process.terminate()
                self.log("Sinal TERM enviado", "INFO")
                
                # Aguarda até 10 segundos
                try:
                    self.process.wait(timeout=10)
                    self.log("Servidor parado graciosamente ✓", "SUCCESS")
                except subprocess.TimeoutExpired:
                    # Force kill se necessário
                    self.log("Timeout - forçando parada...", "WARNING")
                    self.process.kill()
                    self.process.wait()
                    self.log("Servidor forçadamente parado ✓", "SUCCESS")
                    
            except Exception as e:
                self.log(f"Erro no shutdown: {e}", "ERROR")
            
            finally:
                self.process = None
        
        elapsed = time.time() - self.start_time
        self.log(f"Servidor executou por {elapsed:.1f}s", "INFO")
        self.log("Shutdown completo ✓", "SUCCESS")
    
    def handle_signal(self, signum, frame) -> None:
        """Manipula sinais do sistema para shutdown gracioso."""
        signal_names = {
            signal.SIGINT: "SIGINT",
            signal.SIGTERM: "SIGTERM",
        }
        
        signal_name = signal_names.get(signum, f"Signal {signum}")
        self.log(f"Sinal recebido: {signal_name}", "WARNING")
        
        self.shutdown_server()
        sys.exit(0)
    
    def run(self) -> None:
        """Executa servidor de produção."""
        # Registra manipuladores de sinal
        signal.signal(signal.SIGINT, self.handle_signal)
        signal.signal(signal.SIGTERM, self.handle_signal)
        
        try:
            # Verificações pré-produção
            if not self.check_production_requirements():
                self.log("Falha nas verificações de produção", "ERROR")
                sys.exit(1)
            
            # Inicia servidor
            if not self.start_production_server():
                self.log("Falha ao iniciar servidor de produção", "ERROR")
                sys.exit(1)
            
            # Monitora servidor
            self.monitor_production_server()
            
        except Exception as e:
            self.log(f"Erro crítico: {e}", "ERROR")
            sys.exit(1)
        
        finally:
            if not self.is_shutting_down:
                self.shutdown_server()


if __name__ == "__main__":
    server = SliceProductionServer()
    server.run()
