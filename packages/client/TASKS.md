# Lista de Tarefas Técnicas

## 🛠 Setup Inicial (Prioridade Alta)
- **Configurar Storybook**
  - [x] Instalar Storybook para React+TypeScript
  - [x] Criar scripts de execução (`package.json` e `client.sh`)
  - [x] Configurar integração com componentes principais

- **Design System Básico**
  - [x] Criar estrutura `src/components/ui`
  - [x] Implementar componente `Button`:
    - [x] `Button.tsx` + testes unitários
    - [x] `Button.stories.tsx`
  - [x] Criar componentes base: `Input`, `Dropdown`

---

## ⌨️ Command Palette (kbar)
- **Integração Core**
  - [ ] Instalar e configurar kbar
  - [ ] Criar provider global do kbar (envolver a aplicação)
  - [ ] Configurar atalhos principais (`Ctrl+Q`/`Cmd+K`)

- **Ações e UI Customizada**
  - [ ] Criar wrapper para ações com ícones
  - [ ] Implementar layout customizado (ícone + nome + atalho)
  - [ ] Conectar ações básicas:
    - [ ] Nova Janela (`Ctrl+N`)
    - [ ] Minimizar Todas (`Ctrl+M`)
    - [ ] Busca Global

---

## 🪟 Sistema de Janelas (Windows)
- **Componente Window Base**
  - [ ] Criar componente com titlebar customizada:
    - [ ] Ícone + Título
    - [ ] Botões Minimizar/Fechar
  - [ ] Implementar duplo clique para maximize/snap
  - [ ] Lógica de redimensionamento (grid sem sobreposição)

- **Gerenciamento de Estado**
  - [ ] Integrar com `useGlobal` para estado das janelas
  - [ ] Implementar persistência no `localStorage`:
    - [ ] Posição/Estado
    - [ ] Janelas minimizadas
  - [ ] Criar sistema de IDs único para janelas

- **Integração Dock/Topbar**
  - [ ] Renderizar ícones de janelas minimizadas
  - [ ] Implementar clique para restaurar
  - [ ] Adicionar suporte a drag & drop (prioridade baixa)

### 🔥 Refinamento Avançado do Componente Window
- [ ] Menu contextual deslizante (três pontinhos) na titlebar
  - [ ] Animação suave (slide/fade)
  - [ ] Opções dinâmicas por janela (fixar, visualizar, favoritos, etc)
  - [ ] Fechar ao clicar fora ou após timeout
  - [ ] Acessibilidade (teclado, foco, ESC)
- [ ] Botão/ação de "Fixar" (pin)
  - [ ] Estado visual (pino preenchido/vazio)
  - [ ] Bloquear drag, resize e inércia quando fixado
- [ ] Persistência de configurações/templates
  - [ ] Hook `useWindowSettings` com adapter global
  - [ ] Salvar/carregar posição, tamanho, estado, preferências
  - [ ] Suporte a templates por nome, escopo global/projeto
  - [ ] Diálogo para salvar template (nome + checkbox global)
  - [ ] Listar/remover/renomear templates (dashboard)
- [ ] Inércia física realista ao soltar (com atrito forte)
  - [ ] Animação com requestAnimationFrame
  - [ ] Rebote nas bordas laterais/topo (coeficiente menor)
  - [ ] Sem limite para baixo (scroll infinito)
- [ ] Colisão entre múltiplas janelas
  - [ ] Contexto global para posições/estados
  - [ ] Detecção de colisão e "empurrão" com rebote
  - [ ] Alinhamento vertical pós-colisão
- [ ] Integração com dashboard para gerenciamento de templates
  - [ ] Menu lateral direito para listar/apagar templates
  - [ ] Sincronização automática ao trocar adapter global

---

## 🖥 Layout Principal e UX
- **TopBar Fixa**
  - [ ] Implementar estrutura com:
    - [ ] Logo
    - [ ] Seletor de IA
    - [ ] Avatar usuário
    - [ ] Ícones de sistema (tema, notificações)

- **Área de Chat Principal**
  - [ ] Criar componente de chat com:
    - [ ] Tabs para múltiplas sessões
    - [ ] Dropdown de seleção de modelo (ex: GPT-4)
    - [ ] Área de mensagens scrollable
    - [ ] Input com microfone (placeholder Web Speech API)

- **Grid de Janelas**
  - [ ] Implementar layout tipo grid (CSS Grid/Flexbox)
  - [ ] Garantir responsividade básica
  - [ ] Criar placeholders para gráficos/listas

---

## 🔌 Integração Backend
- **Configuração API**
  - [ ] Configurar axios com `baseURL` (VITE_API_URL)
  - [ ] Implementar healthcheck básico
  - [ ] Criar hook `useAPI` para chamadas genéricas

- **Comunicação com IAs**
  - [ ] Implementar envio de perguntas para endpoint
  - [ ] Criar sistema de múltiplos especialistas (IDs)
  - [ ] Tratar erros básicos de conexão

---

## 🧪 Testes e Qualidade
- **Testes Unitários**
  - [ ] Cobrir componentes críticos (Window, kbar actions)
  - [ ] Testar persistência de estado no `localStorage`
  - [ ] Validar fluxos de teclado

- **Acessibilidade Básica**
  - [ ] Implementar navegação por teclado (`Tab`/`Enter`)
  - [ ] Adicionar labels ARIA para ícones
  - [ ] Garantir foco visual claro

---

## 📚 Documentação
- **Atualizar README.md**
  - [ ] Adicionar guia de atalhos
  - [ ] Documentar estrutura de componentes
  - [ ] Listar variáveis de ambiente necessárias

- **Registro de Decisões**
  - [ ] Manter arquivo de contexto atualizado
  - [ ] Registrar padrões de código relevantes

---

## 📦 Backlog Futuro (Prioridade Baixa)
- [ ] Drag & drop avançado de janelas
- [ ] Customização de layout pelo usuário
- [ ] Sistema de temas (dark/light)
- [ ] Integração Web Speech API completa
- [ ] Notificações contextuais
- [ ] Histórico de sessões persistente

---

### 🔄 Ordem Sugerida de Implementação
1. Setup Inicial → 2. Command Palette → 3. Sistema de Janelas → 4. Layout Principal → 5. Integração Backend → 6. Testes → 7. Documentação

