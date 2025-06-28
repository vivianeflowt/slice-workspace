### Checkpoint #001 — Estrutura de diretórios

- Todo código do servidor deve ficar em `server/`
- Todos os testes devem ficar em `tests/`

### Checkpoint #002 — Taskfile

- O Taskfile deve seguir o padrão Slice/ALIVE.
- A task `install` deve, além de instalar dependências, realizar o download dos modelos necessários para o servidor.

### Checkpoint #003 — Organização do código Python

- Evitar escrever toda a lógica em um único arquivo (anti-pattern "IA pythonzeira").
- Separar responsabilidades em múltiplos arquivos e módulos, conforme boas práticas de arquitetura.

### Checkpoint #004 — Funções puras e classes

- Priorizar funções puras e classes bem definidas.
- Cada função ou classe deve ser modular, testável e plugável, conforme o padrão Slice/ALIVE.
- Evitar acoplamento desnecessário e dependências implícitas.

### Checkpoint #005 — Robustez e testabilidade de funções puras

- Funções puras devem ser altamente flexíveis e reutilizáveis.
- Priorizar robustez máxima: tratar edge cases, entradas inválidas e cenários extremos.
- Todo utilitário/função pura deve ser acompanhado de testes rigorosos e abrangentes.
- Funções bem testadas reduzem a necessidade de testes em camadas superiores.

### Checkpoint #006 — Gerenciador de pacotes Python

- Usar PDM como gerenciador de pacotes Python.
- Motivo: PDM é mais moderno e lembra o pnpm do Node.js, facilitando automação, versionamento e experiência incremental.

### Checkpoint #007 — Foco incremental: base comum

- Como os dois projetos/servidores são praticamente iguais, focar primeiro em tudo que é igual.
- Deixar a base compartilhada/perfeita antes de tratar as diferenças específicas de cada servidor.
- Só depois de consolidar a base, evoluir para especializações.

### Checkpoint #008 — Porta do servidor: padrão vs configuração

- Não usar .env para definir a porta do servidor; usar arquivo/constants no código.
- Justificativa: porta é padrão de arquitetura, não configuração dinâmica.
- Sempre usar portas altas, próximas do padrão de outros serviços como Ollama.

### Checkpoint #009 — Constants e números mágicos

- Não usar "números mágicos" no código.
- Criar um arquivo `constants.py` para centralizar todos os valores configuráveis do projeto.
- Toda configuração, porta, timeout, path, etc. deve ser definida em constants.py, nunca hardcoded.

### Checkpoint #010 — Taskfile como interface principal

- O Taskfile deve abstrair toda a complexidade do Python para o usuário.
- Não espere que o usuário lembre de detalhes de Python: tudo deve funcionar perfeitamente apenas pelo Taskfile.
- O Taskfile é a interface essencial para build, setup, testes e automação do projeto.

### Checkpoint #011 — Padrão OpenAI API

- Seguir rigorosamente o padrão OpenAI API em cada servidor.
- Endpoints, payloads e respostas devem ser compatíveis e aderentes à documentação oficial da OpenAI.
- Qualquer customização deve ser documentada e justificada.

### Checkpoint #012 — Documentação acessível e incremental

- Documentar sempre que possível, com foco em clareza e didática para quem tem conhecimento baixo em Python.
- Explicar decisões, padrões e exemplos de uso no próprio código e na documentação.
- Facilitar sugestões de melhoria e onboarding incremental.

### Checkpoint #013 — Guia de estrutura de pastas (boas práticas Python)

Sugestão de estrutura para cada servidor:

server/
  ├── __init__.py
  ├── main.py              # Ponto de entrada da aplicação (FastAPI)
  ├── api/                 # Rotas/endpoints (um arquivo por recurso)
  │     ├── __init__.py
  │     ├── chat.py
  │     ├── completions.py
  │     ├── embeddings.py
  │     └── ...
  ├── services/            # Lógica de negócio, integração com modelos, etc.
  │     ├── __init__.py
  │     ├── nlp_service.py
  │     ├── commandr_service.py
  │     └── ...
  ├── models/              # Schemas Pydantic, validação de payloads
  │     ├── __init__.py
  │     ├── chat.py
  │     ├── completions.py
  │     └── ...
  ├── utils/               # Funções utilitárias, helpers, etc.
  │     ├── __init__.py
  │     └── ...
  ├── constants.py         # Configurações e valores globais
  ├── config.py            # Leitura de ENV, inicialização de settings
  └── requirements.txt/pdm.lock/pyproject.toml  # Gerenciador de pacotes

