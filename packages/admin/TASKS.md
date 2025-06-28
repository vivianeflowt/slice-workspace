[PRIORITÁRIO] Corrigir fragmentação do envio de behavior para garantir que o texto seja enviado e exibido como bloco único, sem cortes ou separação.

# Tarefas Prioritárias — Gestão de Tasks Markdown

- [x] **Definir padrão oficial dos arquivos de task**
   - Campos obrigatórios: `title`, `category`, `priority`, `description`, `habilidade`.
   - Campos opcionais: `status`, `created_at`, `updated_at`, etc.
   - Exemplo/template markdown.

- [ ] **Criar tela de gestão de tasks**
   - Página dedicada no frontend para listar, visualizar, criar, editar e validar tasks.
   - Exibir campos principais e status de validação.
   - Ações: Novo, Editar, Deletar, Validar.

- [ ] **Automatizar leitura e escrita dos arquivos**
   - Backend expõe endpoints para CRUD de arquivos markdown de tasks.
   - Frontend consome e manipula tasks via API.

- [ ] **Validação e padronização automática**
   - Script/utilitário para validar todos os arquivos existentes.
   - Feedback visual na UI para tasks fora do padrão.

- [ ] **Geração de índice/resumo automático**
   - Página ou componente que gera um índice/resumo das tasks existentes.

- [ ] **Documentação e template para novas tasks**
   - Disponibilizar template markdown e instruções para criação manual ou automatizada.

- [ ] Integrar painel admin ao backend/orquestrador para guiar e acompanhar execuções em tempo real, com logs, métricas e controle de fluxos.

---

> Este arquivo serve como guia sequencial para o desenvolvimento do módulo de gestão de tasks markdown. Atualize conforme o progresso e novas necessidades.
