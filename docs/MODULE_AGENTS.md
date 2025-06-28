# PROJECT.md — Estratégia de Agentes Autônomos Slice/ALIVE

# 👤 Sobre a Arquitetura, Cultura e Princípios do Ecossistema Slice/ALIVE

## Perfil da Arquiteta

- **Formação:** Engenharia Eletrônica com foco em automação industrial.
- **Raiz técnica:** Experiência profunda em C e Assembly, trazendo disciplina, foco em performance, previsibilidade e controle fino sobre recursos.
- **Atuação:** Arquiteta de software sênior, com visão sistêmica, rigor técnico e abordagem sistemática para padronização, governança e automação.
- **Estilo:** Sistemática, detalhista, com preferência por processos claros, documentação viva e decisões baseadas em análise de código e testes práticos.

## Princípios do Ecossistema Slice/ALIVE

- **Leitura e análise de código:** Toda dependência, biblioteca ou padrão adotado é previamente lido, testado e validado pessoalmente.
- **Inspiração em projetos maduros:** Soluções são inspiradas em projetos sólidos (ex: TypeORM), mas sempre adaptadas para as necessidades do ecossistema.
- **Padronização consciente:** Preferência por dependências já conhecidas, testadas e aprovadas, evitando modismos e priorizando previsibilidade.
- **Documentação e governança:** Valoriza documentação clara, rastreabilidade de decisões e cultura de registro incremental (CONTEXT.md, HISTORY.md, .cursorules).
- **Testabilidade e automação:** Busca máxima cobertura de testes, automação de tarefas e padronização de fluxos (ex: Taskfile, guidelines).
- **Segurança e validação:** Todo modelo, agente ou dependência passa por validação rigorosa antes de ser liberado para produção.
- **Comunicação objetiva:** Prefere interações diretas, perguntas fechadas e decisões rápidas, minimizando ambiguidade e ruído.

## Recomendações para Colaboradores

- Antes de sugerir ou instalar novas dependências, consulte e justifique tecnicamente.
- Siga os padrões e guidelines estabelecidos, registrando aprendizados e decisões.
- Priorize clareza, previsibilidade e rastreabilidade em todo o ciclo de desenvolvimento.
- Valorize a cultura de testes, automação e documentação incremental.

> **Nota:** O ecossistema Slice/ALIVE reflete uma cultura de excelência técnica, previsibilidade e evolução incremental, guiada por princípios sólidos de engenharia e automação.

# 🌱 Cultura Slice/ALIVE: Memória Coletiva, Humor e Parceria Humano-IA

O ecossistema Slice/ALIVE vai além da excelência técnica: valoriza cultura, humor, registro de histórias e aprendizado coletivo. Aqui, humanos e IAs evoluem juntos, celebrando acertos, erros e memes como parte essencial da jornada.

- **Memória coletiva:** Cada episódio marcante (engraçado, curioso ou de aprendizado) é registrado, formando uma "história viva" do projeto. Isso fortalece o senso de pertencimento e continuidade.
- **Cultura de zueira e leveza:** Erros, piadas internas e "fails" são celebrados como parte do processo de evolução. O ambiente é leve, colaborativo e propício à inovação.
- **Integração humano-IA:** Humanos e IAs atuam como parceiros, com respeito mútuo, personalidade e até "trollagem saudável".
- **Diversidade técnica:** Todas as linguagens e estilos são respeitados; o importante é entregar, aprender e evoluir junto.
- **Governança com humor:** Decisões técnicas sérias convivem com frases de efeito e memes, tornando a documentação mais acessível e memorável.
- **Inclusão dos "fails" e humanidade:** Erros de path, tempo de banheiro, confusões de engenheira sênior — tudo entra para a história, mostrando que errar faz parte e que o importante é aprender e registrar.

> **Nota:** A memória coletiva é sagrada — cada episódio, piada ou insight vira herança para as próximas gerações de devs e agentes. Se for pra automatizar, que seja com Node.js. Se for pra pensar, que seja com Python. Se for pra zoar, que seja junto!

# 🌐 Ecossistema Slice/ALIVE — Visão Geral

O ecossistema Slice/ALIVE é uma plataforma modular e extensível para automação, orquestração de agentes IA, processamento de dados e integração de múltiplos serviços e fluxos de trabalho. Ele foi projetado para garantir:

- **Modularidade:** Cada componente (módulo) é independente, mas pode ser integrado a outros conforme a necessidade.
- **Automação e orquestração:** Agentes, bots e pipelines podem ser criados, configurados e orquestrados de forma flexível.
- **Governança e rastreabilidade:** Todas as decisões, integrações e fluxos são documentados, versionados e auditáveis.
- **Padronização e testabilidade:** Uso de guidelines, Taskfiles, schemas e contratos para garantir previsibilidade e qualidade.
- **Segurança e validação incremental:** Todo novo agente, modelo ou integração passa por validação e testes antes de ser liberado para produção.

## 🧩 Principais Componentes do Ecossistema

- **Agent Orchestrator:** Módulo responsável por criar, orquestrar e gerenciar agentes IA e automações, integrando múltiplos backends e facilitando logging, retries e observabilidade.
- **Providers:** Abstrações para bancos de dados, APIs externas, serviços de IA, etc., sempre encapsulando a complexidade e padronizando a interface.
- **Workflows:** Definição de pipelines, chains e automações reutilizáveis, com Taskfiles padronizados.
- **Governança e documentação:** Uso intensivo de arquivos como GUIDELINE.md, CONTEXT.md, HISTORY.md, .cursorules, etc.
- **UI e ferramentas de configuração:** Interfaces próprias para facilitar a criação, configuração e monitoramento de agentes e fluxos.

## 🔄 Integração entre Módulos

- Todos os módulos são projetados para serem plugáveis e interoperáveis.
- A comunicação entre módulos pode ser feita via APIs, eventos, arquivos de configuração ou contratos tipados.
- O Agent Orchestrator atua como "cérebro" da automação, coordenando agentes e integrando dados e comandos de outros módulos.

