"""
Arquivo de constantes do projeto Providers (Slice/ALIVE).

- Centraliza todos os valores configuráveis: paths, portas, timeouts, etc.
- Não usar .env para configs críticas; edite este arquivo diretamente para máxima rastreabilidade.
- Siga o padrão Slice/ALIVE: clareza, versionamento e facilidade de setup.
"""

import os
from typing import Any, Dict, List

# =============================================================================
# CONFIGURAÇÕES DO SERVIDOR
# =============================================================================

# Server configuration
SERVER_PORT = 11544  # Porta específica para providers HuggingFace (padrão incremental Slice/ALIVE)
SERVER_HOST = "0.0.0.0"
SERVER_NAME = "slice-providers-server"
API_VERSION = "v1"

# Timeouts e limites
REQUEST_TIMEOUT_SECONDS = 30
MAX_TEXT_LENGTH = 8192
MAX_BATCH_SIZE = 16
MAX_REQUEST_SIZE_MB = 50
MAX_CONCURRENT_REQUESTS = 100

# =============================================================================
# CONFIGURAÇÕES DE MODELOS HUGGINGFACE
# =============================================================================

# Modelos padrão para cada funcionalidade (CPU-optimized)
DEFAULT_MODELS: Dict[str, str] = {
    "classify": "neuralmind/bert-base-portuguese-cased",
    "embed": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "pos_tag": "pierreguillou/bert-base-cased-pt-lenerbr",
    "deepseek-r1-qwen-7b": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",  # LLM distilado para reasoning
    "am-thinking-v1": "a-m-team/AM-Thinking-v1",  # LLM 32B reasoning
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
MODEL_CACHE_TTL = 3600  # 1 hora
MODEL_MEMORY_CACHE_SIZE = 3  # Máximo de modelos em memória simultaneamente
CACHE_MAX_SIZE = 1000
CACHE_TTL_SECONDS = 3600

# =============================================================================
# CONFIGURAÇÕES CPU-ONLY
# =============================================================================

# CPU optimization settings
TORCH_DEVICE = "cpu"
DEVICE = TORCH_DEVICE  # Compatibilidade retroativa para scripts/testes legados
TORCH_THREADS = 8  # Optimize for CPU cores
USE_GPU = False
FORCE_CPU_ONLY = True

# Configurações de threading para CPU
CPU_THREADS = int(os.getenv("CPU_THREADS", "8"))
TORCH_NUM_THREADS = CPU_THREADS

# =============================================================================
# PATHS E ARMAZENAMENTO (seguindo padrão /media/data)
# =============================================================================

# Paths (seguindo padrão Slice/ALIVE)
BASE_DIR = "/media/data/llvm/general"
MODELS_DIR = os.path.join(BASE_DIR, "models")
CACHE_DIR = os.path.join(BASE_DIR, "cache")
LOGS_DIR = os.path.join(BASE_DIR, "logs")

# Garantir que todos os diretórios existem (plug-and-play)
for d in [BASE_DIR, MODELS_DIR, CACHE_DIR, LOGS_DIR]:
    os.makedirs(d, exist_ok=True)

# Timeout padrão (em segundos)
DEFAULT_TIMEOUT = 120

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
    os.path.expanduser("~"), ".cache", "slice-providers", "models"
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
    "usage": {"total_tokens": 10},
}

# =============================================================================
# VALIDATION: Este arquivo contém APENAS constantes
# Funções helper devem estar em server/utils/ conforme CONCEPTS.md
# =============================================================================

# Modelos padrão para compatibilidade retroativa
MODELS = DEFAULT_MODELS  # Compatibilidade para scripts/health check legados
