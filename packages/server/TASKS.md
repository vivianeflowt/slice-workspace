## 🛠️ TASK: Tornar Servidor Compatível com API da OpenAI (Fluxo Incremental Genérico)

### 🎯 Objetivo

Adaptar o servidor atual — qualquer que seja sua estrutura — para simular o **comportamento da API oficial da OpenAI**, incluindo:

- Rota `/v1/chat/completions`
- Payloads com mensagens em formato `{ role, content }`
- Suporte a imagens via base64 ou URL (`type: "image_url"`)
- Respostas e headers compatíveis
- Suporte a `stream: true` (eventualmente)
- Compatibilidade com clientes oficiais da OpenAI

---

### 🧠 Estratégia Geral

Você **NÃO deve assumir nenhuma estrutura existente**. Deve agir **de forma incremental e progressiva**, usando raciocínio iterativo em cada passo:

---

### 1. 📁 Explorar o servidor atual

- Ler a estrutura do servidor atual.
- Identificar:
  - Onde ficam as rotas (se existirem).
  - Onde são feitas chamadas a modelos de linguagem (se houver).
  - Qual linguagem/framework está em uso.

📄 Documente suas descobertas iniciais em:
`docs/TMP_discovery.md`

---

### 2. 🚧 Criar Rota Padrão `/v1/chat/completions`

- Mesmo que o servidor não use Express ou algo conhecido, crie um ponto de entrada equivalente.
- Aceite um JSON no padrão OpenAI (role, content, model, etc).
- Ignore validações no primeiro momento, apenas aceite o payload.

📄 Crie: `routes/chat_completion.ts` (ou equivalente para o ambiente)

---

### 3. 🧩 Adaptar qualquer modelo local ao formato OpenAI

- Qualquer que seja a forma como os modelos são acessados (CLI, HTTP, função local), encapsule isso em um `adapter`.
- O `adapter` deve:
  - Receber o mesmo payload que a OpenAI.
  - Retornar uma resposta com o mesmo formato da OpenAI.

📄 Crie: `adapters/openai_adapter.ts` ou equivalente.

---

### 4. 🖼️ Suporte a imagem

- Se detectar conteúdo com `type: image_url` ou base64, registre isso.
- Se o modelo **não suportar imagem**, retornar erro padronizado.

📄 Documentar suporte parcial em: `docs/TMP_capabilities.md`

---

### 5. 🔁 Suporte a `stream: true` (opcional)

- Se o modelo permitir streaming, implemente.
- Se não, envie resposta como se fosse completa, mantendo compatibilidade.

---

### 6. 🧪 Testes e Validação

- Tente usar clientes OpenAI com a rota adaptada.
- Capture falhas e registre limitações.

📄 Registre os testes em: `docs/TMP_test_log.md`

---

### 📚 Regras para Otimizações

Sempre que sugerir ou aplicar **qualquer otimização técnica**, o agente deve:

- Confirmar se há documentação oficial da OpenAI respaldando a sugestão.
- Incluir o link da documentação diretamente no comentário do código.

Exemplo:

```ts
// Otimização baseada em:
// https://platform.openai.com/docs/guides/gpt/chat-completions-api
