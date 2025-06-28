#!/usr/bin/env python3
"""
🐚 Shell Script - Slice/ALIVE Providers Server
Shell interativo com ambiente e contexto carregado.

Princípios CONCEPTS.md:
- Incrementalismo: Loading de contexto por etapas
- Baixo Recurso: Shell eficiente e responsivo
- Validação Forte: Contexto validado antes de carregar
- Isolamento por Camada: Namespaces organizados
"""

import logging
import sys
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def load_environment():
    """
    Carrega ambiente e contexto do projeto.

    Returns:
        dict: Contexto carregado
    """
    logger.info("🔄 Carregando ambiente Slice/ALIVE Providers...")

    context = {"project_root": Path.cwd(), "modules": {}, "utils": {}, "constants": {}}

    try:
        # Carregar módulos principais
        logger.info("📦 Carregando módulos principais...")

        # Server modules
        import server
        from server import constants, main
        from server.models import *

        context["modules"]["server"] = server
        context["modules"]["main"] = main
        context["constants"] = constants

        logger.info("✅ Módulos do servidor carregados")

        # Providers
        from server.providers.classify import huggingface as classify_hf
        from server.providers.embed import huggingface as embed_hf
        from server.providers.pos_tag import huggingface as pos_tag_hf

        context["modules"]["providers"] = {
            "classify": classify_hf,
            "embed": embed_hf,
            "pos_tag": pos_tag_hf,
        }

        logger.info("✅ Providers carregados")

        # Utils
        from server.utils.model_downloader import ModelDownloader

        context["utils"]["downloader"] = ModelDownloader()

        logger.info("✅ Utilitários carregados")

        # Verificar modelos disponíveis
        logger.info("🤖 Verificando modelos disponíveis...")

        models_status = {}
        for model_type, model_name in constants.MODELS.items():
            is_available = context["utils"]["downloader"].is_model_downloaded(
                model_name
            )
            models_status[model_type] = {"name": model_name, "available": is_available}

        context["models_status"] = models_status

        available_count = sum(
            1 for status in models_status.values() if status["available"]
        )
        total_count = len(models_status)

        logger.info(f"🤖 Modelos: {available_count}/{total_count} disponíveis")

    except Exception as e:
        logger.error(f"❌ Erro ao carregar ambiente: {e}")
        context["error"] = str(e)

    return context


def create_interactive_namespace(context):
    """
    Cria namespace interativo para o shell.

    Args:
        context: Contexto carregado

    Returns:
        dict: Namespace para o shell
    """
    namespace = {
        # Módulos principais
        "server": context["modules"].get("server"),
        "main": context["modules"].get("main"),
        "constants": context.get("constants"),
        # Providers organizados
        "classify": context["modules"]["providers"]["classify"],
        "embed": context["modules"]["providers"]["embed"],
        "pos_tag": context["modules"]["providers"]["pos_tag"],
        # Utils
        "downloader": context["utils"]["downloader"],
        # Informações do projeto
        "project_root": context["project_root"],
        "models_status": context.get("models_status", {}),
        # Funções helper
        "help_slice": lambda: print_help(),
        "check_models": lambda: check_models_helper(context),
        "test_provider": lambda provider, text="test": test_provider_helper(
            provider, text, context
        ),
        "download_model": lambda model_type: download_model_helper(model_type, context),
        # Imports comuns
        "Path": Path,
        "json": __import__("json"),
        "requests": __import__("requests"),
        "datetime": __import__("datetime"),
    }

    return namespace


def print_help():
    """Exibe ajuda do shell interativo."""
    help_text = """
🐚 Shell Interativo - Slice/ALIVE Providers Server
=================================================

OBJETOS DISPONÍVEIS:
  server          - Módulo principal do servidor
  main            - FastAPI app e rotas
  constants       - Constantes do projeto (MODELS, etc.)

  classify        - Provider de classificação
  embed           - Provider de embeddings
  pos_tag         - Provider de POS tagging

  downloader      - Utilitário para download de modelos

  project_root    - Caminho raiz do projeto
  models_status   - Status dos modelos disponíveis

FUNÇÕES HELPER:
  help_slice()                    - Esta ajuda
  check_models()                  - Verifica status dos modelos
  test_provider(provider, text)   - Testa um provider com texto
  download_model(model_type)      - Baixa modelo específico

EXEMPLOS DE USO:
  # Verificar modelos
  check_models()

  # Testar classificação
  test_provider("classify", "This is a positive review")

  # Baixar modelo
  download_model("classify")

  # Usar diretamente
  result = classify.classify_text("Hello world", "sentiment")

  # Verificar constantes
  print(constants.MODELS)

  # Listar modelos baixados
  downloader.list_downloaded_models()

DICAS:
  - Use dir(objeto) para ver métodos disponíveis
  - Use help(função) para documentação detalhada
  - Ctrl+D ou exit() para sair
"""
    print(help_text)


