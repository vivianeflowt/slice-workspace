# 📋 Transformando o `PROJECT.md` em Tarefas Executáveis

## 🎯 Objetivo

Ler o arquivo `PROJECT.md` e **transformar as ideias ali contidas em tarefas menores**, organizadas de forma sequencial e prática, para facilitar o seu próprio processo de execução e acompanhamento.

---

## 🧠 O que fazer

1. Leia o conteúdo atual do `PROJECT.md`
2. Quebre as ideias maiores em **subtarefas claras e pequenas**
3. Marque quais dessas tarefas **já foram realizadas**
4. Organize essas tarefas em uma lista que você pode usar como **checklist de progresso**

---

## 📌 Regras

- **Não reescreva o conteúdo do `PROJECT.md`**
- A lista de tarefas pode ficar num arquivo separado (ex: `TASKS.md`) ou ser usada apenas no seu contexto interno, mas deve refletir fielmente o que está no `PROJECT.md`
- Sempre que uma tarefa for executada, **marque como concluída**
- Use `- [ ]` para tarefas pendentes e `- [x]` para tarefas concluídas
- Se uma ideia no `PROJECT.md` ainda não for clara, **crie uma subtarefa para investigar ou validar com Viviane**

---

## ✅ Exemplo

Suponha que o `PROJECT.md` contenha isso:

> Vamos construir dois servidores de modelos distintos. Ambos devem usar Python. Precisamos definir a base comum entre eles, e depois diferenciar os providers.

Transforme em:

```markdown
# Tasks derivadas do PROJECT.md

- [x] Definir que o projeto será feito em Python
- [ ] Criar estrutura base comum para os dois servidores
- [ ] Separar o que é específico de cada provider
- [ ] Validar o comportamento de cada provider com Viviane
- [ ] Automatizar instalação via Taskfile
