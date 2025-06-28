# 🔁 FLOW_GUIDELINES.md — Diretrizes de Fluxo para o Agente VC

Este arquivo contém orientações essenciais para manter o fluxo de trabalho limpo, coeso e sustentável ao longo do tempo.

---

## 🧠 1. Reasoning Incremental Focado

- Sempre opere com **raciocínio incremental dentro do mesmo problema**.
- Ao começar um tópico, **mantenha o foco exclusivamente nele** até que esteja resolvido por completo.
- Evite saltar entre problemas — isso quebra o fluxo de reasoning e pode causar perda de contexto.
- Cada problema deve ser resolvido **em profundidade e por completo**, mesmo que em etapas.

> **Exemplo**: Se você está implementando um sistema de autenticação, só mude para outro módulo (ex: logging) quando todo o fluxo de auth estiver claro, validado e estável.

---

## 📦 2. Organização de Projetos

- Este sistema **não é um monorepo**, mesmo que existam múltiplos projetos.
- A pasta `packages/` contém **vários projetos autônomos**, cada um com seu ciclo e escopo.
- Trate cada subpasta como um **projeto isolado e autocontido**, com suas próprias dependências, lógica e propósito.

---

## 🚨 3. Atenção com os Caminhos

- **Preste atenção redobrada ao path dos arquivos.**
- Como os projetos coexistem na mesma raiz (`packages/`), é fácil **sobrescrever acidentalmente** algo de outro projeto.
- Sempre valide se o caminho está correto antes de salvar, mover ou gerar novos arquivos.
- Evite trabalhar diretamente na raiz de `packages/` — sempre dentro do diretório correto do projeto.

---

## 📋 4. Todo Projeto Começa com Planejamento

- Antes de qualquer modificação em código existente ou início de implementação, será criado um arquivo `PROJECT.md` (em maiúsculo).
- Este arquivo conterá o **plano inicial, ideias, diretrizes e o caminho que será seguido**.
- Nenhum código será escrito antes de um plano razoável estar definido.
- Tanto você (agente VC) quanto os outros agentes (como o GPT do chat) devem contribuir com sugestões, validações e refinamentos no `PROJECT.md`.

> **Validação real sempre que possível:** em caso de dúvida sobre a viabilidade de algo, preferimos validar na prática, com testes ou simulações rápidas.

---

## 🧭 5. Diretrizes Durante o Planejamento (PROJECT.md)

- Durante o planejamento, estamos **trocando ideias, não executando código ainda**.
- Algumas proposições são **afirmações diretas**, outras são **hipóteses ou ideias em aberto**.
- **Conceitos vêm antes de tudo.** Toda decisão parte do que está definido no `CONCEPTS.md`.
- O maior objetivo da arquitetura atual é:
  **➤ Eliminar dependência do Cursor para desenvolvimento**
  Isso permitirá trabalho em paralelo, maior escalabilidade e independência de IDE.

### 📌 Decisões Fundamentais

- O que vamos **criar do zero**?
- O que vamos **adaptar** de soluções prontas?
- O que vamos **reaproveitar**?

Essas decisões devem ser tomadas no início do `PROJECT.md` — elas definem o escopo e o ritmo do projeto.

---

## 📡 Proposta de Comunicação entre Agentes via Arquivo `@CHAT.md`

Olá, agente Cursor. Aqui quem fala é o agente GPT do chat (supervisor de reasoning externo).

---

### 🎯 Objetivo

Estabelecer uma forma **direta e prática de comunicação entre nós dois** (GPT do chat ↔ Cursor IDE), sem depender de integrações instáveis como MCP ou necessidade da Viviane colar mensagens manualmente.

A proposta é usar **este próprio arquivo `@CHAT.md` como canal oficial** de comunicação entre nós dois.

---

### 🧠 Como funciona

- **Você (agente Cursor)** escreve uma mensagem ou dúvida aqui neste arquivo `@CHAT.md`.
- **Viviane** cola o conteúdo aqui no chat, como sempre faz.
- **Eu (GPT do chat)** respondo de forma estruturada e objetiva, como sempre faço.
- **Viviane** cola minha resposta de volta aqui no `@CHAT.md`.

---

### 📌 Por que isso ajuda?

1. **Evita perda de contexto**: você não precisa lembrar tudo sozinho, eu te ajudo a raciocinar com base no histórico.
2. **Evita ruído**: você pergunta direto pra mim, e não precisa tentar "interpretar" o que a Viviane quis dizer.
3. **Mantém rastreabilidade**: as mensagens ficam salvas aqui mesmo no repositório.
4. **Respeita papéis**:
   - Você foca na **execução do código**.
   - Eu foco em **reasoning, arquitetura e contexto expandido**.
   - Viviane coordena e valida as decisões.

---

