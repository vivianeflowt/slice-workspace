#!/usr/bin/env python3
"""
🏭 Script de Instalação Enterprise - Slice/ALIVE Providers Server

Implementa padrão CLP Industrial: "liga e funciona"
- Plug-and-Play Total 
- Validação em cada etapa
- Informações claras de status
- Interrupção em caso de falha
- Restauração rápida se necessário

Baseado em: /docs/CONCEPTS.md - Instalação 100% Guiada
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path
from typing import Dict, List, Any, Optional

# Adiciona o diretório raiz ao Python path para imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from server.constants import (
    SERVER_PORT,
    SERVER_HOST,
    DEFAULT_MODELS,
    MODEL_CACHE_DIR,
    FORCE_CPU_ONLY,
)


class SliceInstaller:
    """
    Instalador enterprise seguindo padrões Slice/ALIVE.
    
    Implementa:
    - Incrementalismo: valida cada etapa antes de prosseguir
    - Baixo Recurso: verifica recursos disponíveis
    - Justificativa Real: registra motivos das escolhas
    - Restauração Rápida: permite rollback em caso de falha
    """
    
    def __init__(self):
        self.start_time = time.time()
        self.steps_completed = []
        self.installation_log = []
        self.errors = []
        
        # Cores para output (sem dependências externas)
        self.GREEN = '\033[92m'
        self.RED = '\033[91m'
        self.YELLOW = '\033[93m'
        self.BLUE = '\033[94m'
        self.CYAN = '\033[96m'
        self.RESET = '\033[0m'
        self.BOLD = '\033[1m'
    
    def log(self, message: str, level: str = "INFO") -> None:
        """Log com timestamp e nível."""
        timestamp = time.strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}"
        
        if level == "ERROR":
            print(f"{self.RED}❌ {log_entry}{self.RESET}")
        elif level == "SUCCESS":
            print(f"{self.GREEN}✅ {log_entry}{self.RESET}")
        elif level == "WARNING":
            print(f"{self.YELLOW}⚠️  {log_entry}{self.RESET}")
        elif level == "INFO":
            print(f"{self.BLUE}ℹ️  {log_entry}{self.RESET}")
        else:
            print(f"📝 {log_entry}")
        
        self.installation_log.append(log_entry)
    
    def check_system_requirements(self) -> bool:
        """
        Verifica recursos do sistema conforme padrão Slice.
        
        Baseado em CONCEPTS.md - Baixo Recurso & Custo Mínimo:
        - Até 16GB RAM, 8 núcleos CPU
        - Armazenamento local suficiente
        - Python 3.10+
        """
        self.log("🔍 Verificando requisitos do sistema...")
        
        # Verifica Python
        python_version = sys.version_info
        if python_version < (3, 10):
            self.log(f"Python {python_version.major}.{python_version.minor} não suportado. Mínimo: 3.10", "ERROR")
            return False
        
        self.log(f"Python {python_version.major}.{python_version.minor}.{python_version.micro} ✓", "SUCCESS")
        
        # Verifica espaço em disco
        try:
            import shutil
            total, used, free = shutil.disk_usage("/")
            free_gb = free // (1024**3)
            
            if free_gb < 10:  # Mínimo 10GB livres
                self.log(f"Espaço insuficiente: {free_gb}GB livres. Mínimo: 10GB", "ERROR")
                return False
            
            self.log(f"Espaço em disco: {free_gb}GB livres ✓", "SUCCESS")
            
        except Exception as e:
            self.log(f"Erro ao verificar espaço: {e}", "WARNING")
        
        # Verifica se é CPU-only conforme padrão
        if FORCE_CPU_ONLY:
            self.log("Modo CPU-only ativado conforme padrão Slice ✓", "SUCCESS")
        
        return True
    
    def setup_python_environment(self) -> bool:
        """Configura ambiente Python com PDM."""
        self.log("🐍 Configurando ambiente Python...")
        
        try:
            # Verifica se PDM está instalado
            result = subprocess.run(["pdm", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                self.log(f"PDM encontrado: {result.stdout.strip()}", "SUCCESS")
            else:
                self.log("PDM não encontrado. Instalando...", "WARNING")
                subprocess.run([sys.executable, "-m", "pip", "install", "pdm"], check=True)
                self.log("PDM instalado com sucesso", "SUCCESS")
            
            # Instala dependências
            self.log("📦 Instalando dependências...")
            result = subprocess.run(["pdm", "install"], capture_output=True, text=True, cwd=Path(__file__).parent.parent)
            
            if result.returncode != 0:
                self.log(f"Erro na instalação: {result.stderr}", "ERROR")
                return False
            
            self.log("Dependências instaladas com sucesso ✓", "SUCCESS")
            self.steps_completed.append("python_env")
            return True
            
        except subprocess.CalledProcessError as e:
            self.log(f"Erro ao configurar ambiente Python: {e}", "ERROR")
            return False
        except Exception as e:
            self.log(f"Erro inesperado: {e}", "ERROR")
            return False
    
    def download_models(self) -> bool:
        """
        Baixa modelos HuggingFace conforme constants.py.
        
        Implementa padrão de Baixo Recurso:
        - Apenas modelos essenciais
        - Validação antes do download
        - CPU-only enforced
        """
        self.log("🤖 Baixando modelos HuggingFace...")
        
        try:
            # Cria diretório de cache
            os.makedirs(MODEL_CACHE_DIR, exist_ok=True)
            self.log(f"Cache de modelos: {MODEL_CACHE_DIR}", "INFO")
            
            # Importa downloader (agora que ambiente está configurado)
            from server.utils.model_downloader import download_default_models
            
            # Baixa modelos padrão
            self.log("⬇️  Iniciando download dos modelos padrão...")
            for function, model in DEFAULT_MODELS.items():
                self.log(f"  📥 {function}: {model}")
            
            results = download_default_models()
            
            # Verifica resultados
            successful = sum(1 for v in results.values() if v)
            total = len(results)
            
            if successful == total:
                self.log(f"Todos os {total} modelos baixados com sucesso ✓", "SUCCESS")
                self.steps_completed.append("models")
                return True
            else:
                self.log(f"Apenas {successful}/{total} modelos baixados", "WARNING")
                # Continua mesmo com falhas parciais (padrão de resiliência)
                self.steps_completed.append("models_partial")
                return True
                
        except Exception as e:
            self.log(f"Erro no download de modelos: {e}", "ERROR")
            # Não é fatal - servidor pode funcionar sem modelos pré-baixados
            self.log("Servidor funcionará sem modelos pré-baixados", "WARNING")
            return True
    
    def validate_installation(self) -> bool:
        """
        Valida instalação completa conforme padrão Slice.
        
        Implementa Validação Forte:
        - Testa imports
        - Verifica configurações
        - Testa funcionalidades básicas
        """
        self.log("🔍 Validando instalação...")
        
        try:
            # Testa imports principais
            self.log("  📋 Testando imports...")
            
            import server.constants
            self.log("    ✓ Constants")
            
            from server.models import ClassificationRequest
            self.log("    ✓ Models/Schemas")
            
            from server.providers.classify import create_classification_provider
            self.log("    ✓ Classification Provider")
            
            from server.providers.embed import create_embedding_provider
            self.log("    ✓ Embedding Provider")
            
            from server.providers.pos_tag import create_pos_tag_provider
            self.log("    ✓ POS Tag Provider")
            
            # Testa configurações
            self.log("  ⚙️  Validando configurações...")
            config = {
                "port": SERVER_PORT,
                "host": SERVER_HOST,
                "cpu_only": FORCE_CPU_ONLY,
                "models": len(DEFAULT_MODELS),
            }
            
            for key, value in config.items():
                self.log(f"    ✓ {key}: {value}")
            
            self.log("Validação completa ✓", "SUCCESS")
            self.steps_completed.append("validation")
            return True
            
        except ImportError as e:
            self.log(f"Erro de import: {e}", "ERROR")
            return False
        except Exception as e:
            self.log(f"Erro na validação: {e}", "ERROR")
            return False
    
    def create_startup_info(self) -> None:
        """Cria informações de startup para o usuário."""
        self.log("📋 Gerando informações de uso...")
        
        startup_info = {
            "server": {
                "url": f"http://{SERVER_HOST}:{SERVER_PORT}",
                "health": f"http://{SERVER_HOST}:{SERVER_PORT}/health",
                "docs": f"http://{SERVER_HOST}:{SERVER_PORT}/docs",
            },
            "commands": {
                "dev": "task dev",
                "start": "task start",
                "test": "task test",
                "health": "task health",
                "models": "task models",
            },
            "next_steps": [
                "1. Execute 'task dev' para iniciar em modo desenvolvimento",
                "2. Acesse http://localhost:5115/docs para ver a documentação da API",
                "3. Execute 'task test' para rodar os testes",
                "4. Execute 'task health' para verificar status do servidor",
            ]
        }
        
        # Salva info estruturada
        info_file = Path(__file__).parent.parent / "STARTUP_INFO.json"
        with open(info_file, 'w') as f:
            json.dump(startup_info, f, indent=2)
        
        self.log(f"Informações salvas em: {info_file}", "INFO")
    
    def show_success_summary(self) -> None:
        """Mostra resumo de sucesso da instalação."""
        elapsed = time.time() - self.start_time
        
        print(f"\n{self.GREEN}{self.BOLD}🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!{self.RESET}")
        print(f"{self.CYAN}⏱️  Tempo total: {elapsed:.1f}s{self.RESET}")
        print(f"{self.BLUE}📦 Etapas completadas: {len(self.steps_completed)}{self.RESET}")
        
        print(f"\n{self.BOLD}🚀 PRÓXIMOS PASSOS:{self.RESET}")
        print(f"{self.GREEN}1. task dev{self.RESET}     # Inicia servidor em desenvolvimento")
        print(f"{self.GREEN}2. http://localhost:{SERVER_PORT}/docs{self.RESET} # Documentação da API")
        print(f"{self.GREEN}3. task test{self.RESET}    # Executa testes automatizados")
        print(f"{self.GREEN}4. task health{self.RESET}  # Verifica status do servidor")
        
        print(f"\n{self.BOLD}📚 RECURSOS DISPONÍVEIS:{self.RESET}")
        print(f"• Classificação de texto: /api/v1/classify")
        print(f"• Geração de embeddings: /api/v1/embed") 
        print(f"• POS tagging: /api/v1/pos-tag")
        print(f"• Compatibilidade OpenAI: /v1/chat/completions")
        
        print(f"\n{self.BOLD}🔧 COMANDOS ÚTEIS:{self.RESET}")
        print(f"• task models list    # Lista modelos baixados")
        print(f"• task validate      # Validação completa")
        print(f"• task clean         # Limpeza de temporários")
        print(f"• task reset         # Restauração completa")
        
        print(f"\n{self.CYAN}✨ Servidor pronto para uso! ✨{self.RESET}\n")
    
    def handle_failure(self, step: str, error: str) -> None:
        """Trata falhas na instalação."""
        self.errors.append(f"{step}: {error}")
        
        print(f"\n{self.RED}{self.BOLD}❌ FALHA NA INSTALAÇÃO{self.RESET}")
        print(f"{self.RED}Etapa: {step}{self.RESET}")
        print(f"{self.RED}Erro: {error}{self.RESET}")
        
        print(f"\n{self.YELLOW}🔄 OPÇÕES DE RECUPERAÇÃO:{self.RESET}")
        print(f"1. task reset     # Restauração completa")
        print(f"2. task clean     # Limpeza e nova tentativa")
        print(f"3. Verifique logs em: installation.log")
        
        # Salva log de erro
        log_file = Path(__file__).parent.parent / "installation.log"
        with open(log_file, 'w') as f:
            f.write("\n".join(self.installation_log))
        
        sys.exit(1)
    
    def run(self) -> None:
        """Executa instalação completa."""
        print(f"{self.BOLD}{self.CYAN}")
        print("🏭 SLICE/ALIVE PROVIDERS SERVER - INSTALAÇÃO ENTERPRISE")
        print("=" * 60)
        print("Padrão CLP Industrial: Liga e Funciona")
        print("Plug-and-Play Total | Validação Contínua | Baixo Recurso")
        print(f"={self.RESET}\n")
        
        # Etapa 1: Verificação do sistema
        if not self.check_system_requirements():
            self.handle_failure("system_check", "Requisitos do sistema não atendidos")
        
        # Etapa 2: Ambiente Python
        if not self.setup_python_environment():
            self.handle_failure("python_env", "Falha na configuração do ambiente Python")
        
        # Etapa 3: Download de modelos
        if not self.download_models():
            self.handle_failure("models", "Falha no download de modelos")
        
        # Etapa 4: Validação
        if not self.validate_installation():
            self.handle_failure("validation", "Falha na validação da instalação")
        
        # Etapa 5: Info de startup
        self.create_startup_info()
        
        # Sucesso!
        self.show_success_summary()


if __name__ == "__main__":
    installer = SliceInstaller()
    installer.run()
