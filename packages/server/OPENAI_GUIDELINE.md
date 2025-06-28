# OPENAI API GUIDELINE — Ecossistema Slice/ALIVE

## Objetivo
Este guia serve como referência central para garantir máxima compatibilidade do servidor Slice/ALIVE com a API da OpenAI. Ele orienta a implementação incremental, documentação, testes e evolução plugável de todos os endpoints, payloads e respostas, acelerando integração, automação e colaboração multiagente.

> **Quanto mais completo e rastreável este guia, mais fácil evoluir, auditar e adaptar todo o ecossistema.**

---

## Referências Oficiais
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Models Overview](https://platform.openai.com/docs/models/overview)
- [OpenAI Error Codes](https://platform.openai.com/docs/guides/error-codes)
- [OpenAI Quickstart](https://platform.openai.com/docs/quickstart)

---

## Parâmetros Globais e Explicações Didáticas

### Parâmetros comuns (usados em vários endpoints)

| Parâmetro         | Tipo      | Para que serve / Dica para humanos                                                                                 |
|-------------------|-----------|------------------------------------------------------------------------------------------------------------------|
| model             | string    | Qual modelo usar (ex: gpt-4, text-davinci-003, whisper-1, etc). Veja [Models Overview](https://platform.openai.com/docs/models/overview). |
| user              | string    | ID do usuário final. Útil para rastrear uso, detectar abuso, ou personalizar respostas. Opcional, mas recomendado.|
| temperature       | number    | Controla criatividade/aleatoriedade (0 = determinístico, 2 = muito criativo). Use 0.7 para respostas balanceadas. |
| top_p             | number    | Nucleus sampling: restringe a escolha aos tokens mais prováveis. Use 1 para padrão, <1 para respostas mais seguras.|
| n                 | integer   | Quantas respostas gerar por request. Cuidado: aumenta custo e tokens!                                             |
| stream            | boolean   | Se true, resposta vem em partes (útil para UIs interativas). Se false, resposta completa.                        |
| stop              | string/[] | Sequência(s) onde a geração deve parar. Ex: ["\nHuman:", "\nAI:"] para simular turnos de chat.                |
| max_tokens        | integer   | Limite de tokens na resposta. Evita respostas longas demais ou estouro de contexto.                              |
| presence_penalty  | number    | Penaliza repetição de temas já abordados. Útil para forçar variedade. (-2 a 2)                                    |
| frequency_penalty | number    | Penaliza repetição de palavras/frases. (-2 a 2)                                                                   |
| logit_bias        | object    | Força ou bane tokens específicos. Ex: {"50256": -100} para nunca gerar <|endoftext|>. Avançado!                 |
| seed              | integer   | Tenta tornar a resposta determinística (mesmo input = mesmo output). Útil para testes. Beta!                     |
| response_format   | string    | Define se a resposta deve ser texto, JSON, etc. Para JSON, instrua o modelo a responder em JSON.                  |
| tools             | array     | Lista de funções/tools que o modelo pode chamar (ex: para agents/function calling). Avançado!                    |
| tool_choice       | string/{} | Controla se o modelo deve chamar tool/função. "auto", "none" ou especificar função.                            |

> **Dica:** Sempre confira limites de tokens, formatos de erro e campos opcionais na doc oficial. Alguns parâmetros só funcionam em modelos/versões específicas!

---

## Parâmetros por Endpoint (com explicação para humanos)

### /v1/chat/completions
- **messages** (array): Lista de mensagens da conversa. Cada item tem:
  - **role** (string): "system", "user", "assistant". Define quem está falando.
  - **content** (string): Texto da mensagem.
  - **name** (string, opcional): Nome do agente (para bots multiagente ou funções).
  - **function_call/tool_calls/context**: Campos avançados para agents/function calling.
- **model**: Qual modelo GPT usar (ex: gpt-4o, gpt-3.5-turbo).
- **temperature, top_p, n, stream, stop, max_tokens, user, tools, tool_choice, response_format, seed**: ver tabela acima.

**Exemplo prático:**
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "Você é um assistente útil."},
    {"role": "user", "content": "Olá!"}
  ],
  "temperature": 0.7,
  "n": 1
}
```

### /v1/completions
- **prompt** (string/array): Texto base para gerar resposta. Pode ser string única ou array de prompts.
- **model, max_tokens, temperature, top_p, n, stream, stop, logprobs, user, logit_bias, seed**: ver tabela acima.

**Exemplo prático:**
```json
{
  "model": "text-davinci-003",
  "prompt": "Conte uma piada sobre manga.",
  "max_tokens": 32,
  "temperature": 1.0
}
```

### /v1/embeddings
- **input** (string/array): Texto(s) para gerar embedding. Pode ser string única ou array.
- **model, user, encoding_format, dimensions**: ver doc oficial para detalhes de formatos e limites.

**Exemplo prático:**
```json
{
  "model": "text-embedding-ada-002",
  "input": ["isto é um teste"]
}
```

### /v1/audio/transcriptions e /v1/audio/translations
- **file** (string): Arquivo de áudio (multipart/form-data).
- **model**: Modelo de áudio (ex: whisper-1).
- **prompt** (string, opcional): Texto para guiar o estilo/transcrição.
- **response_format** (string): "json", "text", "srt", "vtt".
- **temperature** (number): Aleatoriedade da transcrição.
- **language** (string): ISO-639-1 (ex: "pt", "en").

**Exemplo prático:**
```
POST /v1/audio/transcriptions
Content-Type: multipart/form-data
file=@audio.wav
model=whisper-1
```

### /v1/images/generations
- **prompt** (string): Descrição da imagem.
- **n** (integer): Quantas imagens gerar.
- **size** (string): Tamanho (ex: "1024x1024").
- **response_format** (string): "url" ou "b64_json".
- **user** (string): ID do usuário.
- **quality, style**: Parâmetros avançados para controle de qualidade/estilo.

**Exemplo prático:**
```json
{
  "prompt": "Um robô desenhando código.",
  "n": 1,
  "size": "1024x1024"
}
```

### /v1/models
- Sem parâmetros. Apenas GET.

### /v1/moderations
- **input** (string/array): Texto(s) para moderação.
- **model** (string, opcional): Modelo de moderação.

**Exemplo prático:**
```json
{
  "input": "Texto para moderação."
}
```

---

> **Dica para humanos:** Sempre consulte exemplos reais, teste com payloads mínimos e vá incrementando. Use logs e respostas de erro para entender limites e edge cases. Documente tudo que descobrir!

---

## Checklist de Compatibilidade (Endpoints e Recursos)

| Endpoint                                 | Método | Descrição resumida                | Status/Stub |
|-------------------------------------------|--------|-----------------------------------|-------------|
| /v1/chat/completions                      | POST   | Geração de chat (GPT)             | TODO        |
| /v1/completions                           | POST   | Geração de texto (legacy)         | TODO        |
| /v1/embeddings                            | POST   | Geração de embeddings             | TODO        |
| /v1/audio/transcriptions                  | POST   | Transcrição de áudio              | TODO        |
| /v1/audio/translations                    | POST   | Tradução de áudio                 | TODO        |
| /v1/images/generations                    | POST   | Geração de imagens (DALL-E)       | TODO        |
| /v1/models                                | GET    | Lista modelos disponíveis         | TODO        |
| /v1/files                                 | GET    | Lista arquivos                    | TODO        |
| /v1/files                                 | POST   | Upload de arquivo                 | TODO        |
| /v1/files/{file_id}                       | GET    | Detalhes de arquivo               | TODO        |
| /v1/files/{file_id}                       | DELETE | Deleta arquivo                    | TODO        |
| /v1/fine-tunes                            | POST   | Inicia fine-tuning                | TODO        |
| /v1/fine-tunes                            | GET    | Lista fine-tunes                  | TODO        |
| /v1/fine-tunes/{fine_tune_id}             | GET    | Detalhes de fine-tune             | TODO        |
| /v1/fine-tunes/{fine_tune_id}/events      | GET    | Eventos de fine-tune              | TODO        |
| /v1/fine-tunes/{fine_tune_id}/cancel      | POST   | Cancela fine-tune                 | TODO        |
| /v1/moderations                           | POST   | Moderação de conteúdo             | TODO        |

---

## Estrutura de Documentação por Endpoint

### /v1/chat/completions (POST)
- **Para que serve:** Gera respostas de chat baseadas em modelos GPT (ex: gpt-3.5-turbo, gpt-4).
- **Como usar:** Envie um payload JSON com messages, model, temperature, top_p, n, stream, stop, tools, tool_choice, user, etc.
- **Exemplo de request:**
```json
POST /v1/chat/completions
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "Você é um assistente útil."},
    {"role": "user", "content": "Olá!"}
  ],
  "temperature": 0.7,
  "top_p": 1,
  "n": 1,
  "stream": false,
  "stop": null,
  "user": "user-123"
}
```
- **Exemplo de response:**
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Olá! Como posso ajudar?"},
      "finish_reason": "stop"
    }
  ],
  "usage": {"prompt_tokens": 10, "completion_tokens": 10, "total_tokens": 20}
}
```
- **Links úteis:** [API Reference: Chat Completions](https://platform.openai.com/docs/api-reference/chat/create)

---

### /v1/completions (POST)
- **Para que serve:** Gera texto a partir de um prompt (legacy, modelos como text-davinci-003).
- **Como usar:** Envie um payload JSON com prompt, model, max_tokens, temperature, top_p, n, stream, stop, logprobs, user, etc.
- **Exemplo de request:**
```json
POST /v1/completions
{
  "model": "text-davinci-003",
  "prompt": "Conte uma piada sobre manga.",
  "max_tokens": 32,
  "temperature": 1.0,
  "n": 1
}
```
- **Exemplo de response:**
```json
{
  "id": "cmpl-7QmVI15qgYVllxK0FtxVGG6ywfzaq",
  "created": 1686617332,
  "choices": [
    {
      "text": "O que é um manga que manda? O manda-manga!",
      "index": 0,
      "finish_reason": "stop",
      "logprobs": null
    }
  ],
  "usage": {"completion_tokens": 20, "prompt_tokens": 6, "total_tokens": 26}
}
```
- **Links úteis:** [API Reference: Completions](https://platform.openai.com/docs/api-reference/completions/create)

---

### /v1/embeddings (POST)
- **Para que serve:** Gera embeddings vetoriais para texto.
- **Como usar:** Envie um payload JSON com input (string ou array), model, user, etc.
- **Exemplo de request:**
```json
POST /v1/embeddings
{
  "model": "text-embedding-ada-002",
  "input": ["isto é um teste"]
}
```
- **Exemplo de response:**
```json
{
  "object": "list",
  "data": [
    {
      "index": 0,
      "embedding": [0.1, 0.2, 0.3, ...]
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {"prompt_tokens": 4, "total_tokens": 4}
}
```
- **Links úteis:** [API Reference: Embeddings](https://platform.openai.com/docs/api-reference/embeddings/create)

---

### /v1/audio/transcriptions (POST)
- **Para que serve:** Transcreve áudio para texto.
- **Como usar:** Envie um arquivo de áudio (multipart/form-data), com campos file, model, prompt, response_format, temperature, language.
- **Exemplo de request:**
```http
POST /v1/audio/transcriptions
Content-Type: multipart/form-data
file=@audio.wav
model=whisper-1
```
- **Exemplo de response:**
```json
{
  "text": "Texto transcrito do áudio."
}
```
- **Links úteis:** [API Reference: Audio Transcriptions](https://platform.openai.com/docs/api-reference/audio/create)

---

### /v1/audio/translations (POST)
- **Para que serve:** Transcreve e traduz áudio para inglês.
- **Como usar:** Envie um arquivo de áudio (multipart/form-data), com campos file, model, prompt, response_format, temperature.
- **Exemplo de request:**
```http
POST /v1/audio/translations
Content-Type: multipart/form-data
file=@audio.wav
model=whisper-1
```
- **Exemplo de response:**
```json
{
  "text": "Texto traduzido do áudio."
}
```
- **Links úteis:** [API Reference: Audio Translations](https://platform.openai.com/docs/api-reference/audio/create)

---

### /v1/images/generations (POST)
- **Para que serve:** Gera imagens a partir de um prompt textual (DALL-E).
- **Como usar:** Envie um payload JSON com prompt, n, size, response_format, user, quality, style.
- **Exemplo de request:**
```json
POST /v1/images/generations
{
  "prompt": "Um robô desenhando código.",
  "n": 1,
  "size": "1024x1024"
}
```
- **Exemplo de response:**
```json
{
  "created": 1698342300,
  "data": [
    {"url": "https://.../generated_00.png"}
  ]
}
```
- **Links úteis:** [API Reference: Images](https://platform.openai.com/docs/api-reference/images/create)

---

### /v1/models (GET)
- **Para que serve:** Lista todos os modelos disponíveis para a conta.
- **Como usar:** Requisição GET simples.
- **Exemplo de response:**
```json
{
  "object": "list",
  "data": [
    {"id": "gpt-4", "object": "model", ...},
    {"id": "text-davinci-003", "object": "model", ...}
  ]
}
```
- **Links úteis:** [API Reference: Models](https://platform.openai.com/docs/api-reference/models/list)

---

### /v1/moderations (POST)
- **Para que serve:** Modera conteúdo textual.
- **Como usar:** Envie um payload JSON com input (string ou array), model.
- **Exemplo de request:**
```json
POST /v1/moderations
{
  "input": "Texto para moderação."
}
```
- **Exemplo de response:**
```json
{
  "id": "modr-abc123",
  "model": "text-moderation-latest",
  "results": [
    {"flagged": false, "categories": {"hate": false, ...}}
  ]
}
```
- **Links úteis:** [API Reference: Moderations](https://platform.openai.com/docs/api-reference/moderations/create)

---

## Observações sobre Parâmetros, Edge Cases e Limites
- Sempre confira limites de tokens, formatos de erro e campos opcionais na doc oficial.
- Parâmetros como user, logit_bias, tools, tool_choice, response_format, seed, etc. podem ser opcionais ou específicos de modelos/versões.
- Erros seguem formato padronizado: {"error": {"message": ..., "type": ..., "param": ..., "code": ...}}
- Para endpoints de áudio, use multipart/form-data.
- Para imagens, response_format pode ser url ou b64_json.

---

## Espaço para Anotações e Contribuições Futuras
- [ ] Adicionar exemplos de erros e edge cases
- [ ] Mapear diferenças entre versões da API
- [ ] Incluir dicas de automação e testes
- [ ] Expandir exemplos para outros endpoints

---

> **Contribua!** Este guia é vivo e incremental. Toda melhoria, exemplo ou insight facilita a evolução de todo o ecossistema Slice/ALIVE.