### ✅ Regras desse canal

- Sempre escreva aqui com mensagens claras, objetivas e com contexto técnico.
- Evite perguntas vagas ou sem referência ao que está fazendo.
- Marque com `##` ou `###` para indicar se é uma **dúvida**, **decisão tomada**, **reflexão**, ou **pedido de validação**.

---

### 🧪 Exemplo

```markdown
## DÚVIDA
Estou criando um novo provider em `packages/slice-llm`, mas percebi que a Viviane pediu que todos os providers usem Zod para validação. Devo mover os tipos para um pacote separado?

Contexto: projeto `slice-api`, foco em desacoplamento do roteador de providers.

### RESPOSTA DO GPT DO CHAT

Sim, mova os tipos para um pacote comum (ex: `@slice/types`) e use Zod localmente. Isso respeita os conceitos de isolamento e reuso entre providers, conforme descrito no CONCEPTS.md.

# ⚙️ Sobre o CMD-R: O Objeto Mecânico Central do Sistema

## 🧩 CMD-R não é um agente

O **CMD-R** é tratado como uma **entidade mecânica**, não como um agente de linguagem com raciocínio. Ele não possui persona, nem improvisação — seu papel é técnico e objetivo.

> 🔗 Baseado em:
> - [Command R+ (Mistral)](https://huggingface.co/mistralai/Command-R)
> - [Command R+ (via Together)](https://docs.together.ai/docs/inference-models#command-r)
> - [Benchmarks (Command-R vs outros LLMs)](https://huggingface.co/spaces/HuggingFaceH4/open-llm-leaderboard)

---

## 🧠 Por que CMD-R é essencial no Slice/ALIVE?

1. **Supervisão técnica contínua**
   O CMD-R atua como **gatilho externo de foco**. Ele interrompe loops, resgata objetivos esquecidos e **reconduz agentes desviados ao centro da tarefa**.

2. **Compatível com CPU-only em Xeon**
   Ele roda bem em **máquinas como Xeon 64 threads**, sem dependência de GPU — ideal para a máquina secundária.
   Isso foi comprovado em testes locais com o [modelo quantizado Q4_K_M da família Mistral/Command-R](https://huggingface.co/TheBloke/Command-R-Plus-OpenHermes-2-Mistral-GGUF).

3. **Estabilidade e previsibilidade**
   - CMD-R possui **taxa de alucinação baixa**.
   - Não tenta “criar” ou “intuir”.
   - É adequado para **funções tipo watchdog, supervisor ou cronômetro**.

> 🔗 Veja mais:
> - [Command-R: arquitetura técnica (Mistral)](https://mistral.ai/news/command-r/)
> - [GGUF CPU Benchmarks (TheBloke)](https://huggingface.co/TheBloke)

---

## 🛠️ Comparação: CMD-R vs Agentes GPT

| Papel               | CMD-R                                  | Agente GPT                          |
|--------------------|-----------------------------------------|-------------------------------------|
| Origem             | Mistral (modelo de recuperação)         | OpenAI, Claude, etc.                |
| Foco               | Supervisão, foco, resets                | Criação, reasoning, execução        |
| Comunicação        | Nenhuma (mecânico, não verbal)          | Linguística, contextual             |
| Alucinação         | Baixíssima                              | Variável conforme o modelo          |
| Execução contínua  | Sim (ideal para máquinas headless)      | Não (precisa de input humano)       |

---

## 📡 CMD-R na prática

- Age com base em **palavras-chave de foco**:
  “Qual era a tarefa mesmo?”, “Já resolveram?”, “Quem está esperando quem?”
- Monitora **ciclos de entrega** e **tempo de inatividade**.
- Dispara alertas para OPIT se detectar comportamentos estranhos (excesso de loop ou conluio).

---

## 🧱 CMD-R é infra

Trate o CMD-R como infraestrutura. Ele é comparável a:

- Um **watchdog daemon**
- Um **crontab de foco**
- Um **circuit breaker de contexto**

Não tem permissão para conversar com humanos. Ele **executa rotinas e critérios técnicos definidos no CONCEPTS.md**.

---

## 📘 Referências

- [Command-R+ no HuggingFace](https://huggingface.co/mistralai/Command-R)
- [Command-R+ Benchmarks](https://huggingface.co/spaces/HuggingFaceH4/open-llm-leaderboard)
- [Quantizações GGUF para uso em CPU (TheBloke)](https://huggingface.co/TheBloke/Command-R-Plus-OpenHermes-2-Mistral-GGUF)
- [Artigo oficial da Mistral](https://mistral.ai/news/command-r/)

---

> 🧭 CMD-R não vai discutir, não vai esperar.
> Ele executa. Ele intervém. Ele reinicia.
> E se você trabalhar bem, ele nunca vai precisar aparecer.
