# 📘 `PROJECT.md` — Servidor Local de Modelos Diversos (HuggingFace, Estilo OpenAI)

> Estrutura para rodar modelos de NLP (foco em português) e outros necessários.

---

## 🎯 Objetivo

- Servir modelos da Hugging Face não disponíveis no Ollama.
- Garantir compatibilidade com payloads OpenAI (onde fizer sentido).
- Operar totalmente usando CPU se fizer sentido.
- Separar funções por *tipo de tarefa*, e não por modelo.
- Criar aliases para modelos de forma a poder deixar mais semantico

---

## 🤔 Por que esse servidor é isolado?

| Motivo | Vantagem |
| --- | --- |
| **Evitar conflitos** | Instâncias separadas para libs/modelos específicos |
| **Facilidade de teste** | Rodar funções independentes, sem dependência cruzada |
| **Plugabilidade** | Substituir/adicionar modelos sem reescrever o sistema |
| **Escalabilidade** | Permite distribuir tarefas por máquina sem centralizar tudo |
| **Independência** | Funciona sem Cursor, Ollama, Docker ou qualquer stack fechado |

---

## 🧩 Estrutura de Diretório Recomendada

```
server/
├── api/                # Endpoints FastAPI por função (classify, embed, etc)
│   ├── chat.py
│   ├── models.py
├── providers/          # Implementações específicas dos modelos
│   ├── classify/
│   ├── embed/
│   └── pos_tag/
├── services/           # Orquestrações e lógica de negócio
├── models/             # Schemas Pydantic (v2)
├── utils/              # Helpers reutilizáveis
├── constants.py        # Configs gerais, modelos, timeouts
└── main.py             # FastAPI app runner
```

---

## 🧠 Convenção Central

> **Separar por tarefa**, não por modelo.

**Exemplo certo:**

- `embed.py` → usa `Ernie`, `multilingual-e5` ou outro embedding.

**Exemplo errado:**

- `bert_base_pt.py`, `roberta_embedder.py`, etc.

---

## ⚙️ Taskfile

```bash
task install     # Instala dependências e baixa os modelos
task run         # Roda o servidor na porta 5115
task test        # Executa testes automatizados
```

---

## 🔗 Padrão OpenAI: Payloads e Rotas

### Compatibilidade direta:

- `POST /v1/chat/completions`
- `POST /v1/embeddings`
- `POST /v1/classifications` *(rota extra, segue padrão JSON)*

### Payload de exemplo:

```json
{
  "model": "nome-do-modelo",
  "input": "texto em português para análise",
  "options": {
    "temperature": 0.7,
    "top_p": 0.9
  }
}
```

### Exemplo de retorno para embeddings:

```json
{
  "data": [
    {
      "embedding": [0.123, 0.345, ...],
      "index": 0
    }
  ],
  "model": "multilingual-e5",
  "object": "embedding"
}
```

---

## 🧱 Princípios Técnicos

| Princípio | Descrição |
| --- | --- |
| Testável | Cada função é testável isoladamente |
| Pydantic v2 | Todas as rotas validadas com schemas robustos |
| Sem mágica | Sem globals ou configs escondidas |
| Plugável | Fácil trocar/adicionar funções sem quebrar nada |
| Explicável | Código comentado, com docstrings e convenções visíveis |

---

## 🧠 Analogia mental

Cada função é como uma **tomada universal**: o agente IA (ou humano) pluga o modelo e ele funciona. Quer trocar o modelo? Só muda o plug — sem refazer a rede.

---

## 💡 Casos de uso previstos

- Classificação de textos (ex: positivo, neutro, negativo)
- Extração de entidades nomeadas (NER)
- Geração de embeddings
- Tagging de partes do discurso (POS)
- Detecção de linguagem
- Parafraseamento (futuro)
- Correção gramatical (futuro)

---

## ✅ Compatibilidade mínima

| Item | Requisito |
| --- | --- |
| Python | >= 3.10 |
| Framework | FastAPI |
| Tipagem | Pydantic v2 |
| NLP base | `transformers` da Hugging Face |
| Runner | Taskfile |

---


## 📦 Lista de modelos suportados (iniciais)

| Tarefa | Modelo HuggingFace |
| --- | --- |
| Embeddings | `intfloat/multilingual-e5-small` |
| Classificação | `pierreguillou/bert-base-cased-sentiment-analysis` |
| POS Tagging | `gilf/flaubert-pt-pos` *(a confirmar)* |
| NER | `pierreguillou/ner-bert-portuguese-cased` |
| Detecção de língua | `papluca/xlm-roberta-base-language-detection` |

---

## 📌 Observações finais

- Ideal para rodar em paralelo com seu cluster principal.
- Pode funcionar em conjunto com servidores Ollama, DeepSeek, Perplexity, etc.
- Arquitetado para escalar horizontalmente ou rodar em containers isolados.

---

> Criado para Viviane — visão técnica e liberdade de agentes. 🧠🔗
