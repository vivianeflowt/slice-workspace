"""
Configurações centralizadas do servidor de providers HuggingFace.

Este módulo centraliza todas as configurações, evitando números mágicos
espalhados pelo código e facilitando manutenção e testes.
"""

import os
from typing import Dict, List, Any

# =============================================================================
# CONFIGURAÇÕES DO SERVIDOR
# =============================================================================

# Porta do servidor (configurável via environment)
SERVER_PORT: int = int(os.getenv("PROVIDERS_PORT", "5115"))
SERVER_HOST: str = os.getenv("PROVIDERS_HOST", "0.0.0.0")

# Timeouts e limites
REQUEST_TIMEOUT_SECONDS: int = 30
MAX_TEXT_LENGTH: int = 8192
MAX_BATCH_SIZE: int = 16

# =============================================================================
# CONFIGURAÇÕES DE MODELOS HUGGINGFACE
# =============================================================================

# Modelos padrão para cada funcionalidade
DEFAULT_MODELS: Dict[str, str] = {
    "classify": "neuralmind/bert-base-portuguese-cased",
    "embed": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "pos_tag": "pierreguillou/bert-base-cased-pt-lenerbr",
}

# Modelos alternativos disponíveis
ALTERNATIVE_MODELS: Dict[str, List[str]] = {
    "classify": [
        "neuralmind/bert-base-portuguese-cased",
        "rufimelo/Legal-BERTimbau-base",
        "pierreguillou/bert-base-cased-pt-lenerbr",
    ],
    "embed": [
        "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        "sentence-transformers/distiluse-base-multilingual-cased",
        "neuralmind/bert-base-portuguese-cased",
    ],
    "pos_tag": [
        "pierreguillou/bert-base-cased-pt-lenerbr",
        "neuralmind/bert-base-portuguese-cased",
    ],
}

# Cache de modelos (em segundos)
MODEL_CACHE_TTL: int = 3600  # 1 hora
MODEL_MEMORY_CACHE_SIZE: int = 3  # Máximo de modelos em memória simultaneamente

# =============================================================================
# CONFIGURAÇÕES CPU-ONLY
# =============================================================================

# Força uso de CPU apenas
FORCE_CPU_ONLY: bool = True
DEVICE: str = "cpu"

# Configurações de threading para CPU
CPU_THREADS: int = int(os.getenv("CPU_THREADS", "4"))
TORCH_NUM_THREADS: int = CPU_THREADS

# =============================================================================
# CONFIGURAÇÕES OPENAI API COMPATIBILITY
# =============================================================================

# Endpoints compatíveis com OpenAI
OPENAI_COMPATIBLE_ENDPOINTS: Dict[str, str] = {
    "/v1/chat/completions": "/api/v1/classify",
    "/v1/embeddings": "/api/v1/embed",
}

# Modelos mapeados para compatibilidade OpenAI
OPENAI_MODEL_MAPPING: Dict[str, str] = {
    "gpt-3.5-turbo": "classify",
    "text-embedding-ada-002": "embed",
    "text-davinci-003": "classify",
}

# =============================================================================
# CONFIGURAÇÕES DE LOGGING E DEBUG
# =============================================================================

# Nível de log
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

# Debug mode
DEBUG_MODE: bool = os.getenv("DEBUG", "false").lower() == "true"

# =============================================================================
# CONFIGURAÇÕES DE VALIDAÇÃO
# =============================================================================

# Validação de entrada
MIN_TEXT_LENGTH: int = 1
MAX_CLASSIFICATION_LABELS: int = 10
VALID_LANGUAGES: List[str] = ["pt", "en", "es", "fr"]

# =============================================================================
# CONFIGURAÇÕES DE HEALTH CHECK
# =============================================================================

HEALTH_CHECK_TIMEOUT: int = 5
HEALTH_CHECK_ENDPOINTS: List[str] = [
    "/health",
    "/api/v1/health", 
    "/ready",
]

# =============================================================================
# CONFIGURAÇÕES DE DOWNLOAD DE MODELOS
# =============================================================================

# Diretório para cache de modelos
MODEL_CACHE_DIR: str = os.path.join(
    os.path.expanduser("~"), 
    ".cache", 
    "slice-providers", 
    "models"
)

# URLs e configurações de download
HUGGINGFACE_HUB_CACHE: str = MODEL_CACHE_DIR
DOWNLOAD_TIMEOUT: int = 300  # 5 minutos
MAX_DOWNLOAD_RETRIES: int = 3

# =============================================================================
# CONFIGURAÇÕES DE TESTE
# =============================================================================

# Configurações específicas para testes
TEST_MODEL_NAME: str = "distilbert-base-uncased"
TEST_TEXT: str = "Este é um texto de teste para validação."
TEST_LABELS: List[str] = ["positivo", "negativo", "neutro"]

# Mock responses para testes
MOCK_CLASSIFICATION_RESPONSE: Dict[str, Any] = {
    "predictions": [
        {"label": "positivo", "score": 0.85},
        {"label": "negativo", "score": 0.10},
        {"label": "neutro", "score": 0.05},
    ]
}

MOCK_EMBEDDING_RESPONSE: Dict[str, Any] = {
    "embeddings": [[0.1, 0.2, 0.3] * 256],  # 768 dimensões simuladas
    "model": "test-embed-model",
    "usage": {"total_tokens": 10}
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_model_for_function(function_name: str) -> str:
    """Retorna o modelo padrão para uma função específica."""
    return DEFAULT_MODELS.get(function_name, "")

def get_alternative_models(function_name: str) -> List[str]:
    """Retorna lista de modelos alternativos para uma função."""
    return ALTERNATIVE_MODELS.get(function_name, [])

def is_cpu_only_enforced() -> bool:
    """Verifica se o modo CPU-only está ativado."""
    return FORCE_CPU_ONLY

def get_server_config() -> Dict[str, Any]:
    """Retorna configuração completa do servidor."""
    return {
        "host": SERVER_HOST,
        "port": SERVER_PORT,
        "timeout": REQUEST_TIMEOUT_SECONDS,
        "device": DEVICE,
        "cpu_threads": CPU_THREADS,
        "debug": DEBUG_MODE,
    }
