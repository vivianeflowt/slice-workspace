"""
Arquivo de constantes do projeto Command-R (Slice/ALIVE).

- Centraliza todos os valores configuráveis: paths, portas, timeouts, etc.
- Não usar .env para configs críticas; edite este arquivo diretamente para máxima rastreabilidade.
- Siga o padrão Slice/ALIVE: clareza, versionamento e facilidade de setup.
"""

# Server configuration
SERVER_PORT = 5143  # Porta alta, próxima do padrão de outros serviços
SERVER_HOST = "0.0.0.0"
SERVER_NAME = "slice-command-server"
API_VERSION = "v1"

# Model configuration (CPU-optimized for Command-R)
MODEL_NAME = "command-r"
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
MODELS_DIR = '/media/data/models'
CACHE_DIR = "./cache"
LOGS_DIR = "./logs"

# Timeout padrão (em segundos)
DEFAULT_TIMEOUT = 60

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
