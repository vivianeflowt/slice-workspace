# Model Downloader v2.0 - OpenAI Standards

Sistema de download de modelos refatorado seguindo padrões da OpenAI, com aliases de modelos, tratamento robusto de erros e otimizações para evitar travamentos da máquina.

## 🚀 Principais Melhorias

### ✅ Padrão OpenAI
- **Aliases de modelos**: `gpt-3.5-turbo-instruct`, `embedding-ada-002`, etc.
- **Tipos de modelo estruturados**: `text-embedding`, `chat-completion`, `instruct`
- **Metadata completa**: context_length, parameters, description
- **API consistente** com padrões da indústria

### ✅ Recursos Anti-Travamento
- **Download sem carregamento**: Apenas arquivos, não carrega modelos na RAM
- **Prioridade baixa**: CPU e I/O com prioridade mínima
- **Single-thread**: Evita sobrecarga do sistema
- **Validação inteligente**: Verifica arquivos sem carregar modelos

### ✅ Robustez e Confiabilidade
- **Tratamento de erros abrangente**: Try/catch em todas as operações
- **Retry com backoff exponencial**: Retentas inteligentes
- **Validação de arquivos**: Verificação de integridade
- **Logging estruturado**: Logs detalhados para debugging

## 📖 Como Usar

### Comandos Básicos

```bash
# Listar modelos disponíveis
python3 server/utils/model_downloader.py list

# Ver todos os aliases
python3 server/utils/model_downloader.py aliases

# Baixar um modelo específico (por ID ou alias)
python3 server/utils/model_downloader.py download embedding-ada-002
python3 server/utils/model_downloader.py download ada-002  # Mesmo modelo, via alias

# Baixar todos os modelos padrão
python3 server/utils/model_downloader.py download-all

# Limpar cache (arquivos temporários)
python3 server/utils/model_downloader.py cleanup
```

### Uso Programático

```python
import asyncio
from server.utils.model_downloader import ModelDownloader

async def main():
    downloader = ModelDownloader()

    # Baixar um modelo
    result = await downloader.download_model("embedding-ada-002")
    if result.status == "completed":
        print(f"✅ Download concluído: {result.path}")

    # Baixar múltiplos modelos
    models = ["ada-002", "gpt-3.5-instruct", "classifier-roberta"]
    results = await downloader.download_multiple_models(models)

    # Verificar se um modelo está baixado
    if downloader.is_model_downloaded("embedding-large"):
        print("Modelo já disponível localmente")

asyncio.run(main())
```

## 🏷️ Modelos Disponíveis

### Text Embedding
- **embedding-ada-002** (aliases: `text-embedding-ada-002`, `ada-002`)
  - HuggingFace: `sentence-transformers/all-MiniLM-L6-v2`
  - Parâmetros: 23M, Context: 512 tokens

- **embedding-large** (aliases: `text-embedding-large`, `mpnet-base`)
  - HuggingFace: `sentence-transformers/all-mpnet-base-v2`
  - Parâmetros: 109M, Context: 514 tokens

### Chat/Instruct
- **gpt-3.5-turbo-instruct** (aliases: `gpt-3.5-instruct`, `turbo-instruct`)
  - HuggingFace: `microsoft/DialoGPT-medium`
  - Parâmetros: 345M, Context: 4096 tokens

### Text Classification
- **text-classifier-roberta** (aliases: `classifier-roberta`, `sentiment-roberta`)
  - HuggingFace: `cardiffnlp/twitter-roberta-base-sentiment-latest`
  - Parâmetros: 125M, Context: 512 tokens

## 🔧 Configuração Avançada

### Cache Directory
Por padrão, os modelos são salvos em `~/.cache/slice_models`. Para mudar:

```python
downloader = ModelDownloader(cache_dir="/media/data/models")
```

### Adicionar Novos Modelos

```python
from server.utils.model_downloader import ModelSpec, ModelType

# Definir um novo modelo
new_model = ModelSpec(
    id="my-custom-model",
    name="My Custom Model",
    model_type=ModelType.TEXT_EMBEDDING,
    huggingface_id="organization/model-name",
    description="Custom model description",
    context_length=1024,
    parameters="50M",
    aliases=["custom-model", "my-model"]
)

# Registrar o modelo
downloader.registry.register_model(new_model)
```

## 🛠️ Troubleshooting

### Problema: Downloads ainda travam
**Solução**: Verifique se o `psutil` está instalado:
```bash
pip install psutil huggingface-hub
```

### Problema: Modelos não encontrados
**Solução**: Use o comando `list` para ver modelos disponíveis:
```bash
python3 server/utils/model_downloader.py list
```

### Problema: Espaço em disco
**Solução**: Use cleanup regularmente:
```bash
python3 server/utils/model_downloader.py cleanup
```

## 🔄 Migração do Sistema Antigo

O sistema mantém compatibilidade, mas agora oferece:

1. **Aliases**: Use nomes familiares como `ada-002` em vez de IDs HuggingFace
2. **Async**: Operações assíncronas para melhor performance
3. **Estrutura**: Dados estruturados em vez de funções soltas
4. **Validação**: Verificação robusta sem carregar modelos

## 📊 Status e Logs

O sistema fornece logs detalhados em formato estruturado:

```
2025-06-28 15:42:16,559 - __main__ - INFO - ✅ Low-resource mode configured
2025-06-28 15:42:16,560 - __main__ - INFO - ✅ I/O priority set to IDLE
2025-06-28 15:42:16,560 - __main__ - INFO - ✅ Process priority set to low
```

Todos os downloads incluem:
- ✅ Status (completed, failed, cached)
- 📁 Caminho local
- 💾 Tamanho em MB
- ⏱️ Duração do download
- ❌ Erros detalhados (se houver)
