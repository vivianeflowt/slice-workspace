"""Testes para validar compatibilidade com OpenAI API (Checkpoint #011)."""

import pytest
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)


def test_chat_completions_endpoint_exists():
    """Verifica se o endpoint /v1/chat/completions existe."""
    response = client.post("/v1/chat/completions", json={
        "model": "command-r",
        "messages": [{"role": "user", "content": "Hello"}]
    })
    # Não deve retornar 404
    assert response.status_code != 404


def test_models_endpoint_exists():
    """Verifica se o endpoint /v1/models existe."""
    response = client.get("/v1/models")
    assert response.status_code == 200


def test_health_endpoint_exists():
    """Verifica se o endpoint /health existe."""
    response = client.get("/health")
    assert response.status_code == 200


def test_root_endpoint_exists():
    """Verifica se o endpoint raiz existe."""
    response = client.get("/")
    assert response.status_code == 200


def test_chat_completion_request_format():
    """Verifica se o formato da requisição segue padrão OpenAI."""
    # Teste com dados válidos
    valid_request = {
        "model": "command-r",
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "max_tokens": 100,
        "temperature": 0.7
    }
    
    response = client.post("/v1/chat/completions", json=valid_request)
    # Deve aceitar o formato padrão OpenAI
    assert response.status_code in [200, 503]  # 503 se modelo não carregado


def test_chat_completion_response_format():
    """Verifica se o formato da resposta segue padrão OpenAI."""
    request_data = {
        "model": "command-r",
        "messages": [{"role": "user", "content": "Test"}]
    }
    
    response = client.post("/v1/chat/completions", json=request_data)
    
    if response.status_code == 200:
        data = response.json()
        
        # Verificar campos obrigatórios da resposta OpenAI
        required_fields = ["id", "object", "created", "model", "choices", "usage"]
        for field in required_fields:
            assert field in data, f"Campo {field} deve estar presente na resposta"
        
        # Verificar estrutura das choices
        assert isinstance(data["choices"], list), "choices deve ser uma lista"
        if data["choices"]:
            choice = data["choices"][0]
            assert "index" in choice, "choice deve ter campo index"
            assert "message" in choice, "choice deve ter campo message"
            assert "finish_reason" in choice, "choice deve ter campo finish_reason"


def test_models_response_format():
    """Verifica se a resposta de /v1/models segue padrão OpenAI."""
    response = client.get("/v1/models")
    assert response.status_code == 200
    
    data = response.json()
    
    # Verificar estrutura da resposta
    assert "object" in data, "Resposta deve ter campo object"
    assert "data" in data, "Resposta deve ter campo data"
    assert data["object"] == "list", "object deve ser 'list'"
    assert isinstance(data["data"], list), "data deve ser uma lista"
    
    # Verificar estrutura dos modelos
    if data["data"]:
        model = data["data"][0]
        required_model_fields = ["id", "object", "created", "owned_by"]
        for field in required_model_fields:
            assert field in model, f"Modelo deve ter campo {field}"
