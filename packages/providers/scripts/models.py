#!/usr/bin/env python3
"""
📦 Script de Gerenciamento de Modelos - Slice/ALIVE Providers Server

Implementa gerenciamento completo de modelos HuggingFace:
- Listagem de modelos disponíveis e baixados
- Download de modelos específicos
- Validação de modelos
- Limpeza de cache
- Informações detalhadas

Baseado em: /docs/CONCEPTS.md - Baixo Recurso & Custo Mínimo
"""

import argparse
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# Adiciona o diretório raiz ao Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from server.constants import DEFAULT_MODELS, MODEL_CACHE_DIR
from server.utils.model_downloader import (
    cleanup_cache,
    download_default_models,
    download_model,
    get_model_info,
    list_downloaded_models,
    validate_model,
)


class SliceModelManager:
    """
    Gerenciador enterprise de modelos HuggingFace.

    Implementa:
    - Baixo Recurso: gerencia uso eficiente de modelos
    - Justificativa Real: métricas de uso e performance
    - Validação Forte: verifica integridade dos modelos
    """

    def __init__(self):
        self.start_time = time.time()

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
        elif level == "MODEL":
            print(f"{self.CYAN}📦 [{timestamp}] {message}{self.RESET}")
        else:
            print(f"{self.BLUE}ℹ️  [{timestamp}] {message}{self.RESET}")

    def list_default_models(self) -> None:
        """Lista modelos padrão configurados."""
        print(f"{self.BOLD}{self.CYAN}📋 MODELOS PADRÃO CONFIGURADOS{self.RESET}")
        print(f"Cache: {MODEL_CACHE_DIR}")
        print()

        for function, model in DEFAULT_MODELS.items():
            print(f"{self.BLUE}🔧 {function.upper()}{self.RESET}")
            print(f"  Modelo: {model}")

            # Verifica se está baixado
            try:
                info = get_model_info(model)
                if "error" in info:
                    status = f"{self.RED}❌ Não baixado{self.RESET}"
                else:
                    status = f"{self.GREEN}✅ Baixado{self.RESET}"
                print(f"  Status: {status}")

                if "error" not in info:
                    print(f"  Arquitetura: {info.get('architecture', 'N/A')}")
                    print(f"  Vocab: {info.get('vocab_size', 'N/A')}")
            except:
                print(f"  Status: {self.YELLOW}⚠️  Erro na verificação{self.RESET}")

            print()

    def list_downloaded_models(self) -> None:
        """Lista modelos baixados."""
        print(f"{self.BOLD}{self.CYAN}📦 MODELOS BAIXADOS{self.RESET}")

        models = list_downloaded_models()

        if not models:
            print(f"{self.YELLOW}Nenhum modelo encontrado no cache{self.RESET}")
            print(f"Execute 'task models download' para baixar modelos padrão")
            return

        total_size = sum(model["size_mb"] for model in models)

        print(f"Total: {len(models)} modelos ({total_size:.1f} MB)")
        print(f"Cache: {MODEL_CACHE_DIR}")
        print()

        for model in sorted(models, key=lambda x: x["size_mb"], reverse=True):
            print(f"{self.GREEN}📦 {model['name']}{self.RESET}")
            print(f"  Tamanho: {model['size_mb']:.1f} MB")
            print(f"  Arquivos: {model['files']}")
            print(f"  Path: {model['path']}")
            print()

    def download_specific_model(self, model_name: str) -> bool:
        """Baixa um modelo específico."""
        print(f"{self.BOLD}{self.CYAN}⬇️  DOWNLOAD DE MODELO{self.RESET}")
        print(f"Modelo: {model_name}")
        print()

        self.log(f"Iniciando download: {model_name}", "MODEL")

        success = download_model(model_name)

        if success:
            self.log(f"Download concluído: {model_name}", "SUCCESS")

            # Valida modelo baixado
            self.log("Validando modelo baixado...", "MODEL")
            if validate_model(model_name):
                self.log("Modelo validado com sucesso ✓", "SUCCESS")
            else:
                self.log("Modelo baixado mas falhou na validação", "WARNING")

            return True
        else:
            self.log(f"Falha no download: {model_name}", "ERROR")
            return False

    def download_all_default(self) -> bool:
        """Baixa todos os modelos padrão."""
        print(f"{self.BOLD}{self.CYAN}⬇️  DOWNLOAD DE MODELOS PADRÃO{self.RESET}")
        print()

        self.log("Iniciando download dos modelos padrão...", "MODEL")

        results = download_default_models()

        # Resumo
        successful = sum(1 for v in results.values() if v)
        total = len(results)

        print(f"\n{self.BOLD}📊 RESUMO DO DOWNLOAD{self.RESET}")
        print(f"Sucessos: {successful}/{total}")

        for function, success in results.items():
            status = f"{self.GREEN}✅" if success else f"{self.RED}❌"
            model = DEFAULT_MODELS[function]
            print(f"{status} {function}: {model}{self.RESET}")

        return successful == total

    def validate_models(self) -> None:
        """Valida todos os modelos baixados."""
        print(f"{self.BOLD}{self.CYAN}🔍 VALIDAÇÃO DE MODELOS{self.RESET}")
        print()

        models = list_downloaded_models()

        if not models:
            self.log("Nenhum modelo para validar", "WARNING")
            return

        valid_count = 0

        for model in models:
            model_name = model["name"]
            self.log(f"Validando: {model_name}", "MODEL")

            if validate_model(model_name):
                self.log(f"✅ {model_name}", "SUCCESS")
                valid_count += 1
            else:
                self.log(f"❌ {model_name}", "ERROR")

        print(f"\n{self.BOLD}📊 RESULTADO DA VALIDAÇÃO{self.RESET}")
        print(f"Válidos: {valid_count}/{len(models)}")

        if valid_count == len(models):
            print(f"{self.GREEN}🎉 Todos os modelos estão válidos!{self.RESET}")
        else:
            print(
                f"{self.YELLOW}⚠️  Alguns modelos precisam ser baixados novamente{self.RESET}"
            )

    def cleanup_model_cache(self) -> None:
        """Limpa cache de modelos."""
        print(f"{self.BOLD}{self.CYAN}🧹 LIMPEZA DE CACHE{self.RESET}")
        print()

        self.log("Iniciando limpeza do cache...", "MODEL")

        stats = cleanup_cache()

        print(f"\n{self.BOLD}📊 ESTATÍSTICAS DA LIMPEZA{self.RESET}")
        print(f"Arquivos removidos: {stats['cleaned']}")
        print(f"Espaço liberado: {stats['freed_mb']:.2f} MB")

        if stats["errors"]:
            print(f"Erros: {len(stats['errors'])}")
            for error in stats["errors"][:3]:  # Mostra só os primeiros
                print(f"  {self.RED}• {error}{self.RESET}")
        else:
            print(f"{self.GREEN}✅ Limpeza concluída sem erros{self.RESET}")

    def show_model_info(self, model_name: str) -> None:
        """Mostra informações detalhadas de um modelo."""
        print(f"{self.BOLD}{self.CYAN}📋 INFORMAÇÕES DO MODELO{self.RESET}")
        print(f"Modelo: {model_name}")
        print()

        info = get_model_info(model_name)

        if "error" in info:
            print(f"{self.RED}❌ Modelo não encontrado ou inválido{self.RESET}")
            print(f"Erro: {info['error']}")
            return

        print(f"{self.BLUE}📦 Detalhes Técnicos{self.RESET}")
        print(f"  Nome: {info['name']}")
        print(f"  Arquitetura: {info.get('architecture', 'N/A')}")
        print(f"  Tipo: {info.get('model_type', 'N/A')}")
        print(f"  Vocabulário: {info.get('vocab_size', 'N/A')}")
        print(f"  Hidden Size: {info.get('hidden_size', 'N/A')}")
        print(f"  Camadas: {info.get('num_layers', 'N/A')}")
        print(f"  Max Position: {info.get('max_position', 'N/A')}")

        # Verifica se é um modelo padrão
        is_default = model_name in DEFAULT_MODELS.values()
        if is_default:
            function = next(k for k, v in DEFAULT_MODELS.items() if v == model_name)
            print(f"\n{self.GREEN}⭐ Modelo padrão para: {function}{self.RESET}")

    def show_usage_help(self) -> None:
        """Mostra ajuda de uso."""
        print(
            f"{self.BOLD}{self.CYAN}📚 GERENCIADOR DE MODELOS - SLICE/ALIVE{self.RESET}"
        )
        print()
        print("Comandos disponíveis:")
        print(
            f"  {self.GREEN}list{self.RESET}              Lista modelos padrão configurados"
        )
        print(
            f"  {self.GREEN}downloaded{self.RESET}        Lista modelos baixados no cache"
        )
        print(
            f"  {self.GREEN}download{self.RESET}          Baixa todos os modelos padrão"
        )
        print(f"  {self.GREEN}download <modelo>{self.RESET} Baixa modelo específico")
        print(
            f"  {self.GREEN}validate{self.RESET}          Valida todos os modelos baixados"
        )
        print(
            f"  {self.GREEN}info <modelo>{self.RESET}     Informações detalhadas do modelo"
        )
        print(
            f"  {self.GREEN}cleanup{self.RESET}           Limpa cache (remove temporários)"
        )
        print()
        print("Exemplos:")
        print("  task models list")
        print("  task models download")
        print("  task models download neuralmind/bert-base-portuguese-cased")
        print("  task models validate")
        print("  task models info neuralmind/bert-base-portuguese-cased")
        print("  task models cleanup")


