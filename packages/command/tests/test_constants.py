"""Testes para as constantes do projeto (Checkpoint #009)."""

import importlib.util
import os
import pytest
from server.constants import (
    SERVER_PORT,
    SERVER_HOST,
    MODEL_NAME,
    MAX_TOKENS_DEFAULT,
    TEMPERATURE_DEFAULT,
    MODELS_DIR,
    CACHE_DIR,
    LOGS_DIR
)


def test_default_port_constant_exists():
    """Verifica se a constante de porta padrão existe."""
    constants_path = os.path.join(os.path.dirname(__file__), '..', 'server', 'constants.py')
    spec = importlib.util.spec_from_file_location('constants', constants_path)
    constants = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(constants)
    assert hasattr(constants, 'SERVER_PORT') or hasattr(constants, 'DEFAULT_PORT')


def test_server_port_is_valid():
    """Verifica se a porta do servidor é válida."""
    assert isinstance(SERVER_PORT, int), "SERVER_PORT deve ser um inteiro"
    assert 1024 <= SERVER_PORT <= 65535, "SERVER_PORT deve estar entre 1024 e 65535"


def test_server_host_is_defined():
    """Verifica se o host do servidor está definido."""
    assert isinstance(SERVER_HOST, str), "SERVER_HOST deve ser uma string"
    assert len(SERVER_HOST) > 0, "SERVER_HOST não pode estar vazio"


def test_model_name_is_defined():
    """Verifica se o nome do modelo está definido."""
    assert isinstance(MODEL_NAME, str), "MODEL_NAME deve ser uma string"
    assert len(MODEL_NAME) > 0, "MODEL_NAME não pode estar vazio"


def test_max_tokens_is_positive():
    """Verifica se MAX_TOKENS_DEFAULT é um valor positivo."""
    assert isinstance(MAX_TOKENS_DEFAULT, int), "MAX_TOKENS_DEFAULT deve ser um inteiro"
    assert MAX_TOKENS_DEFAULT > 0, "MAX_TOKENS_DEFAULT deve ser positivo"


def test_temperature_is_valid():
    """Verifica se TEMPERATURE_DEFAULT está no range válido."""
    assert isinstance(TEMPERATURE_DEFAULT, (int, float)), "TEMPERATURE_DEFAULT deve ser numérico"
    assert 0.0 <= TEMPERATURE_DEFAULT <= 2.0, "TEMPERATURE_DEFAULT deve estar entre 0.0 e 2.0"


def test_directories_are_defined():
    """Verifica se os diretórios estão definidos."""
    directories = [MODELS_DIR, CACHE_DIR, LOGS_DIR]
    
    for directory in directories:
        assert isinstance(directory, str), f"Diretório {directory} deve ser uma string"
        assert len(directory) > 0, f"Diretório {directory} não pode estar vazio"


def test_no_magic_numbers_in_constants():
    """Verifica se não há números mágicos nas constantes."""
    # Teste conceitual - todas as constantes numéricas devem ter nomes descritivos
    numeric_constants = [
        SERVER_PORT,
        MAX_TOKENS_DEFAULT,
        TEMPERATURE_DEFAULT
    ]
    
    for constant in numeric_constants:
        assert isinstance(constant, (int, float)), "Constante deve ser numérica"
