# 🚀 Frontend — Project Manager

## 🧩 Visão de Produto: IDE de Arquitetura, Gestão e Automação

O objetivo central deste projeto é criar uma plataforma que una o poder de uma IDE visual, gestão de projetos, automação de tarefas e colaboração com múltiplas IAs, tudo em uma única interface moderna, flexível e extensível.

### 💡 Comportamento e Inspiração
- 🖥️ Experiência próxima de uma IDE moderna (ex: VSCode, GNOME desktop), mas voltada para arquitetos de software.
- 👩‍💻 Usuário principal: arquiteta de software sênior, que precisa de uma "mesa de trabalho" digital para:
  - 📁 Gerenciar projetos e tarefas
  - 🗂️ Refinar e criar ERDs e diagramas
  - 🤖 Compor e orquestrar personas de IA (behavior, contexto, pipeline)
  - 📝 Delegar tarefas para IAs e acompanhar o progresso
  - 🧩 Unificar todas as ferramentas e fluxos em um só lugar
- 🪟 Frontend permite movimentar, redimensionar, snap e organizar janelas (windows) como em um desktop/IDE real.
- 🎨 Visual, cores e feedback seguem o padrão do Cursor, com dark mode e destaques em azul.

### ✨ Funcionalidades-Chave
- 📋 **Gestão de projetos:** criar, editar, deletar, selecionar projeto ativo, contexto global.
- 🗺️ **Refino de ERD:** interface visual para criar/refinar diagramas, com sugestões e automação por IA.
- 📝 **Criação/refino de tasks:** derivar tasks a partir de ERD, associar a personas/IA, detalhar e acompanhar execução.
- 🧑‍💼 **Personas IA:** compor personas com behavior, contexto e pipeline de agentes para executar tarefas específicas.
- 💬 **Chat com especialistas virtuais:** múltiplos avatares, cada um associado a um modelo/IA, histórico persistente.
- 🤖 **Automação máxima:** IA desenvolve tasks de forma autônoma, rodando como daemon (ex: dentro do VSCode), guiando e executando tarefas para o usuário.
- ⚡ **Comando rápido:** integração futura com [kbar](https://github.com/timc1/kbar) para command palette universal (cmd+k/ctrl+k), facilitando navegação, execução de ações e automação.

### 🎯 Público-Alvo
- 👩‍💻 Profissionais de arquitetura de software, tech leads, product owners técnicos e equipes que precisam de visão macro, automação e colaboração com IAs.
- 🎯 Foco em reduzir a carga cognitiva, acelerar decisões e permitir evolução incremental do produto.

### 📝 Observações
- 🔄 Sistema flexível para evoluir, podendo no futuro substituir parte do fluxo de uma IDE tradicional.
- 🏗️ Arquitetura, UX e automação pensadas para suportar crescimento, sempre com o humano no controle final.
- 📚 Este README deve ser atualizado continuamente para refletir a visão, decisões e evolução do produto.

## 🕹️ Orquestração Multi-IDE, Multi-Projeto e Automação Paralela

A visão de futuro deste sistema inclui:

- 🧑‍💻 **Controle e orquestração de múltiplos ambientes de desenvolvimento (ex: VSCode) a partir de uma única interface.**
- 🔗 Possibilidade de conectar, granularizar e monitorar o desenvolvimento de dois ou mais projetos em paralelo, cada um podendo ser assistido por uma ou mais IAs especializadas.
- 🪄 Interface para granularizar tarefas, delegar para diferentes IAs/personas e reforçar prompts manualmente, inspirada em ferramentas como o script `autodev2.sh` (execução incremental, reforço de prompt, logs, automação tolerante a falhas).
- 📝 Capacidade de reforçar prompts, reexecutar microtasks, monitorar logs e validar entregas em tempo real, tudo centralizado na plataforma.
- 🧑‍💻 Cada workspace/projeto pode ser associado a um ou mais agentes/daemons (ex: rodando em VSCode), permitindo que a IA desenvolva, teste e entregue tarefas de forma autônoma ou supervisionada.
- 🔄 O usuário pode alternar entre projetos, reforçar prompts, revisar logs e interagir com múltiplas IAs, tudo em uma única "mesa de trabalho" visual.

**🎯 Objetivo:**
- 🚀 Permitir que arquitetos e equipes técnicas orquestrem, monitorem e acelerem o desenvolvimento de múltiplos projetos simultaneamente, com automação incremental, reforço manual e colaboração entre IAs e humanos.
- 🧭 Inspirar-se em fluxos como o do Cursor e scripts como o autodev2.sh para garantir rastreabilidade, validação incremental e máxima flexibilidade.

## 🧠 Princípios de UX: Redução da Carga Cognitiva

O princípio central deste produto é **minimizar ao máximo a carga cognitiva do usuário humano**. O sistema deve ser projetado para que o usuário foque em definir, refinar e priorizar tarefas e decisões estratégicas, enquanto a IA e a automação cuidam do operacional, confirmações e microdecisões.

### 📐 Diretrizes:
- 🚫 Evitar solicitações desnecessárias de confirmação ou escolhas triviais.
- 🤖 IA deve ser proativa, autônoma e transparente, tomando decisões seguras por padrão e informando apenas o essencial ao usuário.
- 🧑‍💼 Usuário atua como orquestrador, não como executor de microações.
- 🧩 Interfaces, fluxos e automações desenhados para minimizar interrupções, fricção e repetições.
- 🔮 Sempre que possível, o sistema antecipa necessidades e sugere caminhos, reduzindo o número de cliques e confirmações.
- ⚡ Foco em acelerar o fluxo de trabalho, aumentar a confiança e liberar o usuário para decisões de alto impacto.

> **🧠 Toda funcionalidade, integração e fluxo deve ser avaliada sob o critério de redução da carga cognitiva e automação máxima.**

## 🤖 Integração de Chat Inteligente e Automação via IA

### 💬 Inspiração: chatbot-ollama

O projeto [chatbot-ollama](https://github.com/nkasmanoff/chatbot-ollama) serve como referência para implementar uma interface de chat moderna, modular e integrada a modelos LLM (ex: Ollama) no frontend. A estrutura modular de componentes, hooks e serviços pode ser adaptada para:
- 🧠 Análise de código do projeto
- 🤖 Automação de tarefas inteligentes (ex: atuar como Product Owner, sugerir estrutura de arquivos)
- 🔗 Integração com modelos LLM via API
- 📝 Prompts dinâmicos e system prompts customizados

### 🛠️ Pipeline Sugerido
1. 🧩 **Adaptação de Componentes e Hooks**
   - Importe/adapte componentes de chat, input, histórico e UI de conversação.
   - Implemente hooks para requisições ao backend/modelo, gerenciamento de estado e contexto de chat.
2. 🧠 **Prompt Dinâmico e System Prompt**
   - Permita prompts inteligentes para tarefas como: "Gerar backlog", "Sugerir estrutura de arquivos", "Revisar sprint".
   - Adapte o system prompt para guiar o comportamento do modelo (ex: "Você é um PO, organize a sprint").
3. 🔗 **Integração Backend/Modelo**
   - Use hooks/services para consumir endpoints do backend ou API Ollama.
4. 🎨 **UI/UX**
   - Implemente feedback visual, loading, histórico e edição de mensagens.

### 💡 Exemplos de Prompts
- **Product Owner:**
  ```
  Você é um Product Owner. Dado o backlog abaixo, priorize as tarefas para a próxima sprint e explique sua decisão.
  Backlog:
  - Implementar autenticação OAuth
  - Refatorar layout do dashboard
  - Corrigir bug no upload de arquivos
  - Adicionar testes automatizados
  Responda:
  ```
- **Estrutura de Backend:**
  ```
  Dada a estrutura do projeto:
  - src/routes/
  - src/data/models/
  - src/controllers/
  E o requisito: "Adicionar endpoint para cadastro de produto."
  Liste os arquivos que devem ser criados ou modificados, com caminhos completos.
  ```

### 🔗 Referências
- [chatbot-ollama no GitHub](https://github.com/nkasmanoff/chatbot-ollama)
- [components](https://github.com/nkasmanoff/chatbot-ollama/tree/main/components)
- [hooks](https://github.com/nkasmanoff/chatbot-ollama/tree/main/hooks)
- [services](https://github.com/nkasmanoff/chatbot-ollama/tree/main/services)
- [utils/app/const.ts (system prompt)](https://github.com/nkasmanoff/chatbot-ollama/blob/main/utils/app/const.ts)

### 📝 Observações
- 🗂️ Estruture os arquivos e pastas no local correto, mesmo que a implementação esteja incompleta.
- 🤖 Implemente prompts inteligentes e integração incremental com o backend/modelo.
- 🧪 Refine a UX conforme feedback do uso real.

---
