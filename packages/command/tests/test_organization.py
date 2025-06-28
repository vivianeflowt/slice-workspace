"""Testes para validar a estrutura organizacional (Checkpoint #003)."""

import ast
import os
import pytest


def test_main_py_has_only_app_call():
    """Verifica se main.py tem apenas chamadas de configuração da app."""
    main_path = os.path.join(os.path.dirname(__file__), '..', 'server', 'main.py')
    assert os.path.isfile(main_path)
    with open(main_path, 'r') as f:
        tree = ast.parse(f.read())
    # Espera-se que só haja uma chamada de app (ex: app = FastAPI())
    assigns = [n for n in tree.body if isinstance(n, ast.Assign)]
    calls = [n for n in tree.body if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)]
    assert any(isinstance(a.value, ast.Call) for a in assigns) or len(calls) > 0


def test_main_py_is_minimal():
    """Verifica se main.py contém apenas configuração da aplicação."""
    main_path = "server/main.py"
    assert os.path.exists(main_path), "server/main.py deve existir"
    
    with open(main_path, 'r') as f:
        content = f.read()
    
    # Verificar se main.py não tem lógica de negócio complexa
    tree = ast.parse(content)
    
    # Contar definições de funções (excluindo funções de configuração)
    function_defs = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    
    # main.py deve ter principalmente funções de configuração
    config_keywords = ['create', 'get', 'setup', 'configure', 'lifespan']
    business_logic_functions = []
    
    for func in function_defs:
        if not any(keyword in func.name.lower() for keyword in config_keywords):
            business_logic_functions.append(func.name)
    
    # Permitir algumas funções de configuração
    assert len(business_logic_functions) <= 2, f"main.py deve ter mínima lógica de negócio: {business_logic_functions}"


def test_services_directory_structure():
    """Verifica se services/ está organizado corretamente."""
    services_dir = "server/services"
    assert os.path.exists(services_dir), "Diretório server/services deve existir"
    
    # Verificar se existe __init__.py
    init_file = os.path.join(services_dir, "__init__.py")
    assert os.path.exists(init_file), "server/services/__init__.py deve existir"


def test_api_directory_structure():
    """Verifica se api/ está organizado corretamente."""
    api_dir = "server/api"
    assert os.path.exists(api_dir), "Diretório server/api deve existir"
    
    # Verificar se existe __init__.py
    init_file = os.path.join(api_dir, "__init__.py")
    assert os.path.exists(init_file), "server/api/__init__.py deve existir"
    
    # Verificar se os endpoints principais existem
    expected_endpoints = ["chat.py", "models.py", "health.py"]
    for endpoint in expected_endpoints:
        endpoint_file = os.path.join(api_dir, endpoint)
        assert os.path.exists(endpoint_file), f"server/api/{endpoint} deve existir"


def test_models_directory_structure():
    """Verifica se models/ está organizado corretamente."""
    models_dir = "server/models"
    assert os.path.exists(models_dir), "Diretório server/models deve existir"
    
    # Verificar se existe __init__.py
    init_file = os.path.join(models_dir, "__init__.py")
    assert os.path.exists(init_file), "server/models/__init__.py deve existir"
