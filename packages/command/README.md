# Slice Command-R Server

Servidor Command-R compatível com a API OpenAI, desenvolvido para o ecossistema Slice/ALIVE.

## 🚀 Quick Start

```bash
# Setup completo (instala dependências e baixa modelos)
task setup

# Iniciar em modo desenvolvimento
task dev

# Ou iniciar em modo produção
task start
```

O servidor estará disponível em `http://localhost:5143`

## 📋 Funcionalidades

- ✅ **OpenAI API Compatible**: Endpoints `/v1/chat/completions`, `/v1/models`
- ✅ **Command-R Integration**: Modelo Command-R nativo otimizado para CPU
- ✅ **CPU-Only Optimization**: Configurado para máxima performance em CPU
- ✅ **Streaming Support**: Respostas em tempo real via Server-Sent Events
- ✅ **Health Monitoring**: Endpoints de saúde e monitoramento
- ✅ **Type Safety**: Validação completa com Pydantic
- ✅ **Modern Stack**: FastAPI + PDM + async/await

## 🚀 CPU-Only Performance

O Command-R foi especificamente otimizado para CPU, oferecendo:

- **Melhor Performance**: Command-R roda mais eficientemente em CPU que GPU
- **Threading Otimizado**: Configurado para aproveitar múltiplos cores de CPU
- **Memory Efficient**: Otimizado para uso eficiente de RAM
- **No CUDA Required**: Funciona em qualquer máquina sem necessidade de GPU

## 🏗️ Arquitetura

```
server/
├── __init__.py           # Versão e metadados
├── main.py              # Aplicação FastAPI (mínima)
├── config.py            # Configuração e inicialização
├── constants.py         # Todas as constantes centralizadas
├── api/                 # Endpoints organizados por recurso
│   ├── chat.py         # /v1/chat/completions
│   ├── completions.py  # /v1/completions
│   ├── models.py       # /v1/models
│   └── health.py       # /health
├── services/           # Lógica de negócio e integração
│   └── __init__.py    # CommandRService
└── models/            # Schemas Pydantic
    └── __init__.py    # Request/Response models
```

## 🛠️ Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `task setup` | Setup completo (install + check) |
| `task install` | Instalar dependências + baixar modelos |
| `task dev` | Servidor em modo desenvolvimento (reload) |
| `task start` | Servidor em modo produção |
| `task test` | Executar todos os testes |
| `task lint` | Linting e verificação de tipos |
| `task format` | Formatar código automaticamente |
| `task clean` | Limpar arquivos temporários |
| `task check` | Verificar se tudo está funcionando |

## 📡 API Endpoints

### Chat Completions
```bash
POST /v1/chat/completions
Content-Type: application/json

{
  "model": "command-r",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "max_tokens": 100,
  "temperature": 0.7,
  "stream": false
}
```

### Streaming
```bash
POST /v1/chat/completions
Content-Type: application/json

{
  "model": "command-r",
  "messages": [{"role": "user", "content": "Hello!"}],
  "stream": true
}
```

### List Models
```bash
GET /v1/models
```

### Health Check
```bash
GET /health
```

## 📑 Parâmetros dos Endpoints

### /v1/chat/completions e /v1/completions

| Parâmetro     | Tipo                | Obrigatório | Descrição                                                                                 | Exemplo                         |
|---------------|---------------------|-------------|-------------------------------------------------------------------------------------------|---------------------------------|
| model         | string              | Sim         | Nome do modelo a ser usado (ex: command-r-small, command-r-medium, command-r-large)        | "command-r-small"              |
| messages      | array de objetos    | Sim (chat)  | Lista de mensagens (role: system/user/assistant, content: texto, name: opcional)           | [{"role": "user", "content": "Oi"}] |
| prompt        | string/array        | Sim (text)  | Prompt para completar (apenas em /completions)                                             | "Explique o conceito de IA"     |
| max_tokens    | int                 | Não         | Máximo de tokens a gerar                                                                  | 100                             |
| temperature   | float (0.0–2.0)     | Não         | Aleatoriedade da resposta                                                                 | 0.7                             |
| top_p         | float (0.0–1.0)     | Não         | Amostragem nucleus/top-p                                                                 | 1.0                             |
| stream        | bool                | Não         | Se deve usar streaming (resposta em tempo real)                                           | false                           |
| stop          | string/array        | Não         | Sequências de parada para interromper a geração                                            | "\n" ou ["\n", "Fim"]            |

### /v1/embeddings

| Parâmetro     | Tipo                | Obrigatório | Descrição                                                                                 | Exemplo                         |
|---------------|---------------------|-------------|-------------------------------------------------------------------------------------------|---------------------------------|
| input         | string/array        | Sim         | Texto(s) para gerar embedding                                                             | "Texto para embed"              |
| model         | string              | Sim         | Nome do modelo a ser usado                                                                | "command-r-small"              |

