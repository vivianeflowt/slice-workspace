# PROVIDE GUIDELINE — API IA (Swagger Markdown)

> **Base URL:** `http://localhost:4000/api`

---

## Endpoints

### 1. Listar Modelos Disponíveis

**GET** `/models`

- **Descrição:** Retorna todos os modelos disponíveis, agrupados por provider.
- **Query Params:**
  - `provider` (opcional, string): Filtra modelos por provider (`openai`, `deepseek`, `ollama`, `perplexity`).
- **Response 200:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4o",
      "object": "model",
      "owned_by": "openai",
      "provider": "openai"
    },
    {
      "id": "llama3:8b",
      "object": "model",
      "owned_by": "ollama",
      "provider": "ollama"
    }
  ]
}
```
- **Dica:** Sempre consulte `/models` para obter a lista mais atualizada de modelos e providers disponíveis.

---

### 2. Geração de Texto/Chat

**POST** `/chat/completions`

- **Descrição:** Gera resposta de IA a partir de mensagens no padrão OpenAI.

#### Parâmetros do Payload

| Campo         | Tipo      | Obrigatório | Descrição                                                                                       |
|---------------|-----------|-------------|-------------------------------------------------------------------------------------------------|
| provider      | string    | Não         | Nome do provedor de IA. Ex: `openai`, `deepseek`, `ollama`, `perplexity`.                      |
| model         | string    | Não         | Identificador do modelo. Ex: `gpt-4o`, `llama3:8b`. Se não informado, usa o padrão do provider. |
| messages      | array     | Sim         | Array de mensagens no padrão OpenAI (ver abaixo).                                               |
| temperature   | number    | Não         | Grau de criatividade da resposta. Varia de 0 (determinístico) a 10 (máxima criatividade).       |
| maxTokens     | number    | Não         | Limite máximo de tokens na resposta gerada.                                                     |

#### Estrutura do Campo `messages`

Cada item do array `messages` deve ser um objeto com:
- `role`: string. Um dos valores: `system`, `user`, `assistant`.
- `content`: string. O texto da mensagem.

Exemplo:
```json
[
  { "role": "system", "content": "Você é um assistente útil." },
  { "role": "user", "content": "Qual a capital do Japão?" }
]
```

#### Exemplo de Payload Completo
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "messages": [
    { "role": "system", "content": "Você é um assistente conciso." },
    { "role": "user", "content": "Qual a capital do Japão?" }
  ],
  "temperature": 0.7,
  "maxTokens": 512
}
```

- **Campos:**
  - `provider`: Nome do provedor ("openai", "deepseek", "ollama", "perplexity"). Opcional se `model` for fornecido.
  - `model`: Identificador do modelo. Opcional se `provider` for fornecido (usa modelo padrão do provider).
  - `messages`: **Obrigatório**. Array de mensagens no padrão OpenAI:
    - `role`: "system", "user" ou "assistant".
    - `content`: Texto da mensagem.
  - `temperature`: Opcional. Nível de criatividade (0-10).
  - `maxTokens`: Opcional. Limite de tokens na resposta.
- **Response 200:**
```json
{
  "result": "Tóquio."
}
```
- **Response 400 (erro de validação):**
```json
{
  "error": "Validation Error",
  "details": [
    { "field": "messages[0].content", "message": "Campo obrigatório.", "code": "invalid_type" }
  ]
}
```
- **Exemplo de Requisição (OpenAI):**
```bash
curl -X POST http://localhost:4000/api/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "provider": "openai",
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "Você é um assistente conciso."},
    {"role": "user", "content": "Qual a capital do Japão?"}
  ]
}'
```
- **Exemplo de Requisição (DeepSeek):**
```bash
curl -X POST http://localhost:4000/api/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "Explique o que é um algoritmo em uma frase."}
  ]
}'
```
- **Exemplo de Requisição (Ollama):**
```bash
curl -X POST http://localhost:4000/api/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "model": "llama3:8b",
  "messages": [
    {"role": "user", "content": "Escreva um haiku sobre programação."}
  ]
}'
```
- **Exemplo de Requisição (Perplexity):**
```bash
curl -X POST http://localhost:4000/api/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "provider": "perplexity",
  "model": "sonar-pro",
  "messages": [
    {"role": "user", "content": "Quais são os principais benefícios da energia solar?"}
  ]
}'
```

---

## Schemas

### Mensagem (Message)
```json
{
  "role": "system" | "user" | "assistant",
  "content": "string"
}
```

### Modelo (Model)
```json
{
  "id": "string",
  "object": "model",
  "owned_by": "string",
  "provider": "string"
}
```

---

## Observações
- Sempre consulte `/api/models` para a lista mais atualizada de modelos e providers.
- O payload deve SEMPRE usar o campo `messages` (array de mensagens no padrão OpenAI).
- Campos como `prompt` ou `systemPrompt` não são aceitos.
- Para integração plug-and-play, basta seguir os exemplos acima.
