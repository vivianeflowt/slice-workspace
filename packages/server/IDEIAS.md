# 📘 Guia Completo: Rotas, Providers e Comportamento Esperado no Servidor Slice

> Arquitetura: **Vertical Slice**
> Abstração: **Compatível com OpenAI API**
> Natureza: **Stateless**
> Objetivo: **Alta flexibilidade com múltiplos providers (OpenAI, Ollama, LocalAI, etc.)**

---

## 🧠 Conceitos Fundamentais

### 📌 Vertical Slice

- Cada **Feature** representa uma unidade funcional coesa.
- As **Routes** funcionam como _Circuit Breakers_: protegem, validam e padronizam o fluxo.
- Os **Providers** são implementações intercambiáveis que realizam a inferência real.

---

## 🛣️ Sobre as Rotas (`routes/`)

### Função principal:
- Proteger a feature.
- Validar e adaptar payloads.
- Garantir compatibilidade com o padrão da OpenAI.
- **NÃO FAZEM inferência.**

### Quando criar uma rota:
- Quando a OpenAI define um endpoint canônico (ex: `/chat/completions`, `/images/generations`, `/files`).
- Quando for necessário criar _fallbacks_, _throttling_, _logs_ ou _alias_.
- Quando o comportamento é específico e pode ser reaproveitado com múltiplos providers.

---

## 🧩 Sobre os Providers (`providers/`)

### Função principal:
- Executar a inferência.
- Adaptar o payload para a API/ferramenta do modelo real.
- Garantir que o resultado volte ao formato esperado pela rota.

### Deve:
- Ser **stateless**.
- Implementar uma interface comum (`sendMessage`, `getEmbedding`, etc.).
- Ser substituível por outro provider sem afetar o restante do código.

---

## 🧭 Quando usar qual rota?

| Endpoint                        | Use quando...                                                                                      |
|--------------------------------|------------------------------------------------------------------------------------------------------|
| `/v1/chat/completions`         | Comunicação multimodal (texto + imagem) ou textual com intenção de conversação.                    |
| `/v1/images/generations`       | Ação for gerar imagem a partir de um prompt (ex: DALL·E, SD).                                      |
| `/v1/files`                    | Precisar fazer upload/download de arquivos usados em embeddings, fine-tuning, etc.                 |
| `/v1/embeddings`               | Gerar vetores de textos (usado para memória, busca semântica, RAG, etc.).                          |
| `/v1/audio/transcriptions`     | Enviar áudio para ser convertido em texto.                                                         |

> Exemplo de payload multimodal em `/chat/completions`:
```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "Descreva a imagem:"},
        {"type": "image_url", "image_url": {"url": "data:image/png;base64,...."}}
      ]
    }
  ],
  "model": "gpt-4-vision-preview"
}


🔄 Relação entre Rota e Provider
Aspecto	Rota	Provider
Entrada	Padrão OpenAI	Payload interno normalizado
Saída	OpenAI-style	Resposta do modelo (raw/parsed)
Responsabilidade	Segurança e compatibilidade	Inferência e adaptação
Extensibilidade	Troca de lógica sem alterar backend	Suporte a múltiplos modelos
Localização	routes/	providers/


🧰 Considerações Técnicas
O servidor é stateless: cada chamada deve conter tudo que é necessário para executar a task.

Memória local (ex: DuckDB) pode ser usada em camadas superiores (ex: simuladores de memória), mas nunca dentro do provider.

Toda lógica crítica e parsing final ocorre na feature, não no provider.

Seguir naming baseado em verbs para handlers (handleChatCompletion, handleEmbeddingGeneration, etc.)

💡 Sugestões de Melhoria
1. Documentação Automatizada
Gerar OpenAPI (Swagger) com base nas validações Zod por rota.

2. Auto-roteamento por capacidade
Criar um middleware que filtre os providers por capacidade (ex: supports_vision: true, supports_audio: false).

3. Feedback adaptativo
Provider pode registrar tempos de resposta e acionar fallback automaticamente (circuit breaker real).

4. Testes por contrato
Testes que verificam se cada provider responde corretamente para cada rota padronizada.

5. Providers Combináveis
Ex: usar Ollama para embeddings e OpenAI para chat.

📎 Links de Referência
📘 Chat Completions API

🖼️ Image Generation API

📁 Files API

📈 Embeddings API

🎧 Audio Transcription API

🔄 Ollama API Docs

✅ Decisões Validadas
Rota vazia não deve ser criada só para completar spec — rota só existe se tiver feature real associada.

images/generations é exclusivo para geração visual. Tudo que for visão + texto entra em /chat/completions (ex: GPT-4V).

Cada Feature deve ser testável isoladamente. Rota e provider são intercambiáveis sem afetar lógica da feature.

🔍 Resumo Pragmático
Feature: onde a lógica vive.

Route: fachada compatível com OpenAI + proteção.

Provider: plug para modelos.

Você só cria rota se for executar algo agora. Criar só pra "completar spec" = antipattern.
