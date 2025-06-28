# 🚀 Backend — Project Manager

## 🧩 Visão de Produto: Orquestração Modular de IA

Este backend orquestra múltiplos provedores de IA (OpenAI, DeepSeek, Ollama, etc.) de forma modular, escalável e fácil de evoluir. Segue arquitetura **vertical slice** para máxima clareza, testabilidade e automação.

---

## 💡 Objetivo e Inspiração
- 🧠 Orquestrar múltiplos providers de IA, modelos e pipelines de forma plugável.
- 🏗️ Permitir evolução incremental, automação e fácil extensão para novos contextos (speech, image, text, etc).
- 🔌 Facilitar integração com múltiplos frontends, automações e agentes.
- 📦 Modularidade máxima: cada feature é um slice autossuficiente, fácil de testar, documentar e evoluir.
- 🤖 Pronto para automação por IA e integração com agentes autônomos.

## ✨ Funcionalidades-Chave
- 🔗 **Orquestração de providers:** OpenAI, DeepSeek, Ollama, Perplexity, e outros.
- 🧩 **Vertical slice:** cada feature isolada, com controller, router, testes e docs.
- 📚 **Catálogo de modelos:** centralização de modelos, configurações e exemplos em JSON/YAML.
- 🛡️ **Middlewares globais:** autenticação, logging, tratamento de erros, etc.
- ⚡ **Automação e testes:** estrutura pronta para CI/CD, cobertura e2e, integração incremental.

## 🎯 Público-Alvo
- 👩‍💻 Arquitetos de software, tech leads, equipes de IA e automação, devs que precisam de backend plugável e escalável.
- 🎯 Foco em clareza, automação, evolução incremental e integração com múltiplos agentes/frontends.

## 🧠 Princípios de Design
- 📦 Modularidade: cada contexto/feature isolado, fácil de evoluir.
- 🧪 Testabilidade: estrutura pronta para testes unitários e e2e.
- 🔄 Evolução incremental: sempre criar slices e módulos no local correto, mesmo que só com TODO/mocks.
- 🤖 IA-friendly: arquitetura pensada para automação, agentes e integração com pipelines inteligentes.
- 🧩 Redução da carga cognitiva: organização por contexto, documentação clara, exemplos e automação.

## 🛠️ Exemplos de Uso
- `POST /api/ask` — Prompt para modelos de IA.
- `GET /api/models` — Lista todos os modelos disponíveis.
- `GET /api/projects` — Lista todos os projetos.
- `POST /api/projects` — Cria novo projeto.
- ...

## 📝 Observações
- 🔄 Mantenha este README atualizado sempre que houver mudança estrutural relevante.
- 📚 Consulte o `GUIDELINE.md` para padrões de código, estrutura, nomeação, testes e exemplos detalhados.

---

## 🐳 Scripts e Comandos Úteis para Docker Compose/Swarm

### Subir stack com Docker Swarm
```sh
docker stack deploy -c docker-compose.yml <nome-do-stack>
```

### Listar stacks ativos
```sh
docker stack ls
```

### Ver serviços do stack
```sh
docker stack services <nome-do-stack>
```

### Ver containers/tasks do stack
```sh
docker stack ps <nome-do-stack>
```

### Escalar serviço (ex: 4 réplicas de ollama)
```sh
docker service scale <nome-do-stack>_ollama=4
```

### Ver logs de um serviço
```sh
docker service logs <nome-do-stack>_haproxy
docker service logs <nome-do-stack>_ollama
```

### Remover stack
```sh
docker stack rm <nome-do-stack>
```

### Criar rede overlay (antes do deploy)
```sh
    docker swarm join --token SWMTKN-1-22539711x5rmxzoj1xof4zcn6vmmcpdlciyqys1qq74p5zmyci-1ttala50ciuj98hc7sncpg20n 192.168.100.100:2377
```

### Testar endpoint do HAProxy
```sh
curl http://localhost:11434
```

> **Dica:** Para Compose tradicional, use `docker-compose up -d`, `docker-compose down`, etc.

---