> Consulte os exemplos de request acima para ver como montar cada payload.

## ⚙️ Configuração

Todas as configurações estão centralizadas em `server/constants.py`:

```python
# Server
SERVER_PORT = 5143
SERVER_HOST = "0.0.0.0"

# Model (CPU-optimized)
MODEL_NAME = "command-r"
MAX_TOKENS_DEFAULT = 4096
TEMPERATURE_DEFAULT = 0.7

# CPU optimization
TORCH_DEVICE = "cpu"
TORCH_THREADS = 8
USE_GPU = False
FORCE_CPU_ONLY = True

# Paths
MODELS_DIR = '/media/data/models'
CACHE_DIR = "./cache"
LOGS_DIR = "./logs"
```

### CPU-Only Configuration

O servidor está configurado para usar **apenas CPU**, seguindo o Checkpoint #019:

- `FORCE_CPU_ONLY = True`: Força uso exclusivo de CPU
- `CUDA_VISIBLE_DEVICES = ""`: Desabilita acesso à GPU
- `TORCH_THREADS = 8`: Otimiza threads para CPU
- `torch>=2.1.0+cpu`: Versão CPU-only do PyTorch

## 🧪 Testes

O projeto segue uma estratégia rigorosa de testes baseada nos checkpoints:

```bash
# Executar todos os testes
task test

# Executar testes específicos
pdm run pytest tests/test_constants.py -v
pdm run pytest tests/test_api_compliance.py -v
pdm run pytest tests/test_organization.py -v
```

### Cobertura de Testes

- ✅ **Estrutura**: Validação de diretórios e organização
- ✅ **Constantes**: Verificação de valores configuráveis
- ✅ **API**: Compatibilidade com OpenAI API
- ✅ **Organização**: Separação de responsabilidades
- ✅ **Taskfile**: Validação de tasks e comandos

## 🔧 Desenvolvimento

### Requisitos
- Python 3.9+
- PDM (Package manager)
- Task (Task runner)

### Setup para Desenvolvimento
```bash
git clone <repo>
cd packages/command
task setup
```

### Estrutura de Commits
Seguimos o padrão Slice/ALIVE para commits:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `test:` Adição/modificação de testes
- `docs:` Documentação
- `refactor:` Refatoração sem mudança de funcionalidade

### Code Style
- **Linting**: Ruff + Black + MyPy
- **Naming**: Nomes descritivos, evitar variáveis genéricas
- **Performance**: Priorizar código legível e performático
- **Lines**: Mínimo de linhas para resolver problemas

## 🚦 Status do Projeto

### Checkpoints Implementados ✅

1. **#001** - Estrutura de diretórios (`server/`, `tests/`)
2. **#002** - Taskfile completo com download de modelos
3. **#003** - Organização modular (anti-pattern "pythonzeira")
4. **#006** - PDM como gerenciador de pacotes
5. **#008** - Porta definida em constants (não .env)
6. **#009** - Constantes centralizadas (sem números mágicos)
7. **#010** - Taskfile como interface principal
8. **#011** - Compatibilidade com OpenAI API
9. **#013** - Estrutura de pastas seguindo boas práticas

### Em Desenvolvimento 🔄

- **Checkpoint #004/005** - Funções puras e robustez máxima
- **Checkpoint #014** - Encapsulamento do modelo Command-R
- **Checkpoint #017** - Cache e load balancing

### Futuro 📋

- Integração real com modelo Command-R
- Sistema de cache avançado
- Métricas e observabilidade
- Deploy automatizado

## 🤝 Contribuição

1. Siga os checkpoints definidos em `PROJECT.md`
2. Execute `task check` antes de commits
3. Adicione testes para novas funcionalidades
4. Mantenha a documentação atualizada

## 📚 Links Úteis

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PDM Documentation](https://pdm.fming.dev/)
- [Task Documentation](https://taskfile.dev/)

## 🧠 Modelos Disponíveis

Todos os modelos são otimizados para CPU e seguem a convenção de nomes baseada no tamanho:

- `"command-r-small"`   — Modelo leve, ideal para respostas rápidas e baixo consumo de memória.
- `"command-r-medium"`  — Equilíbrio entre performance e qualidade.
- `"command-r-large"`   — Mais capacidade, respostas mais elaboradas e maior contexto.

> **Nota:** Consulte o endpoint `/v1/models` para ver quais variantes estão carregadas no momento.

### Exemplo de uso:
```json
{
  "model": "command-r-small",
  "messages": [
    {"role": "user", "content": "Olá, tudo bem?"}
  ],
  "max_tokens": 100
}
```