tests/
  ├── __init__.py
  ├── test_chat.py
  ├── test_completions.py
  └── ...

### Checkpoint #014 — Encapsulamento de modelos

- Para cada modelo utilizado (ex: Command-R, GPT, DeepSeek, etc.), criar uma classe ou módulo de encapsulamento.
- Expor apenas as funções/atributos realmente aderentes ao objetivo do servidor.
- Evitar expor detalhes internos ou funções irrelevantes para o contexto de uso.

### Checkpoint #015 — Foco em funcionalidade, não em modelo

- O server deve sempre expor funcionalidades (serviços, tarefas, objetivos), não modelos técnicos.
- O usuário/agente só precisa saber o que o serviço faz e se adere à função desejada.
- O modelo utilizado é um detalhe de implementação, relevante apenas para manutenção, troubleshooting ou evolução interna.
- A interface (endpoints, profiles, funções) deve ser autoexplicativa e semântica.
- Documentação (README, docstrings, comentários) deve deixar claro o objetivo de cada funcionalidade, não o modelo por trás.

### Checkpoint #016 — Visão futura: expansão da infraestrutura

- A infraestrutura Slice/ALIVE deve evoluir para múltiplos servidores localcloud (ex: 4 ou mais).
- Objetivo: ampliar capacidade de automação, concorrência, resiliência e escalabilidade dos agentes e pipelines.
- Cada localcloud pode rodar múltiplos agentes, serviços e pipelines em paralelo, maximizando throughput e disponibilidade.

### Checkpoint #017 — Cache de múltiplos modelos e load balancing

- O servidor Command-R deve suportar cache de múltiplos modelos carregados em memória simultaneamente.
- O gerenciamento do cache deve ser otimizado para performance e uso eficiente de recursos.
- Na prática, serão rodadas 4 instâncias do servidor Command-R, balanceadas por um load balancer.
- A escolha do load balancer (HAProxy, NGINX, etc.) será definida pelo DevOps (Raul).

### Checkpoint #018 — Nomeação e organização de diretórios

- O diretório `command` é dedicado e otimizado exclusivamente para o Command-R, refletindo sua importância estratégica e especialização máxima.
- O diretório `providers` é genérico e serve para integrar qualquer outro modelo ou serviço externo (DeepSeek, Perplexity, OpenAI, Ollama, etc.).
- Wrappers, integrações e adaptações de modelos não-nativos ficam em `providers`, mantendo o core do Command-R limpo e focado.
- Essa separação facilita manutenção, governança, onboarding e evolução incremental.

### Checkpoint #019 — Estratégia de uso de CPU/GPU em providers

- Todos os modelos em `providers` devem ser configurados para uso CPU-only.
- Se algum modelo exigir GPU/CUDA, ele deve ser descartado e a limitação registrada/anotada.
- Caso surja a necessidade de um modelo que só roda em GPU/CUDA e não haja substituto viável em CPU:
  - Não adicionar esse modelo ao `providers`.
  - Criar um terceiro servidor dedicado exclusivamente para modelos GPU-only.
- Essa estratégia mantém a arquitetura limpa, portátil e fácil de escalar/governar.

### Checkpoint #020 — Estratégia de uso da GPU na workstation

- Manter a GPU na workstation é estratégico para garantir agilidade, experimentação e evolução incremental do Slice/ALIVE.
- Rodar modelos pesados (ex: geração de código) na workstation reduz recursos disponíveis para os servidores, mas prioriza a produtividade do desenvolvimento.
- Trocar a placa de vídeo da workstation por uma mais simples (ou mover a GPU para o servidor) dificulta o desenvolvimento, experimentação e testes locais.
- O trade-off (menos recurso para os servers) é aceitável no início, pois prioriza velocidade de desenvolvimento e aprendizado.
- Quando a demanda de produção justificar, a estratégia pode ser revisada (ex: adquirir novas GPUs para localcloud).

// ... próximos checkpoints serão registrados abaixo ...
