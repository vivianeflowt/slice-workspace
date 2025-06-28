"""Testes de estrutura de diretórios (Checkpoint #001)."""

import os
import pytest


def test_server_directory_exists():
    """Verifica se o diretório server/ existe."""
    assert os.path.exists("server/"), "Diretório server/ deve existir"
    assert os.path.isdir("server/"), "server/ deve ser um diretório"


def test_server_init_exists():
    """Verifica se server/__init__.py existe."""
    assert os.path.exists("server/__init__.py"), "Arquivo server/__init__.py deve existir"


def test_tests_directory_exists():
    """Verifica se o diretório tests/ existe."""
    assert os.path.exists("tests/"), "Diretório tests/ deve existir"
    assert os.path.isdir("tests/"), "tests/ deve ser um diretório"


def test_tests_init_exists():
    """Verifica se tests/__init__.py existe."""
    assert os.path.exists("tests/__init__.py"), "Arquivo tests/__init__.py deve existir"


def test_required_subdirectories():
    """Verifica se os subdiretórios necessários existem."""
    required_dirs = [
        "server/api",
        "server/models", 
        "server/services"
    ]
    
    for directory in required_dirs:
        assert os.path.exists(directory), f"Diretório {directory} deve existir"
        assert os.path.isdir(directory), f"{directory} deve ser um diretório"
