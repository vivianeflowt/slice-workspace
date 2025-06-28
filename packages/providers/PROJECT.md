# 📘 PROJECT.md — Servidor de Providers HuggingFace (CPU-only)

> Este servidor faz parte do ecossistema Slice/ALIVE e serve modelos HuggingFace que **não estão disponíveis no Ollama**, rodando localmente em Python, sempre em CPU. Ele é pensado para NLP em português, com foco em classificadores, embeddings e tarefas linguísticas plugáveis.

## 🚀 Objetivo

- Servir modelos de NLP que **não estão no Ollama** (ex: classificadores, embeddings, POS tagging, NER, etc).
- Foco em português, mas extensível para outros idiomas.
- Garantir que rode 100% em CPU, mesmo em máquinas com GPU.
- Manter compatibilidade máxima com o padrão OpenAI API (quando possível), facilitando integração.

## ⚠️ Por que este servidor é separado do Command-R?

- **Isolamento de dependências:** evita conflitos de libs e versões entre modelos HuggingFace e o core Command-R.
- **Estabilidade:** cada servidor evolui e escala de forma independente.
- **Plugabilidade:** permite adicionar/remover modelos alternativos sem afetar o Command-R.
- **Especialização:** este servidor é otimizado para tarefas NLP e experimentação rápida.

## 🧩 Estrutura Modular — Princípio Central

### Separe por Funcionalidade, Nunca por Nome de Modelo

> **Regra de ouro:**
> Organize o código por **função** (ex: classificação, embeddings, POS tagging), nunca por nome de modelo (ex: `bert_base_portuguese.py`).
>
> **Por quê?**
> - Facilita trocar/adicionar modelos para a mesma função sem quebrar nada.
> - O foco é o que o sistema faz, não como faz.
> - Permite evolução incremental: novas funções entram sem afetar as existentes.
> - Evita acoplamento: o código depende de interfaces funcionais, não de modelos fixos.

#### Exemplo de estrutura recomendada:

```
server/
├── api/
│   ├── classify.py         # Rota para classificação
│   ├── embed.py            # Rota para embeddings
│   └── pos_tag.py          # Rota para POS tagging
├── models/                 # Schemas Pydantic
├── providers/
│   ├── classify/           # Providers de classificação (um ou mais modelos)
│   │   ├── huggingface.py  # Wrapper para modelos HuggingFace de classificação
│   │   └── ...
│   ├── embed/              # Providers de embeddings
│   │   ├── huggingface.py
│   │   └── ...
│   └── pos_tag/            # Providers de POS tagging
│       ├── huggingface.py
│       └── ...
├── services/               # Orquestração por função (ex: roteamento, fallback)
├── utils/                  # Funções auxiliares e helpers
├── constants.py            # Configurações centralizadas (modelos, timeouts, etc)
└── main.py                 # FastAPI runner
```

#### O que evitar (anti-padrão):
- Pastas ou arquivos nomeados por modelo (ex: `bert_base_portuguese.py`, `distilbert_sentiment.py`).
- Lógica acoplada a um modelo específico.
- Duplicação de código entre funções semelhantes.

#### Benefícios práticos:
- Trocar o modelo de classificação = só mudar o provider, sem alterar rotas ou serviços.
- Adicionar novo modelo de embeddings não afeta API nem testes de classificação.
- O código fica mais legível, testável, plugável e fácil de evoluir.
- Permite onboarding rápido de novos devs ou IAs.

#### Analogia:
> Pense em cada função (classificação, embedding, etc) como uma tomada universal: qualquer modelo compatível pode ser plugado ali, sem precisar trocar a fiação da casa.

## 🛠️ Comandos via Taskfile

- `task install` → instala dependências e baixa modelos HuggingFace.
- `task run` → inicia servidor (porta 5115).
- `task test` → executa testes automatizados.

## ✅ Princípios do Projeto

- **Testabilidade:** toda função tem teste automatizado.
- **Validação:** toda rota tem schema validado (Pydantic).
- **CPU-only:** nenhum modelo depende de GPU.
- **Zero número mágico:** todas as configs centralizadas em `constants.py`.
- **Plugabilidade:** adicionar/remover modelos ou funções nunca quebra o sistema.
- **Documentação incremental:** cada módulo/função tem docstring clara.

---

> **Resumo:**
> Este servidor é plugável, incremental e seguro. Siga a estrutura funcional, escreva testes e docstrings, e nunca acople lógica a um modelo específico. Assim, qualquer dev ou IA pode evoluir o projeto sem medo e com rastreabilidade total.
