"""
Arquivo de constantes do projeto Command-R (Slice/ALIVE).

- Centraliza todos os valores configuráveis: paths, portas, timeouts, etc.
- Não usar .env para configs críticas; edite este arquivo diretamente para máxima rastreabilidade.
- Siga o padrão Slice/ALIVE: clareza, versionamento e facilidade de setup.
"""

import os

# Server configuration
SERVER_PORT = 11543  # Porta alta para evitar conflitos e seguir padrão enterprise Slice/ALIVE
SERVER_HOST = "0.0.0.0"
SERVER_NAME = "slice-command-server"
API_VERSION = "v1"

# Model configuration (CPU-optimized for Command-R)
MODEL_VARIANTS = [
    "command-r-small",   # Modelo leve, rápido, baixo consumo
    "command-r-medium",  # Equilíbrio entre performance e qualidade
    "command-r-large"    # Respostas mais elaboradas, maior contexto
]
MODEL_NAME = "command-r-small"  # Default
MODEL_VERSION = "latest"
MAX_TOKENS_DEFAULT = 4096
TEMPERATURE_DEFAULT = 0.7
TOP_P_DEFAULT = 0.9

# CPU optimization settings
TORCH_DEVICE = "cpu"
TORCH_THREADS = 8  # Optimize for CPU cores
USE_GPU = False
FORCE_CPU_ONLY = True

# Cache configuration
CACHE_MAX_SIZE = 1000
CACHE_TTL_SECONDS = 3600

# Request limits
MAX_REQUEST_SIZE_MB = 50
REQUEST_TIMEOUT_SECONDS = 300
MAX_CONCURRENT_REQUESTS = 100

# Paths
BASE_DIR = '/media/data/llvm/command'
MODELS_DIR = os.path.join(BASE_DIR, 'models')
CACHE_DIR = os.path.join(BASE_DIR, 'cache')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')

# Garantir que todos os diretórios existem (plug-and-play)
for d in [BASE_DIR, MODELS_DIR, CACHE_DIR, LOGS_DIR]:
    os.makedirs(d, exist_ok=True)

# Timeout padrão (em segundos)
DEFAULT_TIMEOUT = 120

# Health check
HEALTH_CHECK_TIMEOUT = 30

# OpenAI API compatibility
OPENAI_API_BASE_PATH = "/v1"
SUPPORTED_ENDPOINTS = [
    "/chat/completions",
    "/completions",
    "/embeddings",
    "/models"
]

INTERNAL_ERROR_CODE = 500

PORT_MIN = 1024
PORT_MAX = 65535

BAD_REQUEST_ERROR_CODE = 400
SERVICE_UNAVAILABLE_ERROR_CODE = 503

COMPLETION_ID_EXAMPLE = "cmpl-123"
CREATED_TIMESTAMP_EXAMPLE = 1234567890
PROMPT_TOKENS_EXAMPLE = 10
COMPLETION_TOKENS_EXAMPLE = 20
TOTAL_TOKENS_EXAMPLE = 30
