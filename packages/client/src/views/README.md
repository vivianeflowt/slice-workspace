# views/

O diretório `views` centraliza todas as telas visuais do sistema, separando dois conceitos principais:

## 1. Pages (`views/pages/`)

- Representam páginas completas acessíveis por rotas (URLs) principais.
- Exemplo: Home, Dashboard, Login, Register.
- Cada arquivo corresponde a uma rota do React Router.
- Páginas podem compor múltiplas “windows” e layouts globais.

## 2. Windows (`views/windows/`)

- São janelas/áreas funcionais plugáveis, usadas dentro do dashboard (ex: via React Grid View).
- Cada window é uma feature isolada (ex: ChatWindow, ProjectWindow, AnalyticsWindow).
- Windows podem ser arrastadas, redimensionadas e organizadas no grid.
- Não são rotas diretas, mas sim componentes usados dentro das páginas (principalmente Dashboard).
