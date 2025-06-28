# 🚀 Guia de Instalação e Configuração

Este guia explica como instalar e configurar o **Slice Providers - HuggingFace NLP Server**.

## ⚡ Instalação Rápida

### 1. Pré-requisitos

```bash
# Verificar Python 3.10+
python3 --version

# Instalar PDM (gerenciador de dependências)
curl -sSL https://raw.githubusercontent.com/pdm-project/pdm/main/install-pdm.py | python3 -

# Ou via pip
pip install pdm

# Instalar Task (task runner)
# Ubuntu/Debian
sudo apt install task-runner

# macOS
brew install go-task/tap/go-task

# Ou baixar binário: https://taskfile.dev/installation/
```

### 2. Configuração do Projeto

```bash
# Navegar para o diretório
cd packages/providers

# Instalar dependências e baixar modelos (pode demorar!)
task install

# ⏳ Este comando irá:
# - Instalar todas as dependências Python via PDM
# - Baixar modelos HuggingFace (~2-3GB total)
# - Configurar cache local de modelos
```

### 3. Primeira Execução

```bash
# Iniciar servidor em modo desenvolvimento
task dev

# ✅ Se bem-sucedido, você verá:
# 🚀 Iniciando Slice Providers Server...
# 📡 Servidor: 0.0.0.0:5115
# 💻 CPU-only mode: True
# 📦 Modelos baixados: 3
```

### 4. Testar API

```bash
# Em outro terminal, teste a API
curl http://localhost:5115/health

# Deve retornar algo como:
# {
#   "status": "healthy",
#   "version": "0.1.0",
#   "models": {
#     "classify": true,
#     "embed": true,
#     "pos_tag": true
#   }
# }
```

## 🔧 Resolução de Problemas

### Erro: "ModuleNotFoundError"

```bash
# Certifique-se de que PDM instalou as dependências
pdm list

# Se não, reinstale
task install

# Ou manualmente
pdm install
```

### Erro: "Failed to download model"

```bash
# Verifique conexão com internet
ping huggingface.co

# Tente download manual dos modelos
python3 -c "from server.utils.model_downloader import download_default_models; download_default_models()"

# Limpe cache se necessário
rm -rf ~/.cache/huggingface
```

### Erro: "CUDA out of memory" ou similar

```bash
# O servidor deve forçar CPU-only, mas se houver problemas:
export CUDA_VISIBLE_DEVICES=""
export FORCE_CPU_ONLY=true

# Reinicie o servidor
task dev
```

### Porta 5115 já está em uso

```bash
# Mude a porta via variável de ambiente
export PROVIDERS_PORT=5116
task dev

# Ou edite server/constants.py
```

## 🧪 Validação da Instalação

### Execute os testes

```bash
# Testes básicos de estrutura
task test-unit

# Todos os testes (pode demorar)
task test

# Se algum teste falhar, verifique:
# 1. Todas as dependências instaladas
# 2. Modelos baixados corretamente
# 3. Permissões de arquivo
```

### Teste manual das funcionalidades

```bash
# 1. Classificação
curl -X POST "http://localhost:5115/api/v1/classify" \
  -H "Content-Type: application/json" \
  -d '{"text": "Este produto é excelente!"}'

# 2. Embeddings
curl -X POST "http://localhost:5115/api/v1/embed" \
  -H "Content-Type: application/json" \
  -d '{"text": "Processamento de linguagem natural"}'

# 3. POS Tagging
curl -X POST "http://localhost:5115/api/v1/pos-tag" \
  -H "Content-Type: application/json" \
  -d '{"text": "O gato subiu no telhado."}'
```

## 📊 Monitoramento

### Verificar status do servidor

```bash
# Health check completo
curl http://localhost:5115/health | jq

# Informações do sistema
curl http://localhost:5115/info | jq

# Documentação da API
open http://localhost:5115/docs
```

### Verificar uso de recursos

```bash
# Modelos em cache
task models

# Limpar cache se necessário
task clean

# Logs do servidor (modo dev mostra no terminal)
# Em produção, verificar logs em /var/log/ ou similar
```

## 🔐 Configuração de Produção

### Variáveis de ambiente recomendadas

```bash
# .env.production
export PROVIDERS_PORT=5115
export PROVIDERS_HOST=0.0.0.0
export DEBUG=false
export LOG_LEVEL=INFO
export CPU_THREADS=4
export MODEL_CACHE_DIR=/opt/slice/models
```

### Executar em produção

```bash
# Servidor de produção (sem reload)
task start

# Ou com configurações específicas
uvicorn server.main:app --host 0.0.0.0 --port 5115 --workers 1
```

### Docker (opcional)

```bash
# Build da imagem
docker build -t slice-providers .

# Run do container
docker run -d -p 5115:5115 --name slice-providers slice-providers

# Verificar logs
docker logs slice-providers
```

## 📈 Performance e Tuning

### Otimizações de CPU

```bash
# Configurar threads para sua CPU
export CPU_THREADS=$(nproc)  # Usa todos os cores
export OMP_NUM_THREADS=$CPU_THREADS
export MKL_NUM_THREADS=$CPU_THREADS
```

### Cache de modelos

```bash
# Pré-carregar todos os modelos na inicialização
# (reduz latência da primeira requisição)
curl http://localhost:5115/api/v1/classify/info
curl http://localhost:5115/api/v1/embed/info
curl http://localhost:5115/api/v1/pos-tag/info
```

### Monitoramento de recursos

```bash
# Monitorar uso de CPU/memória
htop

# Monitorar requisições
tail -f /var/log/slice-providers.log

# Métricas via API
curl http://localhost:5115/info | jq '.system'
```

## 🆘 Suporte

### Se nada funcionar

1. **Verifique logs detalhados**:
   ```bash
   export DEBUG=true
   export LOG_LEVEL=DEBUG
   task dev
   ```

2. **Execute validação completa**:
   ```bash
   task validate
   ```

3. **Reinstale do zero**:
   ```bash
   task clean
   rm -rf .pdm.toml
   rm -rf __pycache__
   task install
   ```

4. **Abra uma issue** com:
   - OS e versão Python
   - Logs de erro completos
   - Output de `task validate`
   - Output de `pdm list`

### Recursos adicionais

- 📖 **Documentação completa**: `http://localhost:5115/docs`
- 🐛 **Report bugs**: GitHub Issues
- 💬 **Discussões**: GitHub Discussions
- 📧 **Email**: dev@slice.com

---

**🎉 Sucesso!** Se chegou até aqui e tudo está funcionando, você tem um servidor NLP completo rodando em português!

Próximos passos:
- Explore a documentação em `/docs`
- Teste diferentes modelos de cada função
- Integre com suas aplicações
- Contribua com melhorias!