def check_models_helper(context):
    """Helper para verificar status dos modelos."""
    models_status = context.get("models_status", {})

    print("\n🤖 Status dos Modelos:")
    print("=" * 40)

    for model_type, info in models_status.items():
        status = "✅ Disponível" if info["available"] else "❌ Não baixado"
        print(f"{model_type:12}: {status:15} ({info['name']})")

    available = sum(1 for info in models_status.values() if info["available"])
    total = len(models_status)
    print(f"\nTotal: {available}/{total} modelos disponíveis")


def test_provider_helper(provider_name, text, context):
    """Helper para testar providers."""
    try:
        providers = context["modules"]["providers"]

        if provider_name not in providers:
            print(f"❌ Provider '{provider_name}' não encontrado")
            print(f"Providers disponíveis: {list(providers.keys())}")
            return

        provider = providers[provider_name]

        print(f"🧪 Testando {provider_name} com: '{text}'")

        if provider_name == "classify":
            result = provider.classify_text(text, task="sentiment")
        elif provider_name == "embed":
            result = provider.get_embeddings([text])
        elif provider_name == "pos_tag":
            result = provider.pos_tag_text(text)
        else:
            print(f"❌ Não sei como testar provider '{provider_name}'")
            return

        print(f"✅ Resultado: {result}")
        return result

    except Exception as e:
        print(f"❌ Erro ao testar provider: {e}")


def download_model_helper(model_type, context):
    """Helper para baixar modelos."""
    try:
        constants = context.get("constants")
        downloader = context["utils"]["downloader"]

        if not constants or model_type not in constants.MODELS:
            print(f"❌ Tipo de modelo '{model_type}' não encontrado")
            print(
                f"Tipos disponíveis: {list(constants.MODELS.keys()) if constants else 'N/A'}"
            )
            return

        model_name = constants.MODELS[model_type]
        print(f"📥 Baixando modelo {model_type}: {model_name}")

        success = downloader.download_model(model_name)

        if success:
            print(f"✅ Modelo {model_type} baixado com sucesso")
        else:
            print(f"❌ Falha ao baixar modelo {model_type}")

    except Exception as e:
        print(f"❌ Erro ao baixar modelo: {e}")


def start_interactive_shell(namespace):
    """
    Inicia shell interativo com namespace personalizado.

    Args:
        namespace: Namespace com objetos carregados
    """
    try:
        # Usar IPython se disponível
        from IPython import embed

        print("🐚 Iniciando shell IPython...")
        print("💡 Digite 'help_slice()' para ver comandos disponíveis")

        embed(user_ns=namespace, colors="neutral")

    except ImportError:
        # Fallback para shell Python padrão
        import code

        print("🐚 Iniciando shell Python padrão...")
        print("💡 Digite 'help_slice()' para ver comandos disponíveis")

        # Adicionar ao namespace local
        for key, value in namespace.items():
            globals()[key] = value

        console = code.InteractiveConsole(locals=namespace)
        console.interact()


def main():
    """Inicia shell interativo com ambiente carregado."""
    logger.info("🐚 Iniciando Shell Interativo - Slice/ALIVE Providers Server")

    # Carregar ambiente
    context = load_environment()

    if "error" in context:
        logger.error(
            "❌ Falha ao carregar ambiente - shell pode ter funcionalidade limitada"
        )

    # Criar namespace
    namespace = create_interactive_namespace(context)

    logger.info("✅ Ambiente carregado - iniciando shell...")
    print("\n" + "=" * 60)

    try:
        start_interactive_shell(namespace)
    except KeyboardInterrupt:
        print("\n👋 Shell interrompido pelo usuário")
    except Exception as e:
        logger.error(f"❌ Erro no shell: {e}")
        sys.exit(1)

    logger.info("👋 Shell finalizado")


if __name__ == "__main__":
    main()