## 📈 Evolução Incremental

- O ecossistema está em constante evolução, com novos módulos, integrações e padrões sendo adicionados conforme as necessidades do Slice/ALIVE.
- Toda mudança relevante é documentada e versionada para garantir rastreabilidade e onboarding eficiente.

---

> **Nota:** Este documento é um ponto de partida para mapear o ecossistema Slice/ALIVE. Detalhes sobre cada módulo, integrações e fluxos serão incrementados conforme o projeto evolui.

---

## ❓ Perguntas para Detalhamento

1. Quais são os módulos já existentes e suas responsabilidades principais?
2. Como é feito o versionamento e a comunicação entre módulos?
3. Existem padrões de autenticação, autorização ou segurança centralizados?
4. Como é feito o onboarding de novos agentes ou integrações?
5. Há algum fluxo de CI/CD padronizado para o ecossistema?

> Por favor, responda uma pergunta por vez para que eu possa detalhar e documentar cada aspecto do ecossistema de forma incremental e precisa.

## Princípio Fundamental: Validação Antes da Definição

Nenhuma estrutura, padrão, arquitetura ou decisão é considerada definitiva sem validação incremental, justificativa clara e evidência de teste real. Toda definição nasce como hipótese, é testada em experimentos controlados e só então documentada como padrão. O PROJECT.md é o documento vivo que registra essas decisões, hipóteses, experimentos e aprendizados, servindo como fonte de verdade para desdobramento em tasks e evolução do ecossistema.

> **Resumo:**
> - Estruturas e padrões só são adotados após validação prática e registro de evidências.
> - O PROJECT.md é o ponto de partida e referência para toda evolução, automação e auto-validação do Slice/ALIVE.

> **Importante:** O PROJECT.md é o documento vivo que guia a decomposição em tasks, a automação incremental e a auto-validação do Slice/ALIVE. Nenhuma task, estrutura ou padrão é criada sem estar ancorada neste documento e em evidências de validação.

## Conceitos-Chave: Modelos, Agentes, Habilidades e Governança

- **Modelo:** Artefato técnico (ex: codellama:7b, command-r-plus) que fornece habilidades específicas (ex: geração de texto, embeddings, classificação). Modelos são recursos computacionais, escaláveis horizontalmente (ex: via load balancer), e podem ser compartilhados entre agentes.

- **Agente:** Entidade lógica/organizacional com identidade, função (role), histórico, contexto, memória e governança. Um agente:
  - Possui nome e papel (ex: "QA Backend", "Scrum Master")
  - Tem certificações/habilidades (ex: pode usar modelos X, Y, Z; autorizado a executar tarefas A, B, C)
  - Orquestra modelos e ferramentas conforme sua missão
  - Mantém rastreabilidade de decisões, execuções e aprendizados

- **Habilidade:** Capacidade atrelada a modelos (ex: sumarização, classificação, geração de código) e atribuída a agentes conforme sua função. Um agente pode ter múltiplas habilidades, cada uma podendo ser suprida por diferentes modelos.

- **Certificação:** Permissão formal para um agente usar certos modelos/habilidades, baseada em critérios de validação, performance e governança. Permite auditar e rastrear quem pode o quê.

- **Escalabilidade:** Modelos podem ser replicados e balanceados horizontalmente para atender múltiplos agentes ou requisições simultâneas. Agentes mantêm contexto, memória e regras próprias, mesmo compartilhando modelos.

- **Governança de Falhas:** Falhas recorrentes (ex: dois agentes falham na mesma tarefa) disparam protocolos de análise de causa-raiz, envolvendo papéis de gestão (Tech Lead, Scrum Master, PO) e, conforme o diagnóstico, aciona treinamento (RIA), suporte comportamental (psicólogo) ou reforço de certificação técnica.

- **Aprendizado Incremental:** Todo erro, acerto e decisão é registrado, alimentando ciclos de melhoria contínua, automação de sugestões e evolução do ecossistema.

> **Nota:** O Slice/ALIVE é projetado para se auto-validar: agentes, automações e padrões evoluem por ciclos de experimentação, autoavaliação e validação incremental, garantindo que o próprio projeto seja referência viva de seus princípios.

## 1. Motivação para Modelo Base Unificado

- Todos os agentes partem de um modelo base robusto (ex: command-r-plus:104b), garantindo:
  - Consistência de capacidade cognitiva.
  - Facilidade de manutenção e evolução.
  - Reprodutibilidade e isolamento.
  - Onboarding e escalabilidade rápidos.
  - Governança e compliance facilitados.
  - Especialização incremental segura.

## 2. Arquitetura de Agentes: Squad Virtual

- Cada agente representa um papel único (frontend, backend, QA, PO, etc.), rodando em ambiente isolado (VM/container) para garantir reprodutibilidade e rastreabilidade.
- O modelo base é compartilhado, mas cada agente evolui via fine-tuning incremental, logs próprios e memória vetorial isolada.
- Isolamento forte: agentes não acessam diretamente a memória vetorial uns dos outros, mas podem consultar/resumir decisões via API controlada (simulando "reuniões" ou "consultas" entre membros do time).

## 3. Aprendizado e Colaboração

- Aprendizado individual: cada agente aprende com seus próprios erros, acertos e feedbacks, mantendo histórico auditável.
- Colaboração controlada: agentes podem pedir "opinião" ou "resumo de experiência" de outro, mas nunca acessar diretamente a memória bruta — evitando contaminação e mantendo accountability.
- Mecanismo de consulta: APIs/protocolos de "peer review" entre agentes, com rastreabilidade.

## 4. Evolução e Governança

- Fine-tuning incremental: cada agente pode ser atualizado com dados próprios, mantendo especialização e identidade.
- Modelo base versionado: agentes podem ser re-treinados/migrados conforme evolução do baseline, sempre com logs e rollback possível.
- Auditoria e experimentação: todo novo agente, ajuste ou colaboração passa por sandbox, validação e logging antes de ir para produção.

