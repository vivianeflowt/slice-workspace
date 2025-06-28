# 🏭 Slice/ALIVE Providers Server

> **Enterprise HuggingFace Providers Server (CPU-only) para o ecossistema Slice/ALIVE**
> Seguindo rigorosamente os princípios definidos em [CONCEPTS.md](docs/CONCEPTS.md)

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![CPU Only](https://img.shields.io/badge/CPU-Only-orange.svg)](https://pytorch.org/)
[![Enterprise](https://img.shields.io/badge/Enterprise-Ready-success.svg)](/)
[![CONCEPTS](https://img.shields.io/badge/CONCEPTS-Compliant-blue.svg)](docs/CONCEPTS.md)

## 🎯 Arquitetura por Função (não por modelo)

- **🎯 Classificação** (`/classify`) - Análise de sentimento, categorização
- **🧠 Embeddings** (`/embed`) - Representações vetoriais para similaridade
- **📝 POS Tagging** (`/pos_tag`) - Análise morfossintática
- **🔌 API Enterprise** - Validação JSON Schema, health checks, monitoramento
- **💻 CPU-only** - Baixo recurso, offline-first, open source
- **� Plug-and-Play** - `task install` e pronto para uso

## 🚀 Plug-and-Play (CLP Industrial)

```bash
# 1. Clone e entre no diretório
git clone <repo-url>
cd packages/providers

# 2. Instalação automática (< 5 min)
task install

# 3. Servidor rodando (localhost:8000)
task start
```

**Meta:** Do clone ao servidor funcionando em menos de 5 minutos, seguindo o princípio de **Plug-and-Play Total**.

## 📋 Taskfile Enterprise

O Taskfile controla **todo** o ciclo de vida do servidor:

| Task | Descrição | Princípio CONCEPTS.md |
|------|-----------|----------------------|
| `task install` | Instalação plug-and-play completa | Plug-and-Play Total |
| `task dev` | Desenvolvimento com hot reload | Incrementalismo |
| `task start` | Produção estável | Baixo Recurso |
| `task test` | Testes automatizados | Validação Forte |
| `task lint` | Linting e formatação | Validação Forte |
| `task validate` | Validação completa | Validação Antes Padronização |
| `task health` | Health check do sistema | Isolamento por Camada |
| `task models` | Gerenciamento de modelos | Baixo Recurso |
| `task clean` | Limpeza de temporários | Baixo Recurso |
| `task reset` | Restauração rápida (< 30min) | Restauração Rápida |
| `task logs` | Visualização de logs | Isolamento por Camada |
| `task shell` | Shell interativo | Documentação Incremental |
| `task deps` | Análise de dependências/licenças | Curadoria de Licença |
| `task benchmark` | Performance dos modelos | Justificativa Real |

# Geração de embedding
curl -X POST "http://localhost:5115/api/v1/embed" \
  -H "Content-Type: application/json" \
  -d '{"text": "Análise semântica de texto", "normalize": true}'

# POS tagging
curl -X POST "http://localhost:5115/api/v1/pos-tag" \
  -H "Content-Type: application/json" \
  -d '{"text": "O gato subiu no telhado."}'
```

## 📚 Documentação Incremental

> **CONCEPTS.md**: Documentação incremental e machine-readable

### 📖 Documentos Disponíveis

| Documento | Descrição | Princípio |
|-----------|-----------|-----------|
| **[📋 CONCEPTS.md](docs/CONCEPTS.md)** | Princípios fundamentais do ecossistema | Base de tudo |
| **[🔌 API.md](docs/API.md)** | Referência completa da API com exemplos | Documentação Incremental |
| **[📜 LICENSE_AUDIT.md](docs/LICENSE_AUDIT.md)** | Curadoria de licenças das dependências | Curadoria de Licença |

### 🔌 Endpoints Principais

| Endpoint | Método | Descrição | Documentação |
|----------|--------|-----------|--------------|
| `/api/v1/classify` | POST | Classificação de texto | [Ver exemplos](docs/API.md#classificação-de-texto) |
| `/api/v1/embed` | POST | Geração de embeddings | [Ver exemplos](docs/API.md#embeddings-de-texto) |
| `/api/v1/pos_tag` | POST | POS tagging | [Ver exemplos](docs/API.md#pos-tagging) |
| `/health` | GET | Status do serviço | [Ver exemplos](docs/API.md#health-check) |
| `/docs` | GET | Documentação Swagger | Auto-gerada |

### Classificação de Texto

```python
import requests

# Classificação padrão
response = requests.post("http://localhost:5115/api/v1/classify", json={
    "text": "Adorei este filme, muito bom!",
    "language": "pt"
})

# Zero-shot classification
response = requests.post("http://localhost:5115/api/v1/classify", json={
    "text": "Este notebook tem ótima performance",
    "language": "pt",
    "labels": ["tecnologia", "culinária", "esportes"]
})
```

### Geração de Embeddings

```python
# Embedding único
response = requests.post("http://localhost:5115/api/v1/embed", json={
    "text": "Processamento de linguagem natural",
    "normalize": True
})

# Múltiplos embeddings
response = requests.post("http://localhost:5115/api/v1/embed/multi", json={
    "texts": ["Texto 1", "Texto 2", "Texto 3"],
    "normalize": True
})

# Similaridade entre textos
response = requests.post("http://localhost:5115/api/v1/embed/similarity",
    params={
        "text1": "Gato subiu no telhado",
        "text2": "Felino escalou o teto",
        "normalize": True
    }
)
```

### POS Tagging

```python
# POS tagging básico
response = requests.post("http://localhost:5115/api/v1/pos-tag", json={
    "text": "O menino jogou bola no parque.",
    "return_tokens": True
})

# Análise estrutural
response = requests.post("http://localhost:5115/api/v1/pos-tag/analyze",
    params={"text": "A empresa desenvolveu uma solução inovadora."}
)
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
task dev          # Inicia servidor em modo desenvolvimento
task test         # Executa todos os testes
task test-unit    # Apenas testes unitários
task lint         # Verifica código (black, isort, flake8, mypy)
task format       # Formata código automaticamente

# Produção
task start        # Inicia servidor em modo produção
task install      # Instala dependências e modelos

# Utilitários
task clean        # Remove arquivos temporários
task models       # Lista modelos baixados
task validate     # Validação completa do projeto
```

## 🏗️ Arquitetura

### Estrutura Funcional

O projeto segue o princípio de **organização por funcionalidade**, não por modelo:

```
server/
├── api/                    # APIs REST por função
│   ├── classify.py         # Endpoints de classificação
│   ├── embed.py            # Endpoints de embeddings
│   └── pos_tag.py          # Endpoints de POS tagging
├── providers/              # Providers por função
│   ├── classify/           # Providers de classificação
│   ├── embed/              # Providers de embeddings
│   └── pos_tag/            # Providers de POS tagging
├── models/                 # Schemas Pydantic
├── services/               # Lógica de negócio
├── utils/                  # Utilitários (download, cache, etc)
├── constants.py            # Configurações centralizadas
└── main.py                 # FastAPI app
```

### Vantagens da Arquitetura

- **🔌 Plugabilidade** - Trocar modelos sem quebrar código
- **🎯 Foco funcional** - Código organizado por funcionalidade
- **🧪 Testabilidade** - Cada função isolada e testável
- **📈 Escalabilidade** - Adicionar funções sem afetar existentes
- **🔧 Manutenibilidade** - Evolução incremental e segura

## 🤖 Modelos Suportados

### Classificação
- **Padrão**: `neuralmind/bert-base-portuguese-cased`
- **Alternativas**:
  - `rufimelo/Legal-BERTimbau-base`
  - `pierreguillou/bert-base-cased-pt-lenerbr`

### Embeddings
- **Padrão**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- **Alternativas**:
  - `sentence-transformers/distiluse-base-multilingual-cased`
  - `neuralmind/bert-base-portuguese-cased`

### POS Tagging
- **Padrão**: `pierreguillou/bert-base-cased-pt-lenerbr`
- **Alternativas**:
  - `neuralmind/bert-base-portuguese-cased`

> 💡 **Dica**: Use `GET /api/v1/{function}/models` para listar todos os modelos disponíveis.

## 🔒 Compatibilidade OpenAI

O servidor oferece endpoints compatíveis com a API OpenAI:

```python
# Compatível com OpenAI Chat Completions
response = requests.post("http://localhost:5115/v1/chat/completions", json={
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "user", "content": "Este produto é bom ou ruim?"}
    ]
})

# Compatível com OpenAI Embeddings
response = requests.post("http://localhost:5115/v1/embeddings", json={
    "input": "Texto para embedding",
    "model": "text-embedding-ada-002"
})
```

## 🧪 Testes

O projeto inclui uma suíte completa de testes automatizados:

```bash
# Executa todos os testes
task test

# Testes por categoria
pytest tests/test_structure.py -v      # Validação de estrutura
pytest tests/test_cpu_only.py -v       # Validação CPU-only
pytest tests/test_pure_logic.py -v     # Lógica de negócio

# Com cobertura
task test-coverage
```

### Tipos de Teste

- **🏗️ Estruturais** - Validam organização e arquitetura
- **💻 CPU-only** - Garantem execução apenas em CPU
- **🧠 Lógica pura** - Testam funcionalidades isoladamente
- **🔗 Integração** - Validam APIs e fluxos completos
- **🚀 Performance** - Verificam tempos de resposta

## 🐳 Docker & Deploy

```dockerfile
# Exemplo de Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install pdm && pdm install --prod
RUN python -c "from server.utils.model_downloader import download_default_models; download_default_models()"

EXPOSE 5115
CMD ["pdm", "run", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "5115"]
```

```bash
# Build e run
docker build -t slice-providers .
docker run -p 5115:5115 slice-providers
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Servidor
export PROVIDERS_PORT=5115
export PROVIDERS_HOST=0.0.0.0
export DEBUG=false
export LOG_LEVEL=INFO

# Performance
export CPU_THREADS=4
export MODEL_CACHE_DIR=/path/to/cache

# Desenvolvimento
export DEBUG=true
export LOG_LEVEL=DEBUG
```

### Customização de Modelos

```python
# server/constants.py
DEFAULT_MODELS = {
    "classify": "seu-modelo-de-classificacao",
    "embed": "seu-modelo-de-embeddings",
    "pos_tag": "seu-modelo-de-pos-tagging",
}
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **feature branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### Guidelines

- ✅ Escreva testes para novas funcionalidades
- ✅ Siga organização funcional (não por modelo)
- ✅ Use typehints e docstrings
- ✅ Mantenha CPU-only enforcement
- ✅ Valide com `task validate`

## 📊 Status & Roadmap

### ✅ Implementado

- [x] Estrutura modular funcional
- [x] Providers de classificação, embeddings e POS tagging
- [x] APIs REST com validação Pydantic
- [x] Compatibilidade OpenAI
- [x] CPU-only enforcement
- [x] Cache de modelos
- [x] Testes automatizados
- [x] Documentação Swagger

### 🚧 Em Desenvolvimento

- [ ] Cache distribuído (Redis)
- [ ] Métricas de performance (Prometheus)
- [ ] Rate limiting
- [ ] Autenticação JWT
- [ ] Suporte a múltiplos idiomas

### 🔮 Futuro

- [ ] Fine-tuning personalizado
- [ ] Pipeline de ML completo
- [ ] Monitoramento avançado
- [ ] Deployment Kubernetes
- [ ] Edge computing support

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📖 **Documentação**: `/docs` (Swagger UI)
- 🐛 **Issues**: [GitHub Issues](https://github.com/slice/providers/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/slice/providers/discussions)
- 📧 **Email**: dev@slice.com

---

<div align="center">
  <strong>Desenvolvido com ❤️ para o ecossistema Slice/ALIVE</strong>
  <br>
  <em>Democratizando NLP em português para todos!</em>
</div>
