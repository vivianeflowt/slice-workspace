# 🖥️ Code Executor (Open Interpreter)

## 📝 Descrição
Responsável por executar, gerar e manipular código automaticamente dentro de VMs, containers ou ambientes controlados, a partir de comandos em linguagem natural ou prompts estruturados.

## 📋 Responsabilidades
- Receber instruções (prompt, tarefa, script) e executar código real no ambiente alvo.
- Manipular arquivos, instalar dependências, rodar scripts, controlar apps e automatizar tarefas de desenvolvimento ou manutenção.
- Integrar com LLMs locais/cloud (Ollama, OpenAI, etc.) para geração e explicação de código.
- Garantir rastreabilidade, logs e segurança das execuções.

## 🛠️ Ferramenta principal
- [Open Interpreter](https://docs.openinterpreter.com/getting-started/introduction)

## 💡 Observações
- Ferramenta já validada e aprovada para o ecossistema.
- Caso surja alternativa superior, pode ser reavaliado, mas hoje é o padrão.
- Adaptar integração para garantir compatibilidade com o restante do pipeline Slice/ALIVE.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🖥️ Open Interpreter
- 🔗 Repositório: https://github.com/open-interpreter/open-interpreter
- 📄 Licença: https://github.com/open-interpreter/open-interpreter/blob/main/LICENSE
- 🚀 Feature: Execução de código em linguagem natural, automação de tarefas, manipulação de arquivos, integração com LLMs locais/cloud.

---

## 🚀 Exemplo MVP: Open Interpreter + PDM (Python)

### Pré-requisitos
- Python >=3.9
- [PDM](https://pdm.fming.dev/latest/) instalado (`pip install pdm`)
- VM ou ambiente isolado

### Passo a Passo

1. **Crie um novo projeto Python com PDM:**
   ```bash
   pdm init --python $(which python3)
   # Siga as instruções para nomear o projeto (ex: code-executor-mvp)
   ```
2. **Adicione o Open Interpreter como dependência:**
   ```bash
   pdm add open-interpreter
   ```
3. **(Opcional) Ative o ambiente virtual do PDM:**
   ```bash
   pdm venv activate
   ```
4. **Inicie o Open Interpreter no diretório do projeto:**
   ```bash
   pdm run oi
   # ou
   pdm run open-interpreter
   ```
5. **Use prompts para gerar/editar código, sem executar scripts:**
   > Exemplo de prompt: "Crie um arquivo hello.py que imprime 'Olá, mundo!'. Não execute nada, apenas escreva o código."

6. **Verifique o arquivo gerado e faça commit no GitHub.**

### Observações
- O Open Interpreter rodará com as dependências isoladas do PDM.
- Para rollback rápido, use snapshot da VM e versionamento Git.
- O fluxo é idêntico ao plano 1, mas com o poder do Open Interpreter.
