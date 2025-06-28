# 🧠 Modelos para Agente Autônomo - Etapas + Modelos + Prompts

Este documento descreve **cada etapa** de um agente inteligente (inspirado no GitHub Copilot), com:

- O modelo ideal para executar a etapa
- Link para o Hugging Face
- Prompt base sugerido

---

## ✅ Etapa 1: Parser / Interpreter

### 🧩 Objetivo

Interpretar a intenção do usuário, extrair comandos, parâmetros, objetivos e restrições.

### 🧠 Modelo Sugerido

**AM-Thinking-v1**

- Hugging Face: [https://huggingface.co/AlignMind/AM-Thinking-v1](https://huggingface.co/AlignMind/AM-Thinking-v1)
- Foco: Raciocínio interpretativo e semântico.

### 🧾 Prompt Base

```
Você é um interpretador de comandos para um sistema de automação. A entrada a seguir contém uma tarefa escrita por um humano. Extraia:
1. Intenção principal
2. Parâmetros e arquivos relevantes
3. Restrições técnicas
4. Objetivo final

Entrada: "{input}"
```

---

## ✅ Etapa 2: Planner / Decomposição

### 🧩 Objetivo

Planejar a tarefa em subtarefas organizadas com dependências, sequência e critérios de sucesso.

### 🧠 Modelo Sugerido

**DeepSeek-R1-Zero**

- Hugging Face: [https://huggingface.co/deepseek-ai/DeepSeek-VL-7B-Chat](https://huggingface.co/deepseek-ai/DeepSeek-VL-7B-Chat)
- Foco: Decomposição de tarefas, raciocínio step-by-step e planejamento técnico.

### 🧾 Prompt Base

```
Você é um planejador de tarefas para um agente autônomo. Dada uma tarefa interpretada, produza um plano com:
1. Subtarefas sequenciais
2. Dependências entre etapas
3. Resultado esperado de cada etapa

Tarefa interpretada: "{interpreted_input}"
```

---

## ✅ Etapa 3: Feedback / Reflexão

### 🧩 Objetivo

Analisar resultados parciais ou finais, validar saída, identificar erros e replanejar.

### 🧠 Modelos Sugeridos

- **AM-Thinking-v1**: Análise semântica e crítica

- **DeepSeek-R1-Zero**: Replanejamento e correção técnica

- Links:
  
  - [AM-Thinking-v1](https://huggingface.co/AlignMind/AM-Thinking-v1)
  - [DeepSeek-R1-Zero](https://huggingface.co/deepseek-ai/DeepSeek-VL-7B-Chat)

### 🧾 Prompt Base

```
Você é responsável por revisar o resultado de uma execução. Analise:
1. Se o resultado atinge o objetivo
2. Quais falhas foram observadas
3. O que precisa ser ajustado no plano
4. Qual novo passo deve ser executado

Resultado atual: "{partial_output}"
Objetivo: "{original_goal}"
```

---

## 🧩 Observações Finais

- O ModelFusion pode ser usado como orquestrador para interligar essas etapas com os modelos.
- Cada etapa pode ser tratada como um módulo independente, acoplado via API.
- Os prompts podem ser ajustados para refletir o estilo da aplicação Slice/ALIVE.
  
  
  [GitHub - agno-agi/agno: Full-stack framework for building Multi-Agent Systems with memory, knowledge and reasoning.](https://github.com/agno-agi/agno/tree/main)
