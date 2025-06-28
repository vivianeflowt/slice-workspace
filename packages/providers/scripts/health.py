#!/usr/bin/env python3
"""
🏥 Health Check Script - Slice/ALIVE Providers Server
Validação do estado do servidor e componentes críticos.

Princípios CONCEPTS.md:
- Validação Forte: JSON Schema para responses
- Incrementalismo: Checks incrementais e reportados
- Baixo Recurso: Timeouts otimizados, CPU-only
- Isolamento por Camada: Health específico por componente
"""

import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from jsonschema import ValidationError, validate

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Schema para validação de health response
HEALTH_SCHEMA = {
    "type": "object",
    "properties": {
        "status": {"type": "string", "enum": ["healthy", "unhealthy", "degraded"]},
        "timestamp": {"type": "string"},
        "version": {"type": "string"},
        "services": {
            "type": "object",
            "properties": {
                "api": {"type": "boolean"},
                "models": {"type": "boolean"},
                "providers": {"type": "boolean"},
            },
            "required": ["api", "models", "providers"],
        },
        "resources": {
            "type": "object",
            "properties": {
                "memory_usage": {"type": "number"},
                "cpu_usage": {"type": "number"},
                "disk_usage": {"type": "number"},
            },
        },
    },
    "required": ["status", "timestamp", "version", "services"],
}


def check_server_health(host="http://localhost:8000", timeout=10):
    """
    Executa health check do servidor principal.

    Args:
        host: URL base do servidor
        timeout: Timeout em segundos

    Returns:
        dict: Status detalhado do health check
    """
    logger.info("🔍 Verificando health do servidor...")

    try:
        # Health check endpoint
        response = requests.get(f"{host}/health", timeout=timeout)

        if response.status_code == 200:
            health_data = response.json()

            # Validação forte usando JSON Schema
            try:
                validate(instance=health_data, schema=HEALTH_SCHEMA)
                logger.info("✅ Health response válido")
            except ValidationError as e:
                logger.warning(f"⚠️  Health response inválido: {e.message}")
                return {
                    "status": "degraded",
                    "error": f"Schema validation failed: {e.message}",
                }

            return health_data
        else:
            logger.error(f"❌ Servidor retornou status {response.status_code}")
            return {"status": "unhealthy", "error": f"HTTP {response.status_code}"}

    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Erro ao conectar com servidor: {e}")
        return {"status": "unhealthy", "error": f"Connection failed: {e}"}


def check_providers_health(host="http://localhost:8000", timeout=10):
    """
    Verifica health específico dos providers (classify, embed, pos_tag).

    Args:
        host: URL base do servidor
        timeout: Timeout em segundos

    Returns:
        dict: Status dos providers
    """
    logger.info("🔍 Verificando health dos providers...")

    providers_status = {"classify": False, "embed": False, "pos_tag": False}

    for provider in providers_status.keys():
        try:
            response = requests.get(f"{host}/{provider}/health", timeout=timeout)
            providers_status[provider] = response.status_code == 200

            if providers_status[provider]:
                logger.info(f"✅ Provider {provider} funcionando")
            else:
                logger.warning(
                    f"⚠️  Provider {provider} com problemas (HTTP {response.status_code})"
                )

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Provider {provider} inacessível: {e}")
            providers_status[provider] = False

    return providers_status


def check_models_health():
    """
    Verifica se os modelos HuggingFace estão disponíveis localmente.

    Returns:
        dict: Status dos modelos
    """
    logger.info("🔍 Verificando disponibilidade dos modelos...")

    try:
        from server.constants import MODELS
        from server.utils.model_downloader import ModelDownloader

        downloader = ModelDownloader()
        models_status = {}

        for model_type, model_name in MODELS.items():
            is_available = downloader.is_model_downloaded(model_name)
            models_status[model_type] = is_available

            if is_available:
                logger.info(f"✅ Modelo {model_type} ({model_name}) disponível")
            else:
                logger.warning(f"⚠️  Modelo {model_type} ({model_name}) não encontrado")

        return models_status

    except Exception as e:
        logger.error(f"❌ Erro ao verificar modelos: {e}")
        return {"error": str(e)}


def generate_health_report(server_health, providers_health, models_health):
    """
    Gera relatório consolidado de health check.

    Args:
        server_health: Status do servidor
        providers_health: Status dos providers
        models_health: Status dos modelos

    Returns:
        dict: Relatório consolidado
    """
    # Determinar status geral
    overall_status = "healthy"

    if server_health.get("status") == "unhealthy":
        overall_status = "unhealthy"
    elif server_health.get("status") == "degraded":
        overall_status = "degraded"
    elif not all(providers_health.values()):
        overall_status = "degraded"
    elif "error" in models_health or not all(models_health.values()):
        overall_status = "degraded"

    report = {
        "overall_status": overall_status,
        "timestamp": datetime.now().isoformat(),
        "checks": {
            "server": server_health,
            "providers": providers_health,
            "models": models_health,
        },
        "summary": {
            "total_checks": 3,
            "passed": sum(
                [
                    server_health.get("status") == "healthy",
                    all(providers_health.values()),
                    "error" not in models_health and all(models_health.values()),
                ]
            ),
        },
    }

    return report


def main():
    """Executa health check completo do sistema."""
    logger.info("🏥 Iniciando Health Check - Slice/ALIVE Providers Server")
    logger.info("=" * 60)

    start_time = time.time()

    # Health checks incrementais
    server_health = check_server_health()
    providers_health = check_providers_health()
    models_health = check_models_health()

    # Gerar relatório consolidado
    report = generate_health_report(server_health, providers_health, models_health)

    # Exibir resultado
    elapsed_time = time.time() - start_time
    logger.info("=" * 60)
    logger.info(f"🏥 Health Check Finalizado - {elapsed_time:.2f}s")

    if report["overall_status"] == "healthy":
        logger.info("✅ Sistema Saudável - Todos os componentes funcionando")
        exit_code = 0
    elif report["overall_status"] == "degraded":
        logger.warning("⚠️  Sistema Degradado - Alguns componentes com problemas")
        exit_code = 1
    else:
        logger.error("❌ Sistema com Falhas Críticas")
        exit_code = 2

    # Exibir sumário
    logger.info(
        f"📊 Sumário: {report['summary']['passed']}/{report['summary']['total_checks']} checks passaram"
    )

    # Salvar relatório (opcional)
    report_path = Path("health_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    logger.info(f"📄 Relatório salvo em: {report_path}")

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
