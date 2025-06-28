// 📚 Guidelines para Frontend (Client)

/**

* 🎯 Visão Geral

* 

* Este documento define padrões para estrutura, nomeação, organização e melhores práticas do frontend React.

* Baseado no README do projeto e nos princípios de modularidade, automação e UX proativa.
  */

// 🏗️ Estrutura de Diretórios
//
// src/
// ├── components/         // Componentes atômicos, contextuais e de UI
// │   └── [context]/[Component]/Component.tsx
// ├── hooks/              // Hooks customizados
// ├── layouts/            // Layouts globais e de windows
// ├── routes/             // Configuração central de rotas
// ├── styles/             // Design system, tokens, temas
// ├── types/              // Tipos globais
// ├── utils/              // Funções puras auxiliares
// ├── views/
// │   ├── pages/          // Páginas principais (rotas)
// │   └── windows/        // Janelas plugáveis (features)
// └── context/            // Contextos globais (ex: UserContext)
// tests/                  // Testes E2E (Playwright)

// 🔤 Convenções de Nomeação
// - Nunca use index.tsx para componentes ou rotas.
// - Componentes: [Component].tsx, [Component].test.tsx, [Component].story.tsx
// - Rotas: [Page]Route.tsx, AppRoutes.tsx
// - Windows: [Feature]Window.tsx
// - Hooks: use[Feature].ts
// - Utils: [util].ts, com teste em __tests__/
// - Tipos: PascalCase

// 🧩 Exemplo de Componente
// src/components/ui/Button/Component.tsx
// src/components/ui/Button/Component.test.tsx
// src/components/ui/Button/Component.story.tsx
// src/components/ui/Button/mocks.ts

// 🪝 Exemplo de Hook
// src/hooks/useChat.ts
// src/hooks/useUser.ts

// 🗂️ Exemplo de View/Page
// src/views/pages/HomePage.tsx
// src/views/pages/DashboardPage.tsx

// 🪟 Exemplo de Window
// src/views/windows/ChatWindow.tsx
// src/views/windows/ProjectWindow.tsx

// 🛣️ Exemplo de Rota
// src/routes/AppRoutes.tsx
// src/routes/HomeRoute.tsx
// src/routes/DashboardRoute.tsx

// 🧪 Testes
// - Unitários: junto ao componente/hook/utilitário
// - E2E: sempre em tests/ na raiz do client (Playwright)
// - Use data-testid e seletores acessíveis

// 📦 Boas Práticas
// - Estruture pastas/arquivos mesmo para features incompletas
// - Centralize design system, tipos e utilitários
// - Use apenas bibliotecas aprovadas (ver README)
// - Evite UI kits completos; priorize UnoCSS, Shiki, zustand, react-query, zod, axios
// - Nomeie arquivos de forma explícita e sem abreviações
// - Centralize lógica de navegação em routes/
// - Não misture lógica de feature/UI nos arquivos de rota
// - Use mocks e exemplos para Storybook

// 🧠 Princípios de UX
// - Reduza a carga cognitiva do usuário
// - Proporcione experiência de IDE moderna (VSCode-like)
// - Permita movimentar, redimensionar e organizar windows
// - Foco em automação, feedback visual e evolução incremental
// - IA deve ser proativa, autônoma e transparente

// 🚦 Evolução Incremental
// - Sempre crie a estrutura correta, mesmo que só com TODO/mocks
// - Facilite automação, refatoração e colaboração
// - Atualize o guideline e README conforme o produto evoluir

// ---
// Consistência, clareza e automação são mais importantes que perfeição.
// Siga o padrão e mantenha o frontend escalável e IA-friendly.