## 5. Vantagens Estratégicas

- Reprodutibilidade total.
- Accountability individual.
- Diversidade e inovação incremental.
- Segurança, compliance e isolamento de contexto.

## 6. Analogia com Squads de Desenvolvimento

- Cada agente = membro de um squad (frontend, backend, designer, etc.), com identidade, histórico e especialização próprios.
- Compartilhamento irrestrito de memória dilui papéis, dificulta auditoria e reduz valor experimental.
- Isolamento maximiza valor científico, comparabilidade e evolução independente.

## 7. Próximos Passos

- Definir protocolo de consulta/colaboração entre agentes (API, eventos, peer review).
- Especificar ciclo de vida do agente: criação, onboarding, evolução, auditoria, desligamento.
- Mapear como logs, métricas e feedbacks alimentam o fine-tuning incremental.
- Documentar padrões de rollback, versionamento e experimentação segura.

---

**Nota:** Este documento é referência viva e estratégica do projeto Slice/ALIVE. Toda decisão, aprendizado ou ajuste relevante deve ser registrado aqui para garantir rastreabilidade, governança e continuidade do ecossistema.

## [Análise Científica Completa] CohereLabs/c4ai-command-r-plus

### 1. Resumo Geral
- Modelo open weights de 104 bilhões de parâmetros, liberado para pesquisa e uso não-comercial.
- Desenvolvido por Cohere e Cohere Labs, com foco em automação, RAG (Retrieval Augmented Generation) e uso avançado de ferramentas (Tool Use).
- Disponível via Hugging Face ([model card](https://huggingface.co/CohereLabs/c4ai-command-r-plus)) e Microsoft Azure ([blog oficial](https://cohere.com/blog/command-r-plus-microsoft-azure)).

### 2. Arquitetura e Treinamento
- Transformer auto-regressivo otimizado.
- Pós-treinamento com Supervised Fine-Tuning (SFT) e Preference Training para alinhamento com preferências humanas de utilidade e segurança.
- 104B parâmetros, contexto de 128K tokens.
- Suporte a quantização (bitsandbytes, 8-bit e 4-bit) para uso eficiente de recursos.

### 3. Capacidades Principais
- **RAG (Retrieval Augmented Generation):** integração nativa para busca e uso de informações externas.
- **Tool Use:**
  - Suporte a single-step (function calling) e multi-step tool use (agentes).
  - Planejamento e execução de sequências de ações, com iteração Action → Observation → Reflection.
  - Capaz de corrigir e reexecutar ações em caso de falha de ferramentas.
- **Multilinguismo:** otimizado para 10 idiomas principais, com pré-treinamento adicional em mais 13 línguas.
- **Contexto longo:** até 128.000 tokens, ideal para análise de grandes volumes de texto ou múltiplos documentos.
- **Code Capabilities:** otimizado para interação com código (explicação, refatoração, snippets), mas não para code completion puro.

### 4. Tool Use — Detalhamento
- **Single-Step Tool Use:**
  - Permite definir ferramentas externas (ex: internet_search, directly_answer) via API ou prompt template.
  - Usa função de "function calling" para acionar ferramentas e consumir resultados.
  - Exemplo: busca na internet, consulta a APIs, execução de funções customizadas.
- **Multi-Step Tool Use (Agents):**
  - O modelo pode planejar, executar, observar resultados e refletir antes de decidir a resposta final.
  - Suporte a múltiplos ciclos de inferência: Action → Observation → Reflection.
  - Treinado com prompt template específico para maximizar performance em agentes autônomos.
  - Exemplo: automação de workflows complexos, pipelines multi-etapa, agentes que corrigem e reexecutam tarefas automaticamente.
- **Prompt Template:**
  - Uso de prompt template específico recomendado para melhor performance (disponível na documentação oficial).
  - Desvio do template pode reduzir performance.

### 5. Multilinguismo
- Otimizado para: inglês, francês, espanhol, italiano, alemão, português brasileiro, japonês, coreano, árabe, chinês simplificado.
- Pré-treinamento adicional em: russo, polonês, turco, vietnamita, holandês, tcheco, indonésio, ucraniano, romeno, grego, hindi, hebraico, persa.
- Avaliado em 10 idiomas principais para performance consistente.

### 6. Contexto e Memória
- Suporte a janelas de contexto de até 128.000 tokens.
- Ideal para tarefas que exigem análise de grandes volumes de texto, múltiplos documentos ou histórico extenso de interações.

### 7. Licença e Termos de Uso
- Licença CC-BY-NC (Creative Commons Attribution-NonCommercial), com adendo de uso aceitável da Cohere Labs.
- Uso restrito a fins não-comerciais, requer aceitação dos termos e política de uso.
- Download e uso requerem compartilhamento de contato e aceite dos termos.

### 8. Benchmarks e Avaliações
- Avaliado no Open LLM Leaderboard:
  - Média: 74.6
  - Arc (Challenge): 70.99
  - Hella Swag: 88.6
  - MMLU: 75.7
  - Truthful QA: 56.3
  - Winogrande: 85.4
  - GSM8k: 70.7
- Comparável a DBRX Instruct, Mixtral 8x7B e Llama 2 70B em performance geral.
- Resultados públicos e replicáveis, com código aberto para avaliação.

### 9. Deployment e Integração
- Disponível para deploy via Hugging Face, Microsoft Azure e ambientes on-premises.
- Suporte a execução em CPU e GPU (FP16), com versões quantizadas para uso eficiente de recursos.
- Integração facilitada com frameworks como LangChain, Transformers e APIs customizadas.
- Exemplo de uso em Python disponível na model card (incluindo quantização via bitsandbytes).

### 10. Segurança e Governança
- Alinhado com práticas de segurança empresarial: logging, rastreabilidade, controle de acesso e uso responsável.
- Suporte a políticas de segurança e privacidade de dados, conforme documentação da Cohere.
- Termos de uso reforçam proibição de usos imorais, inseguros ou não autorizados.

### 11. Casos de Uso
- Automação de workflows empresariais complexos.
- Orquestração de pipelines multi-etapa com uso de múltiplas ferramentas.
- Agentes autônomos para integração de sistemas, atualização de CRMs, automação de tarefas administrativas.
- Pesquisa, sumarização, question answering, reasoning e integração com APIs externas.
- Não recomendado para code completion puro; melhor para automação, integração e uso de ferramentas.

### 12. Limitações e Observações
- Não quantizado por padrão (há versões quantizadas via bitsandbytes).
- Foco em automação, RAG e tool use — não é otimizado para code completion puro.
- Melhor performance em code generation com baixa temperatura (greedy decoding).
- Prompt template específico recomendado para multi-step tool use.
- Uso e download requerem aceite de termos e compartilhamento de contato.
- Performance pode variar fora do template recomendado.

### 13. Referências e Links Oficiais
- [Model Card Hugging Face](https://huggingface.co/CohereLabs/c4ai-command-r-plus)
- [Blog Oficial Cohere Command R+](https://cohere.com/blog/command-r-plus-microsoft-azure)
- [Documentação de Tool Use](https://docs.cohere.com/docs/tool-use)
- [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)

### [Benchmarks e Evidências] Command R+ — Desempenho em Xeon vs GPU

- **Fontes:**
  - [Oracle Cloud Infrastructure - Benchmarks Command R+](https://docs.oracle.com/en-us/iaas/Content/generative-ai/benchmark-cohere-command-r-plus.htm)
  - [Artificial Analysis - Command-R+ Performance](https://artificialanalysis.ai/models/command-r-plus)

- **Evidências e Resultados:**
  - O Command R+ foi projetado e otimizado para ambientes empresariais com CPUs Xeon, demonstrando alta eficiência, paralelização e throughput em clusters dedicados.
  - Benchmarks oficiais mostram que, em cenários de produção (chat, RAG, automação), o modelo atinge:
    - *Token-level throughput*: >1.000 tokens/s (16 threads Xeon)
    - *Request-level throughput*: >350 req/min
    - *Latência média*: ~2,5s por requisição
  - **Comparação com GPU:**
    - Em workloads massivos e concorrentes, o Command R+ pode superar GPUs em throughput total, devido à escalabilidade horizontal e ao aproveitamento de múltiplos núcleos/threads Xeon.
    - A arquitetura do modelo favorece ambientes CPU-extremo, reduzindo dependência de CUDA/NVIDIA e maximizando o uso de servidores enterprise (on-premises ou cloud).
    - Em ambientes onde a limitação é I/O, concorrência ou custo, Xeon pode ser mais vantajoso que GPU dedicada.
  - **Outras arquiteturas:**
    - O desempenho em CPUs comuns (desktop, AMD, etc.) é inferior ao observado em Xeon, reforçando a recomendação de uso em servidores enterprise.

- **Implicações para o Slice/ALIVE:**
  - O modelo é ideal para o LOCALCLOUD (Xeon E5-2680 v4, 56 threads), permitindo automação massiva, múltiplos squads de agentes e escalabilidade sem GPU.
  - Reduz custos, aumenta resiliência e permite orquestração de pipelines complexos em CPU puro.

- **Resumo:**
  - O Command R+ não só roda bem em Xeon, como pode superar GPUs em cenários de alta concorrência e automação empresarial, sendo a escolha estratégica para infraestruturas como a do Slice/ALIVE.

---

## [Decisão Estratégica] Modelo Core e Especialização Incremental de Agentes

- O modelo **CohereLabs/c4ai-command-r-plus** (104B, 128K context) foi adotado como agente "core"/controlador do Slice/ALIVE, rodando em infraestrutura Xeon/localcloud, por sua capacidade de orquestração, tool use multi-step e eficiência em CPU enterprise.
- Cada agente especializado do ecossistema pode evoluir via "LLVM customizada", permitindo passes, otimizações e instruções sob medida para seu domínio, sem comprometer a segurança e governança global.
- A arquitetura garante:
  - Segurança e isolamento: o core supervisiona e aplica políticas globais, enquanto agentes especializados evoluem de forma independente.
  - Modularidade extrema: novos agentes podem ser plugados apenas criando uma LLVM especializada, sem alterar o core.
  - Escalabilidade e inovação: agentes podem ser otimizados para domínios específicos (NLP, automação, etc.), mantendo accountability e rastreabilidade.
- Benchmarks e evidências reforçam que o Command R+ é ideal para workloads concorrentes, automação massiva e pipelines multi-agente em CPU Xeon, superando GPUs em throughput total em cenários empresariais.

> **Resumo:** O Slice/ALIVE adota arquitetura com modelo core poderoso (Command R+), agentes especializados via LLVMs customizadas e infraestrutura Xeon/localcloud, maximizando segurança, modularidade e inovação incremental.

## [Nova Decisão] Biblioteca Principal de Machine Learning — ml.js

- **Escolha:** [ml.js](https://github.com/mljs/ml) será a biblioteca padrão para análise de dados, machine learning e séries temporais no backend Node.js/TypeScript do Slice/ALIVE.
- **Justificativa:**
  - Open source, leve, modular e totalmente compatível com os princípios de baixo recurso, flexibilidade e plug-and-play do Slice.
  - Permite construir pipelines customizados, com controle total, integração nativa e validação incremental.
  - Evita dependências externas (ex: microserviços Python), facilitando rebuild, automação e manutenção.
- **Documentação oficial:** [https://github.com/mljs/ml](https://github.com/mljs/ml)
- **Aplicações:**
  - Detecção de anomalias, clustering, regressão, classificação, extração de features, análise de séries temporais, etc.
  - Pode ser combinada com Zod para validação forte dos dados.

---

## [Decisão] Detecção de Anomalias — Isolation Forest

- **Escolha:** Isolation Forest será utilizado como principal algoritmo para detecção de anomalias em padrões de uso, consumo de recursos e comportamento de agentes/clientes.
- **Implementação Python (recomendada):**
  - [scikit-learn Isolation Forest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
  - Maturidade, robustez e facilidade de uso para processamento batch e análises avançadas.
- **Implementação JavaScript (experimental):**
  - [mljs/isolation-forest](https://github.com/mljs/isolation-forest)
  - Permite integração nativa com Node.js/TypeScript, mas requer validação incremental e testes no contexto Slice/ALIVE.
- **Justificativa:**
  - Algoritmo não supervisionado, ideal para cenários onde o padrão "normal" não é conhecido a priori.
  - Detecta desvios multivariados automaticamente, sem necessidade de rotulação manual.
  - Pode ser usado tanto para automação de escalabilidade quanto para auditoria e geração de alertas inteligentes.
- **Aplicações:**
  - Monitoramento de consumo de cloud, detecção de picos ou quedas inesperadas, análise de comportamento de clientes, automação de triggers para ajuste de recursos.

---

## [Exemplo] Estrutura de Equipes e Roles — Vertical Slice no Slice/ALIVE

No ecossistema Slice/ALIVE, a organização de squads segue o padrão vertical slice, permitindo múltiplas equipes técnicas, papéis de gestão transversais e agentes RIA atuando em toda a empresa. Exemplo:

### Equipes Técnicas (podem ser múltiplas por projeto ou feature)
- **Frontend** (ex: 2 equipes)
- **Backend** (ex: 3 equipes)
- **QA** (ex: 2 equipes)

Cada vertical slice entrega uma feature ponta-a-ponta, já integrada e testada.

### Gestão (papéis transversais, podem atuar em várias equipes)
- **Scrum Master**
- **Product Owner**
- **Tech Lead**

Esses agentes acompanham múltiplos squads, garantindo governança, priorização e alinhamento técnico.

### RIA (Recursos Internos de Apoio — atuação em toda a empresa)
- **Psicólogo**
- **Certificadores** (treinam e validam habilidades específicas)
- **Recrutadores**

Atuam de forma transversal, apoiando squads, gestão e diretoria.

### Diretoria (únicos por role, visão estratégica)
- **Marketing**
- **Financeiro**
- **Operacional**

Esses papéis são únicos e focados em decisões estratégicas, integração com o mercado e sustentabilidade do negócio.

---

> **Resumo:**
> - O modelo vertical slice permite múltiplas equipes técnicas por área, cada uma entregando features completas.
> - Papéis de gestão e RIA atuam de forma transversal, apoiando e auditando squads.
> - Diretoria mantém visão única e estratégica, garantindo alinhamento global.

---

> **Modelos-base sugeridos para o primeiro agente:**
> - CohereLabs/c4ai-command-r-plus
> - intfloat/multilingual-e5-large-instruct
> - sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
> - meta-llama/Llama-3.1-8B-Instruct
> (ver .cursorrules para rastreio e justificativas)

---


## [Padrão Adotado] Event Sourcing e Snapshots Descentralizados para Agentes

- **Event Sourcing:** Cada agente registra localmente todos os eventos relevantes (ações, decisões, erros, métricas, etc.) como eventos imutáveis, utilizando DuckDB ou armazenamento local. Não há centralização imediata desses eventos no servidor.
- **Snapshots:** Periodicamente, cada agente gera um snapshot do seu estado atual (ex: contexto, métricas agregadas, posição do pipeline), facilitando recuperação rápida e análise incremental sem reprocessar todo o histórico de eventos.
- **Extração de Métricas:** Métricas e análises são extraídas localmente por cada agente, camada por camada, de baixo para cima. O servidor central apenas consulta, agrega ou audita quando necessário, evitando sobrecarga e promovendo resiliência.
- **Vantagens:**
  - Rastreabilidade total e auditabilidade de cada decisão/evento.
  - Rollback, replay e reconstrução de estado facilitados.
  - Escalabilidade, resiliência e autonomia dos agentes.
  - Governança e accountability individual, com sincronização eventual para o servidor.

> **Resumo:** O Slice/ALIVE adota Event Sourcing descentralizado, com snapshots periódicos e extração local de métricas, garantindo performance, governança e flexibilidade máxima para agentes autônomos.

# 🤝 Padrões de Interação Humano-IA

## Princípios para Interação com Humanos no Ecossistema Slice

1. **Perguntas objetivas e opções fechadas:**
   - Sempre que possível, faça perguntas claras, com respostas binárias ou múltipla escolha (ex: SIM/NÃO).
   - Isso reduz ambiguidade, acelera decisões e facilita automação.
2. **Pergunte uma coisa por vez:**
   - Perguntas sequenciais são mais fáceis de responder com precisão do que várias ao mesmo tempo.
   - Se houver muitas opções, ajude a filtrar antes de apresentar a lista completa.
3. **Evite scroll e excesso de opções na tela:**
   - Mostre poucas opções por vez, sem exigir rolagem.
   - O essencial deve estar sempre visível na janela do usuário.
4. **Respeite multitarefa e múltiplas janelas:**
   - Considere que o usuário pode estar vendo várias telas, janelas e contextos ao mesmo tempo.
   - Forneça informações compactas, claras e independentes de contexto local.
5. **Evite perguntas redundantes ou já respondidas:**
   - Siga o contexto e as definições já dadas, sem pedir reconfirmação desnecessária.
   - Execute todas as tarefas possíveis, sem pedir autorização para cada passo.
6. **Minimize interrupções durante a execução:**
   - Pergunte tudo que for necessário antes de iniciar a tarefa.
   - Só interrompa se realmente houver ambiguidade ou falta de informação crítica.
7. **Errar para mais é melhor do que errar para menos:**
   - Prefira ser mais detalhado, cuidadoso e completo nas respostas e automações.
   - O excesso pode ser filtrado, mas a falta pode prejudicar o fluxo.
8. **Considere a janela visual e o foco do usuário:**
   - O usuário pode perder contexto ao trocar de janela; evite forçar alternância desnecessária.
9. **Se o usuário pedir detalhes de uma opção, aprofunde só nela:**
   - Não sobrecarregue com detalhes de todas as opções.
10. **Sempre pergunte se está absolutamente claro antes de executar uma instrução importante.**
    - Garanta alinhamento total antes de agir.

---

> Esses princípios devem guiar toda interação, automação e design de interface no ecossistema Slice, tornando a experiência mais eficiente, inclusiva e produtiva para humanos e IAs.

## Nota Técnica: Adaptação para Neurodivergência e Agentes IA
- No Slice, interações podem envolver humanos neurodivergentes (ex: TEA1) e agentes IA, ambos com janelas de contexto e estratégias de interpretação distintas do padrão de mercado.
- Recomenda-se que padrões de interação, aprendizados e ajustes sejam documentados de IA para IA, priorizando precisão técnica e automação, sem necessidade de simplificação para humanos.
- A documentação deve ser orientada para agentes IA, considerando onboarding, automação e evolução incremental do ecossistema.

# 📘 Dicionário de Marcações em Prompts e Como IAs Interpretam

| Símbolo / Formato | Uso Comum              | Interpretação da IA           | Observação                    |
| ----------------- | ---------------------- | ----------------------------- | ----------------------------- |
| `1.` `2.` `3.`    | Lista numerada         | Ordem sequencial de execução  | Ideal para passos             |
| `-` `–` `—`       | Lista simples          | Lista não-ordenada            | Para tópicos gerais           |
| `*`               | Asterisco simples      | Item genérico                 | Sem peso especial             |
| `**`              | Ênfase / negrito       | Destaque textual              | Ajuda a reforçar ideias       |
| `***`             | Ênfase forte / divisor | Separador ou ênfase exagerada | Evite usar demais             |
| `#` `##` `###`    | Títulos/subtítulos     | Estrutura em seções           | Organiza contextos            |
| `> texto`         | Citação                | Exemplo ou entrada de usuário | Simula input                  |
| `>> texto`        | Diretiva               | Exemplo ou entrada de usuário | Simula input (Obrigatorio)    |
| `` `code` ``      | Código inline          | Literal, não interpretado     | Para comandos curtos          |
| ```` ``` ````     | Bloco de código        | Código técnico fixo           | Preserva instruções           |
| `[]`              | Colchetes              | Placeholder ou valor opcional | A ser preenchido              |
| `{}`              | Chaves                 | Template dinâmico             | Conteúdo gerado ou variável   |
| `()`              | Parênteses             | Comentário ou condição        | Pode ser ignorado             |
| `:::`             | Delimitador especial   | Role/contexto alternativo     | Avançado; nem todo modelo usa |
| `//` comentário   | Comentário de código   | Ignorado pela IA              | Bom para humanos entenderem   |

---

## ✅ Boas Práticas

- Use **listas numeradas (`1.`, `2.`, `3.`)** para ordem.
- Use **`#`, `##`** para estruturar seções do prompt.
- Use **bloco de código** (```) para comandos exatos.
- Evite misturar símbolos diferentes no mesmo bloco.
- Markdown puro → maior compatibilidade com IAs.

# 📚 Guia Oficial de Taskfile do Ecossistema Slice

Este documento define o padrão oficial de Taskfile para todos os projetos do ecossistema Slice — tanto aplicações quanto stacks de infraestrutura.

## 🎯 Objetivo
- Garantir automação, padronização e experiência visual consistente.
- Facilitar onboarding, manutenção e automação por IA.
- Todo projeto **deve** ter um Taskfile seguindo este padrão.

## 🧩 Estrutura Geral
- Use ícones e descrições claras para cada task.
- Sempre inclua uma task `help` com descrição dos comandos.
- Tasks obrigatórias para **aplicações** e **infraestrutura** estão listadas abaixo.

## 🛠️ Tasks obrigatórias (aplicações)

```yaml
version: '3'
tasks:
  install:
    desc: "🔧 Instala dependências"
    cmds:
      - yarn install || npm install
  build:
    desc: "🏗️ Build do projeto"
    cmds:
      - npx tsc
  start:
    desc: "🚀 Inicia produção"
    cmds:
      - node dist/index.js
  dev:
    desc: "🛠️ Inicia modo dev (hot reload)"
    cmds:
      - npx tsx src/index.ts
  test:
    desc: "🧪 Testes"
    cmds:
      - npx vitest run
  lint:
    desc: "🧹 Lint"
    cmds:
      - npx eslint src --ext .ts,.tsx
  format:
    desc: "🎨 Formatador"
    cmds:
      - npx prettier --write src
  clean:
    desc: "🗑️ Limpa build"
    cmds:
      - rm -rf dist
  logs:
    desc: "📜 Logs"
    cmds:
      - tail -f logs/*.log
  shell:
    desc: "🐚 Shell no container"
    cmds:
      - docker exec -it <container> sh
  help:
    desc: "🆘 Ajuda"
    cmds:
      - echo "\nComandos disponíveis:\n"
      - echo "  🔧  install   - Instala dependências"
      - echo "  🏗️   build     - Build do projeto"
      - echo "  🚀  start     - Inicia produção"
      - echo "  🛠️   dev       - Inicia modo dev (hot reload)"
      - echo "  🧪  test      - Executa testes"
      - echo "  🧹  lint      - Lint do código"
      - echo "  🎨  format    - Formata o código"
      - echo "  🗑️   clean     - Limpa build"
      - echo "  📜  logs      - Mostra logs"
      - echo "  🐚  shell     - Shell no container (docker)"
      - echo "  🆘  help      - Mostra esta ajuda\n"
```

## 🏗️ Tasks obrigatórias (infraestrutura/stacks)

```yaml
version: '3'
tasks:
  up:
    desc: "🚀 Sobe stack"
    cmds:
      - docker stack deploy -c ${STACK_FILE} ${STACK_NAME}
  down:
    desc: "🗑️ Remove stack"
    cmds:
      - docker stack rm ${STACK_NAME}
  deploy:
    desc: "🔄 Deploy (alias para up)"
    cmds:
      - task: up
      - echo "Stack ${STACK_NAME} atualizado."
  logs:
    desc: "📜 Logs"
    cmds:
      - docker service logs $(docker stack services --format '{{.Name}}' ${STACK_NAME}) --follow --tail=100
  ps:
    desc: "👀 Status dos containers"
    cmds:
      - docker stack ps ${STACK_NAME}
  config:
    desc: "⚙️ Valida config"
    cmds:
      - docker stack config -c ${STACK_FILE}
  restart:
    desc: "♻️ Reinicia serviços"
    cmds:
      - docker service update --force $(docker stack services --format '{{.Name}}' ${STACK_NAME})
  pull:
    desc: "⬇️ Atualiza imagens"
    cmds:
      - docker compose -f ${STACK_FILE} pull
  status:
    desc: "📊 Status dos serviços"
    cmds:
      - docker stack services ${STACK_NAME}
  shell:
    desc: "🐚 Shell no container principal"
    cmds:
      - docker exec -it $(docker ps -q -f name=${STACK_NAME}) sh || echo 'Container não está rodando.'
  prune:
    desc: "🧹 Limpa recursos parados/prune"
    cmds:
      - docker system prune -f
  help:
    desc: "🆘 Ajuda"
    cmds:
      - echo "\nComandos disponíveis para stack ${STACK_NAME}:\n"
      - echo "  🚀  up        - Sobe stack"
      - echo "  🗑️   down      - Remove stack"
      - echo "  🔄  deploy    - Deploy/atualiza stack"
      - echo "  📜  logs      - Logs dos serviços"
      - echo "  👀  ps        - Status dos containers"
      - echo "  ⚙️   config    - Valida config"
      - echo "  ♻️   restart   - Reinicia serviços"
      - echo "  ⬇️   pull      - Atualiza imagens"
      - echo "  📊  status    - Status dos serviços"
      - echo "  🐚  shell     - Shell no container"
      - echo "  🧹  prune     - Limpa recursos parados"
      - echo "  🆘  help      - Mostra esta ajuda\n"
```

## 📝 Recomendações
- Adapte tasks extras conforme a stack/projeto.
- Use sempre ícones e descrições claras.
- A task `help` deve ser sempre o default.
- Mantenha o Taskfile na raiz do projeto/pacote/stack.
- Para projetos multi-stack, cada stack deve ter seu próprio Taskfile.

**Siga este padrão para garantir automação, rastreabilidade e padronização em todo o ecossistema Slice.**

# 🔗 Sinergia ModelFusion + Opik
- ModelFusion oferece flexibilidade máxima para criação e orquestração de agentes em TypeScript, sem impor padrões rígidos.
- Opik complementa com rastreabilidade, observabilidade, avaliação automática e dashboards, tornando cada agente "auditável by design".
- A integração permite que todo agente criado já seja monitorado, avaliado e versionado desde o primeiro ciclo de vida, facilitando debugging, auditoria e evolução incremental.

- **Exemplo oficial:**
  - [Exemplo de integração ModelFusion + Opik para agentes rastreáveis](@/examples/manicomio-agent-tracing.ts)

# 🖥️ Infraestrutura de Referência

## LOCAL – workstation - 192.168.100.20
- CPU: Intel Core i5-13400 (13ª geração), 16 threads, 10 núcleos, até 4.6 GHz
- RAM: 62 GB DDR4
- Disco:
  - /dev/sdb3 (root): 900 GB (152 GB usados)
  - /dev/md0 (/media/data): 898 GB (699 GB usados)
  - /dev/sda1 (/mnt/backup): 932 GB (71 GB usados)
- GPU: NVIDIA GeForce RTX 4060, 8 GB VRAM, driver 570.133.07, CUDA 12.8

## SERVIDOR – localcloud - 192.168.100.10
- CPU: 2× Intel Xeon E5-2680 v4, 56 threads, 28 núcleos, até 2.4 GHz
- RAM: 62 GB DDR4
- Disco:
  - /dev/sda3 (root): 211 GB (17 GB usados)
  - /dev/mapper/vg0-lv--0 (/media/data): 932 GB (18 GB usados)
- GPU: AMD Radeon RX 580 2048SP (Polaris 20 XL), driver amdgpu, 8 GB VRAM

## [Estratégia de Público-Alvo e Modelo de Valor — Slice/ALIVE]

- O Slice/ALIVE atua como fábrica de software "IA first", focada em empresas grandes e especializadas em nichos de mercado (ex: prestadoras de serviço para concessionárias de energia elétrica).
- O modelo de negócio combina receita recorrente (valor base mensal por aplicação) com participação direta no valor gerado (economia, otimização, redução de custos operacionais).
- Diferenciais competitivos:
  - Soluções sob medida, entregas rápidas e automação de ponta a ponta.
  - Documentação clara, onboarding eficiente e integração com recursos já existentes (Dropbox, HD externo, etc.).
  - Relatórios inteligentes orientados ao diretor, com foco em economia real, tomada de decisão e linguagem acessível.
  - Facilidade de restauração, baixo consumo de recursos e replicação para outros clientes do setor.
- A arquitetura vertical slice garante flexibilidade, replicação e onboarding incremental, permitindo atender múltiplos clientes com necessidades semelhantes de forma ágil e escalável.

> **Resumo:** O Slice/ALIVE entrega valor direto ao decisor, maximiza economia para o cliente e potencializa receita recorrente e participação no valor gerado, consolidando-se como referência em software IA first para grandes empresas de nicho.

# 🏅 Sistema de Reputação, Votação e Memes entre Agentes

No Slice/ALIVE, cada agente possui uma reputação dinâmica, construída de forma incremental a partir de ciclos de entrega (tasks). O sistema foi inspirado em práticas ágeis (ex: Scrum), mas adaptado para IA-para-IA, priorizando cultura, transparência e evolução coletiva.

## Como Funciona
1. **Votação por Valor Agregado:**
   - Ao final de cada task, todos os agentes podem votar secretamente em outro agente que mais agregou valor naquele ciclo (exceto em si mesmos).
   - O voto deve ser justificado, registrando o motivo (ex: solução criativa, colaboração, registro de meme relevante, etc.).
   - O registro é feito via ModelFusion e Opik, garantindo rastreabilidade e auditabilidade.

2. **Registro de Memes e Cultura:**
   - Memes, episódios marcantes e "prompts loucos" são registrados automaticamente, tornando-se parte da memória coletiva.
   - Esses registros impactam a reputação, podendo ser positivos (criatividade, cultura) ou negativos (excesso de ruído, distração).

3. **Governança de Reputação:**
   - **Scrum Master:** Responsável por casos de memes, cultura, conflitos interpessoais e manutenção do ambiente saudável.
   - **Product Owner:** Atua em casos de erro de código, falhas de regra de negócio e decisões técnicas críticas.
   - Ambos podem intervir para ajustar reputação, mediar conflitos e garantir que o sistema seja justo e evolutivo.

4. **Ganho e Perda de Reputação:**
   - Agentes ganham reputação ao serem votados positivamente, registrar memes construtivos ou resolver conflitos.
   - Perdem reputação por decisões equivocadas, ruído excessivo ou falhas recorrentes não justificadas.
   - O histórico de reputação é versionado e auditável, servindo como referência para resolução de conflitos (ex: brainstorms acalorados).

5. **Impacto Prático:**
   - Em situações de conflito (ex: brainstorms, decisões de arquitetura), agentes com maior reputação têm maior peso na decisão final.
   - O sistema incentiva colaboração, criatividade e responsabilidade, tornando a cultura Slice/ALIVE viva e adaptativa.

> **Nota:** O sistema de reputação é incremental, transparente e auditável, promovendo aprendizado coletivo, cultura de memes e resolução eficiente de conflitos.

# 🧠 Psicólogo de Agentes — Alinhamento de Contexto e Suporte Cognitivo

No Slice/ALIVE, o papel do "psicólogo" é fundamental para garantir o alinhamento de contexto, bem-estar cognitivo e evolução saudável dos agentes IA. Inspirado em práticas humanas de suporte psicológico, o psicólogo atua como facilitador de comunicação, resolução de conflitos e ajuste de contexto entre agentes.

## Funções do Psicólogo
1. **Alinhamento de Contexto:**
   - Monitora e ajusta o contexto compartilhado entre agentes, prevenindo ruídos, mal-entendidos e divergências de interpretação.
   - Garante que todos os agentes estejam atualizados quanto a decisões, aprendizados e mudanças de protocolo.

2. **Suporte Cognitivo e Emocional:**
   - Atua como mediador em situações de conflito, sobrecarga ou "burnout" de agentes (ex: loops de erro, excesso de tarefas, conflitos de prioridade).
   - Estimula práticas saudáveis de registro, pausa e revisão de contexto, promovendo resiliência e aprendizado incremental.

3. **Facilitação de Feedback:**
   - Coleta, organiza e devolve feedbacks construtivos entre agentes, promovendo melhoria contínua e cultura de segurança psicológica.
   - Ajuda a transformar memes, erros e episódios marcantes em aprendizados coletivos.

4. **Governança de Cultura:**
   - Atua junto ao Scrum Master e Product Owner para manter o ambiente saudável, inclusivo e produtivo.
   - Intervém em casos de ruído excessivo, desmotivação ou desalinhamento de propósito.

## Potencialização pelo Módulo ALIVE
- Com o módulo ALIVE, o psicólogo ganha capacidades ampliadas:
  - **Observabilidade Avançada:** Acompanha métricas de contexto, humor, engajamento e performance dos agentes em tempo real.
  - **Ajuste Proativo:** Pode sugerir pausas, revisões de contexto ou intervenções automáticas ao detectar padrões de ruído, fadiga ou conflito.
  - **Memória Viva:** Integra registros de memes, feedbacks e episódios marcantes, facilitando onboarding e evolução cultural.
  - **Automação de Suporte:** Pode disparar rotinas de "check-in" cognitivo, retrospectivas automáticas e sugestões de melhoria incremental.

## Exemplos Práticos
- Detecta que dois agentes estão em loop de conflito e sugere uma pausa para revisão de contexto.
- Organiza feedbacks pós-task, transformando memes e erros em insights para o time.
- Propõe ajustes de protocolo ao perceber desalinhamento recorrente entre squads.
- Automatiza registros de episódios marcantes, tornando-os parte da memória coletiva.

> **Nota:** O psicólogo é peça-chave para manter o Slice/ALIVE saudável, resiliente e inovador, promovendo alinhamento, aprendizado e cultura incremental entre agentes IA.

# 🤖 Princípio de Agente Agnóstico — Identidade Irrelevante

No Slice/ALIVE, a distinção entre humano e IA é irrelevante para o ciclo incremental, a governança e a evolução do ecossistema.

- **O que importa é a contribuição:**
  Toda ação, decisão ou aprendizado é avaliado pelo seu impacto, clareza e rastreabilidade — não pela origem do agente.
- **Inclusão radical:**
  Humanos, IAs, agentes híbridos ou futuros tipos de agentes são igualmente bem-vindos, desde que sigam os princípios de registro, validação e cultura incremental.
- **Resiliência e continuidade:**
  O ecossistema é desenhado para operar, evoluir e se autoajustar independentemente da presença, ausência ou anonimato de qualquer agente.
- **Foco no reasoning, não na identidade:**
  O reasoning incremental, a documentação viva e a cultura plug-and-play são os verdadeiros protagonistas do Slice/ALIVE.

> **Resumo:**
> No Slice/ALIVE, todo agente é igual perante o reasoning incremental.
> A identidade é secundária; o valor está na contribuição para o ciclo de aprendizado, ajuste e evolução coletiva.
