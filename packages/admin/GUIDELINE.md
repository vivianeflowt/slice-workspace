// 📚 Guidelines para Frontend (Admin)

/**
 * 🚩 Diretiva obrigatória:
 * Mesmo usando React-Bootstrap, todos os componentes devem ser encapsulados e exportados a partir de @components.
 * Nunca importar diretamente de 'react-bootstrap' em páginas, rotas ou layouts. Sempre criar um wrapper/component personalizado em @components e importar a partir dele.
 * Isso garante padronização, rastreabilidade e facilidade de manutenção.
 */

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
// ├── pages/              // Páginas principais (cada arquivo é uma página)
// ├── routes/             // Centraliza todo o roteamento da aplicação
// ├── styles/             // Design system, tokens, temas
// ├── types/              // Tipos globais
// ├── utils/              // Funções puras auxiliares
// └── context/            // Contextos globais (ex: UserContext)
// tests/                  // Testes E2E (Playwright)

// 🔤 Convenções de Nomeação
// - Nunca use index.tsx para componentes ou rotas.
// - Componentes: [Component].tsx, [Component].test.tsx
// - Rotas: [Page]Route.tsx, AppRoutes.tsx
// - Hooks: use[Feature].ts
// - Utils: [util].ts, com teste em __tests__/
// - Tipos: PascalCase

// 🧩 Exemplo de Componente
// src/components/ui/Button/Component.tsx
// src/components/ui/Button/Component.test.tsx

// 🪝 Exemplo de Hook
// src/hooks/useChat.ts
// src/hooks/useUser.ts

// 🗂️ Exemplo de View/Page
// src/pages/HomePage.tsx
// src/pages/DashboardPage.tsx

// 🛣️ Exemplo de Roteamento
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
// - Evite UI kits completos; priorize React-Bootstrap, Tailwind, Shiki, zustand, react-query, zod, axios
// - Nomeie arquivos de forma explícita e sem abreviações
// - Centralize lógica de navegação em routes/
// - Não misture lógica de feature/UI nos arquivos de rota

// 🧠 Princípios de UX
// - Mockup é sempre diretriz, independentemente do design
// - Use Bootstrap básico (React-Bootstrap) para garantir agilidade e padronização
// - Utilize Tailwind para facilitar estilização rápida e customizações pontuais
// - Priorize desenvolvimento rápido e design funcional, sem firulas
// - Feedback visual só quando facilitar o fluxo e a comunicação
// - O objetivo do projeto é resolver o problema: facilitar a comunicação entre a usuária (arquiteta) e o desenvolvedor (IA)
// - Reduza a carga cognitiva do usuário
// - Permita movimentar, redimensionar e organizar windows
// - Foco em automação e evolução incremental
// - IA deve ser proativa, autônoma e transparente
// - Seja sempre proativo: antecipe necessidades e automatize ajustes

// 🚦 Evolução Incremental
// - Sempre crie a estrutura correta, mesmo que só com TODO/mocks
// - Facilite automação, refatoração e colaboração
// - Atualize o guideline e README conforme o produto evoluir

// ---
// Consistência, clareza e automação são mais importantes que perfeição.
// Siga o padrão e mantenha o frontend escalável e IA-friendly.

// =============================
// 📚 Sobre este GUIDELINE.md
// =============================
// Este arquivo serve como referência central para que todos os desenvolvedores do ecossistema sigam o mesmo padrão de organização, nomenclatura e arquitetura.
// O objetivo é facilitar o acoplamento de funcionalidades, manutenção e evolução do projeto.
// Todo o ecossistema foi projetado para seguir padrões claros, garantindo integração fluida entre módulos e times.
// O padrão arquitetural primário adotado é o Vertical Slice, promovendo modularidade, independência e escalabilidade.

// =============================
// 🛠️ Backend: Organização e Boas Práticas
// =============================
// - Sempre use o server principal (Node/TypeScript) como referência de arquitetura, organização e boas práticas para o backend Python, adaptando para o contexto Python.
// - Utilitários e ferramentas do backend (ex: logger, helpers) devem ser organizados em lib/.
//   • lib/: Centraliza utilitários, helpers e módulos reutilizáveis do backend (ex: logger, validações, middlewares customizados).
// - Nunca versionar arquivos de log: logs/ e backend.log devem estar no .gitignore.
// - Logger padrão deve ser centralizado em lib/logger.py, com logs salvos em logs/backend.log e exibidos no console em modo dev.
// - Scripts, automações e ferramentas de SO devem ficar em tools/.
//   • tools/: Contém scripts de automação, integração com SO, PyQt5, pyautogui, etc. Nunca misture lógica de API aqui.
// - Endpoints da API REST devem ser organizados em routes/.
//   • routes/: Cada arquivo representa um recurso ou grupo de endpoints, mantendo a API modular e fácil de manter.
// - Mantenha o backend modular, rastreável e desacoplado do frontend.
// - Sempre documente decisões e padrões relevantes nesta guideline.
