"""Configuração e inicialização do servidor Command-R."""

import os
from typing import Optional
from .constants import (
    SERVER_PORT,
    SERVER_HOST,
    MODELS_DIR,
    DEFAULT_TIMEOUT,
    CACHE_DIR,
    LOGS_DIR,
    MAX_TOKENS_DEFAULT,
    TEMPERATURE_DEFAULT,
    TOP_P_DEFAULT,
    PORT_MIN,
    PORT_MAX
)


class ServerConfig:
    """Configuração centralizada do servidor."""

    def __init__(self):
        """Inicializa as configurações do servidor."""
        self.host = SERVER_HOST
        self.port = SERVER_PORT
        self.models_dir = MODELS_DIR
        self.timeout = DEFAULT_TIMEOUT
        self.cache_dir = CACHE_DIR
        self.logs_dir = LOGS_DIR

        # Model defaults
        self.max_tokens = MAX_TOKENS_DEFAULT
        self.temperature = TEMPERATURE_DEFAULT
        self.top_p = TOP_P_DEFAULT

    def ensure_directories(self) -> None:
        """Garante que os diretórios necessários existem."""
        directories = [
            self.models_dir,
            self.cache_dir,
            self.logs_dir
        ]

        for directory in directories:
            os.makedirs(directory, exist_ok=True)

    def validate_config(self) -> bool:
        """Valida se a configuração está correta."""
        try:
            # Validar porta
            if not isinstance(self.port, int) or not (PORT_MIN <= self.port <= PORT_MAX):
                return False

            # Validar diretórios
            if not os.path.isdir(os.path.dirname(self.models_dir)):
                return False

            # Validar timeouts
            if not isinstance(self.timeout, (int, float)) or self.timeout <= 0:
                return False

            return True
        except Exception:
            return False


def get_config() -> ServerConfig:
    """Retorna uma instância configurada do servidor."""
    config = ServerConfig()
    config.ensure_directories()

    if not config.validate_config():
        raise ValueError("Configuração inválida do servidor")

    return config
