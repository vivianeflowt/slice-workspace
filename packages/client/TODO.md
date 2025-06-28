# CONTEXTO ATUAL DO PROJETO (IMPORTANTE PARA RETOMADA)

---

## 🪟 Diretrizes Atuais — Sistema de Janelas, Command Palette e UX

- **Command Palette (kbar):**
  - Integrar [kbar](https://github.com/timc1/kbar) desde a base do projeto.
  - Atalho principal: **Ctrl+Q** para abrir a command palette (além de Cmd/Ctrl+K, se desejado).
  - Todas as ações globais (abrir, restaurar, minimizar janelas, busca, etc.) devem ser acessíveis via command palette.
  - Provider do kbar deve envolver toda a aplicação.

- **Contexto Global (useGlobal + Event Emitter):**
  - Estado global e orquestração de eventos centralizados em um hook `useGlobal` com event emitter.
  - Permite comunicação desacoplada entre janelas, dock, topbar, command palette, etc.
  - Persistência de estado (posição, ordem, minimizada/maximizada) via localStorage.

- **Sistema de Janelas (Windows):**
  - Janelas podem ser movidas e redimensionadas, mas **nunca se sobrepõem** (tiling/grid, estilo IDE).
  - **Titlebar customizada:** ícone, título, botões de minimizar e fechar.
  - **Duplo clique na titlebar:** ajusta/maximiza a janela para ocupar todo o espaço disponível (snap/maximize).
  - **Minimizar:** janela vira ícone/círculo na topbar (dock), podendo ser restaurada com clique.
  - **Ordem e estado das janelas minimizadas/maximizadas** são salvos no localStorage e restaurados na inicialização.
  - **Dock/Topbar:** renderiza ícones das janelas minimizadas, permite drag & drop e recall via kbar/eventos.
  - **Acessibilidade:** navegação por teclado, foco visível, labels claros.

- **Design de Software:**
  - Composição: `App` → `KBarProvider` → `GlobalProvider` (useGlobal) → aplicação.
  - Cada janela registra seu estado e ações no contexto global.
  - Todas as ações relevantes expostas ao kbar.

## Command Palette (kbar) — Ícones como Elemento Central

- Todas as ações exibidas na command palette devem ter um ícone representativo ao lado do nome.
- Ícones facilitam identificação rápida, navegação visual e reduzem a carga cognitiva.
- Layout customizado: ícone + nome da ação + atalho de teclado, seguindo o padrão visual do design system.
- Tooltips com delay podem complementar, mas o ícone é o principal elemento de reconhecimento.
- Padrão visual consistente em toda a aplicação.
- Referência: [kbar — cmd+k interface](https://github.com/timc1/kbar)
- Exemplo:
  - [ícone] Ação: "Nova Janela"
    Atalho: Ctrl+N
  - [ícone] Ação: "Minimizar Todas"
    Atalho: Ctrl+M

---

## Diretrizes de Navegação e Ações — Foco em Power Users

- Navegação por teclado (Tab/Enter, atalhos) é padrão para todos os elementos interativos.
- Barra de ações rápida no chat: ícones com tooltips e feedback visual imediato.
- Tooltips sempre presentes, com delay, priorizando ícones sobre texto.
- Feedback visual claro ao acionar ações (ex: copiar, enviar).
- Sem foco em acessibilidade para deficiência, mas máxima eficiência para uso avançado.
- Exemplos: Enter para enviar, ícone para copiar, atalhos para alternar janelas.
- Referências: ChatGPT, VSCode Sidebar.

---

# Análise do Layout e Backlog de Features

## Elementos do Layout
- TopBar (logo, navegação, avatar, linha de ícones)
- Grid de janelas (windows) independentes
- Janela de chat/interação com tabs, dropdown de modelo, microfone, botão de ação
- Placeholders para gráficos, listas, histórico

## Prioridades de Implementação
1. TopBar fixa
2. Grid principal de Windows
3. Componente Window genérico
4. Janela de chat com tabs, dropdown, área de mensagens, microfone, botão
5. Placeholders para gráficos/listas
6. Estrutura pronta para manipulação dinâmica de janelas

## Backlog Futuro
- Drag & drop de janelas
- Maximizar/minimizar/fechar janela
- Customização de layout pelo usuário
- Suporte a múltiplos especialistas/IA (linha de ícones)
- Integração com Web Speech API (microfone)
- Histórico persistente de sessões/tabs
- Temas (dark/light)
- Notificações contextuais

---

# Conceito de Janelas (Windows) e Layout

- **Janelas (windows):**
  - Cada "janela" representa um painel funcional independente dentro da interface, podendo exibir gráficos, histórico, chat, ou qualquer outro recurso.
  - O layout permite múltiplas janelas lado a lado, cada uma com seu próprio cabeçalho, controles e conteúdo dinâmico.
  - Janelas podem ser reordenadas, maximizadas/minimizadas ou fechadas (futuro).
  - Cada janela pode conter múltiplas abas (tabs), facilitando a organização de diferentes fluxos (ex: múltiplas conversas, dashboards, logs, etc).
- **Exemplo visual:**
  - Top bar com logo, seleção de IA, avatar do usuário/especialista e alternância de tema.
  - Linha de janelas principais (ex: chat, gráficos, histórico), cada uma com seu próprio escopo.
  - Área de chat com tabs para múltiplas sessões, seleção de modelo (ex: GPT-4), input de texto, botão de microfone (Web Speech API) e feedback visual de status.

---

# Plano de Implementação — Frontend (Client)

## Objetivo Atual
Preparar o frontend para comunicação com o backend, permitindo ao usuário interagir com múltiplas IAs disponíveis na máquina, com arquitetura pronta para crescer de forma modular e escalável.

## Passos Detalhados

1. **Configuração do Storybook**
   - Instalar e configurar Storybook para React + TypeScript.
   - Adicionar script no package.json e no client.sh para rodar o Storybook.
   - Garantir integração com componentes e design system.

2. **Estrutura de Design System**
   - Criar pasta `src/components/ui` para componentes básicos e reutilizáveis.
   - Cada componente deve ter:
     - `Component.tsx` (implementação)
     - `Component.test.tsx` (teste unitário)
     - `Component.stories.tsx` (exemplo no Storybook)
   - Iniciar pelo componente `Button`.

3. **Layout Base Inspirado no ChatGPT**
   - Top bar com logo e alternância de tema (dark/light).
   - Área central para chat, seleção de IA e múltiplas janelas/abas.
   - Estrutura pronta para múltiplos especialistas/avatares.
   - Implementar conceito de janelas e tabs conforme detalhado acima.

4. **Integração com Backend**
   - Configurar axios/fetch para consumir o backend (usando VITE_API_URL).
   - Criar hook para healthcheck e exemplo de chamada à API.
   - Preparar estrutura para enviar perguntas para diferentes IAs.
   - (Ainda não implementado: hooks e utils para API.)

5. **Scripts e Documentação**
   - Garantir scripts de lint, format, dev, storybook.
   - Documentar padrão de componentes, pastas e variáveis de ambiente.

---

> Este arquivo deve ser atualizado a cada novo passo ou decisão relevante, servindo como referência rápida para retomada do desenvolvimento em caso de reset.