def main():
    """Função principal do gerenciador de modelos."""
    parser = argparse.ArgumentParser(description="Gerenciador de modelos Slice/ALIVE")
    parser.add_argument("command", nargs="?", default="list", help="Comando a executar")
    parser.add_argument(
        "model", nargs="?", help="Nome do modelo (para comandos específicos)"
    )

    args = parser.parse_args()

    manager = SliceModelManager()

    if args.command == "list":
        manager.list_default_models()

    elif args.command == "downloaded":
        manager.list_downloaded_models()

    elif args.command == "download":
        if args.model:
            success = manager.download_specific_model(args.model)
            sys.exit(0 if success else 1)
        else:
            success = manager.download_all_default()
            sys.exit(0 if success else 1)

    elif args.command == "validate":
        manager.validate_models()

    elif args.command == "info":
        if not args.model:
            print(f"{manager.RED}❌ Modelo não especificado{manager.RESET}")
            print("Uso: task models info <nome_do_modelo>")
            sys.exit(1)
        manager.show_model_info(args.model)

    elif args.command == "cleanup":
        manager.cleanup_model_cache()

    elif args.command == "help":
        manager.show_usage_help()

    else:
        print(f"{manager.RED}❌ Comando desconhecido: {args.command}{manager.RESET}")
        manager.show_usage_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
