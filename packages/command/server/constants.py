"""
Arquivo de constantes do projeto Command-R (Slice/ALIVE).

- Centraliza todos os valores configuráveis: paths, portas, timeouts, etc.
- Não usar .env para configs críticas; edite este arquivo diretamente para máxima rastreabilidade.
- Siga o padrão Slice/ALIVE: clareza, versionamento e facilidade de setup.
"""

# Porta padrão do servidor
SERVER_PORT = 5143  # Porta alta, próxima do padrão de outros serviços

# Diretório central de modelos
MODELS_DIR = '/media/data/models'

# Timeout padrão (em segundos)
DEFAULT_TIMEOUT = 60

# Outros valores configuráveis podem ser adicionados abaixo...
