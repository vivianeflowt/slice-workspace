# 🔌 API Reference - Slice/ALIVE Providers Server

> **Documentação incremental** conforme CONCEPTS.md - cada endpoint documentado com exemplos práticos

## 🎯 Base URL

```
http://localhost:5115/api/v1
```

## 📋 Health Check

### `GET /health`

Verifica status do servidor e modelos carregados.

**Response:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2025-06-28T10:30:00Z",
  "services": {
    "api": "healthy",
    "models": "healthy"
  },
  "models": {
    "classify": true,
    "embed": true,
    "pos_tag": true
  }
}
```

---

## 🎯 Classificação de Texto

### `POST /classify`

Classifica texto usando modelos HuggingFace.

**Request:**
```json
{
  "text": "Este produto é fantástico, recomendo!",
  "labels": ["positivo", "negativo", "neutro"],
  "model": "neuralmind/bert-base-portuguese-cased"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-06-28T10:30:00Z",
  "processing_time": 0.15,
  "classification": {
    "predicted_label": "positivo",
    "confidence": 0.92,
    "all_scores": [
      {"label": "positivo", "confidence": 0.92},
      {"label": "neutro", "confidence": 0.06},
      {"label": "negativo", "confidence": 0.02}
    ]
  },
  "input_text": "Este produto é fantástico, recomendo!",
  "model_used": "neuralmind/bert-base-portuguese-cased"
}
```

### `POST /classify/zero-shot`

Classificação zero-shot (sem treino prévio).

**Request:**
```json
{
  "text": "O governo anunciou novas medidas econômicas",
  "candidate_labels": ["política", "economia", "esporte", "tecnologia"],
  "model": "neuralmind/bert-base-portuguese-cased"
}
```

---

## 🧠 Embeddings de Texto

### `POST /embed`

Gera embeddings vetoriais para similaridade semântica.

**Request:**
```json
{
  "text": "Inteligência artificial está revolucionando o mundo",
  "model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
  "normalize": true
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-06-28T10:30:00Z",
  "processing_time": 0.08,
  "embeddings": [[0.1234, -0.5678, 0.9012, ...]],
  "dimensions": 384,
  "input_text": "Inteligência artificial está revolucionando o mundo",
  "model_used": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
}
```

### Exemplo de Uso: Similaridade

```python
import httpx
import numpy as np

# Gerar embeddings para dois textos
texts = [
    "Inteligência artificial está revolucionando o mundo",
    "IA está transformando a sociedade moderna"
]

embeddings = []
for text in texts:
    response = httpx.post("http://localhost:5115/api/v1/embed",
                         json={"text": text})
    embeddings.append(response.json()["embeddings"][0])

# Calcular similaridade coseno
similarity = np.dot(embeddings[0], embeddings[1])
print(f"Similaridade: {similarity:.3f}")  # ~0.89 (alta similaridade)
```

---

## 📝 POS Tagging (Análise Morfossintática)

### `POST /pos_tag`

Analisa morfologia e sintaxe do texto português.

**Request:**
```json
{
  "text": "O gato subiu no telhado verde.",
  "model": "pierreguillou/bert-base-cased-pt-lenerbr",
  "return_tokens": true
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-06-28T10:30:00Z",
  "processing_time": 0.12,
  "tokens": [
    {"token": "O", "pos_tag": "DET", "confidence": 0.99},
    {"token": "gato", "pos_tag": "NOUN", "confidence": 0.98},
    {"token": "subiu", "pos_tag": "VERB", "confidence": 0.97},
    {"token": "no", "pos_tag": "ADP", "confidence": 0.99},
    {"token": "telhado", "pos_tag": "NOUN", "confidence": 0.96},
    {"token": "verde", "pos_tag": "ADJ", "confidence": 0.94}
  ],
  "input_text": "O gato subiu no telhado verde.",
  "model_used": "pierreguillou/bert-base-cased-pt-lenerbr"
}
```

---

## 📦 Processamento em Lote

### `POST /batch/classify`

Processa múltiplos textos de uma vez.

**Request:**
```json
{
  "texts": [
    "Este produto é excelente!",
    "Não gostei do atendimento.",
    "O preço está razoável."
  ],
  "labels": ["positivo", "negativo", "neutro"]
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-06-28T10:30:00Z",
  "total_processed": 3,
  "processing_time": 0.45,
  "results": [
    {
      "input_text": "Este produto é excelente!",
      "predicted_label": "positivo",
      "confidence": 0.94
    },
    {
      "input_text": "Não gostei do atendimento.",
      "predicted_label": "negativo",
      "confidence": 0.88
    },
    {
      "input_text": "O preço está razoável.",
      "predicted_label": "neutro",
      "confidence": 0.76
    }
  ]
}
```

---

## ⚡ Modelos Disponíveis

### `GET /models`

Lista modelos carregados e disponíveis.

**Response:**
```json
{
  "success": true,
  "loaded_models": {
    "classify": [
      "neuralmind/bert-base-portuguese-cased",
      "rufimelo/Legal-BERTimbau-base"
    ],
    "embed": [
      "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    ],
    "pos_tag": [
      "pierreguillou/bert-base-cased-pt-lenerbr"
    ]
  },
  "default_models": {
    "classify": "neuralmind/bert-base-portuguese-cased",
    "embed": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "pos_tag": "pierreguillou/bert-base-cased-pt-lenerbr"
  }
}
```

---

## 🚨 Códigos de Erro

| Código | Descrição | Solução |
|--------|-----------|---------|
| `400` | Request inválido | Verificar formato JSON e campos obrigatórios |
| `422` | Validação falhou | Verificar tipos e limites dos parâmetros |
| `500` | Erro interno | Verificar logs do servidor |
| `503` | Modelo não carregado | Aguardar carregamento ou reiniciar servidor |

### Exemplo de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo 'text' é obrigatório",
    "details": {
      "field": "text",
      "expected": "string",
      "received": "null"
    }
  },
  "timestamp": "2025-06-28T10:30:00Z"
}
```

---

## 🔧 Exemplos de Uso

### cURL

```bash
# Health check
curl http://localhost:5115/api/v1/health

# Classificação
curl -X POST http://localhost:5115/api/v1/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "Adorei este produto!", "labels": ["positivo", "negativo"]}'

# Embedding
curl -X POST http://localhost:5115/api/v1/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Texto para embedding"}'
```

### Python com httpx

```python
import httpx

# Cliente reutilizável
client = httpx.Client(base_url="http://localhost:5115/api/v1")

# Health check
health = client.get("/health")
print(health.json())

# Classificação
result = client.post("/classify", json={
    "text": "Este filme é incrível!",
    "labels": ["positivo", "negativo", "neutro"]
})
print(result.json()["classification"]["predicted_label"])
```

### JavaScript/TypeScript

```typescript
// Usando fetch
const classify = async (text: string, labels: string[]) => {
  const response = await fetch('http://localhost:5115/api/v1/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, labels })
  });

  return await response.json();
};

// Uso
const result = await classify("Produto excelente!", ["positivo", "negativo"]);
console.log(result.classification.predicted_label); // "positivo"
```

---

## 📊 Limites e Performance

| Parâmetro | Limite | Observação |
|-----------|--------|------------|
| Tamanho máximo do texto | 8.192 caracteres | Truncado automaticamente |
| Requests simultâneas | 100 | Fila automática |
| Timeout por request | 30 segundos | Configurável |
| Batch máximo | 16 textos | Para manter performance |

---

**🟦 Documentação incremental** - atualizada conforme evolução da API
**📝 Última atualização:** 28/06/2025
