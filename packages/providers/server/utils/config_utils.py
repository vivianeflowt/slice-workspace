#!/usr/bin/env python3
"""
🔧 Config Utils - Slice/ALIVE Providers Server
Funções helper para configuração e acesso a constantes.

Princípios CONCEPTS.md:
- Isolamento por Camada: Utils separados de constantes
- Responsabilidade Única: Apenas helpers de configuração
- Validação Forte: Type hints e validação de entrada
"""

from typing import Any, Dict, List

from server.constants import (
    ALTERNATIVE_MODELS,
    CPU_THREADS,
    DEBUG_MODE,
    DEFAULT_MODELS,
    DEVICE,
    FORCE_CPU_ONLY,
    REQUEST_TIMEOUT_SECONDS,
    SERVER_HOST,
    SERVER_PORT,
)


def get_model_for_function(function_name: str) -> str:
    """
    Retorna o modelo padrão para uma função específica.

    Args:
        function_name: Nome da função (classify, embed, pos_tag)

    Returns:
        str: Nome do modelo padrão ou string vazia se não encontrado
    """
    if not isinstance(function_name, str):
        return ""

    return DEFAULT_MODELS.get(function_name.lower(), "")


def get_alternative_models(function_name: str) -> List[str]:
    """
    Retorna lista de modelos alternativos para uma função.

    Args:
        function_name: Nome da função (classify, embed, pos_tag)

    Returns:
        List[str]: Lista de modelos alternativos
    """
    if not isinstance(function_name, str):
        return []

    return ALTERNATIVE_MODELS.get(function_name.lower(), [])


def is_cpu_only_enforced() -> bool:
    """
    Verifica se o modo CPU-only está ativado.

    Returns:
        bool: True se CPU-only está forçado
    """
    return FORCE_CPU_ONLY


def get_server_config() -> Dict[str, Any]:
    """
    Retorna configuração completa do servidor.

    Returns:
        Dict[str, Any]: Configurações do servidor
    """
    return {
        "host": SERVER_HOST,
        "port": SERVER_PORT,
        "timeout": REQUEST_TIMEOUT_SECONDS,
        "device": DEVICE,
        "cpu_threads": CPU_THREADS,
        "debug": DEBUG_MODE,
    }


def validate_function_name(function_name: str) -> bool:
    """
    Valida se o nome da função é suportado.

    Args:
        function_name: Nome da função para validar

    Returns:
        bool: True se função é válida
    """
    if not isinstance(function_name, str):
        return False

    return function_name.lower() in DEFAULT_MODELS


def get_supported_functions() -> List[str]:
    """
    Retorna lista de funções suportadas.

    Returns:
        List[str]: Lista de nomes de funções suportadas
    """
    return list(DEFAULT_MODELS.keys())


def get_model_config(function_name: str) -> Dict[str, Any]:
    """
    Retorna configuração completa de um modelo específico.

    Args:
        function_name: Nome da função

    Returns:
        Dict[str, Any]: Configuração do modelo
    """
    if not validate_function_name(function_name):
        return {}

    return {
        "function": function_name,
        "default_model": get_model_for_function(function_name),
        "alternatives": get_alternative_models(function_name),
        "device": DEVICE,
        "cpu_threads": CPU_THREADS,
        "force_cpu_only": FORCE_CPU_ONLY,
    }
