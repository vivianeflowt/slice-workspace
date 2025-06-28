# ✅ TASKS.md — Derivadas dos Checkpoints (com validação por testes)

## 🧪 Regra geral
> Nenhuma task é considerada **concluída** até que:
> 1. A funcionalidade esteja implementada
> 2. Um **teste unitário** cubra e valide o comportamento
> 3. O teste esteja presente em `tests/` e rode com `task test`

---

## 🔧 Checkpoint #001 — Estrutura de diretórios
- [x] Criar pasta `server/` com `__init__.py`
- [x] Criar pasta `tests/` com `__init__.py`
- [x] Criar teste `tests/test_structure.py` validando a existência das pastas

## 🔧 Checkpoint #002 — Taskfile
- [ ] Criar `Taskfile.yml` no padrão Slice/ALIVE
- [ ] Task `install`: instalar dependências + baixar modelos
- [ ] Criar teste `tests/test_taskfile.py` que simula execução de `task install` via subprocess

## 🔧 Checkpoint #003 — Organização do código Python
- [ ] Separar lógica em arquivos especializados
- [ ] Criar teste `tests/test_organization.py` que valida que `main.py` tem apenas chamada de app

## 🔧 Checkpoint #004 — Funções puras e classes
- [ ] Criar funções puras para cada tarefa de negócio
- [ ] Testar com mocks e entradas variadas
- [ ] Criar `tests/test_pure_functions.py`

## 🔧 Checkpoint #005 — Robustez de funções puras
- [ ] Validar edge cases com `pytest.mark.parametrize`
- [ ] Garantir 100% de cobertura no arquivo `tests/test_utils_robust.py`

## 🔧 Checkpoint #006 — Gerenciador de pacotes (PDM)
- [ ] Rodar `pdm init`, confirmar `pyproject.toml`
- [ ] Criar `tests/test_package_manager.py` validando presença dos arquivos

## 🔧 Checkpoint #007 — Foco incremental
- [ ] Criar teste `tests/test_shared_base.py` que assegura que ambos os servidores compartilham estrutura

## 🔧 Checkpoint #008 — Porta no código
- [ ] Verificar constante `DEFAULT_PORT` em `constants.py`
- [ ] Criar `tests/test_constants.py` para garantir presença e uso

## 🔧 Checkpoint #009 — Constants centralizado
- [ ] Substituir números mágicos
- [ ] Criar `tests/test_constants_usage.py` que percorre os arquivos e detecta hardcodes

## 🔧 Checkpoint #010 — Taskfile como interface
- [ ] Criar task `dev`, `start`, `test`, `lint`
- [ ] Criar `tests/test_taskfile_commands.py` validando execução via subprocess

## 🔧 Checkpoint #011 — Compatibilidade com OpenAI API
- [ ] Criar mocks de payloads baseados na docs da OpenAI
- [ ] Criar `tests/test_api_compliance.py` que valida formato das respostas

## 🔧 Checkpoint #012 — Documentação
- [ ] Validar docstrings com `pydocstyle`
- [ ] Criar teste `tests/test_docstrings.py` automatizando essa validação

## 🔧 Checkpoint #013 — Estrutura de pastas
- [ ] Criar `tests/test_folder_layout.py` garantindo presença de `api/`, `services/`, etc.

## 🔧 Checkpoint #014 — Encapsulamento de modelos
- [ ] Criar testes para `commandr_service` e `BaseModelProvider`

## 🔧 Checkpoint #015 — Foco funcional
- [ ] Criar testes para `chat`, `embedding`, `completion` simulando chamadas reais
- [ ] `tests/test_endpoints_semantics.py`

## 🔧 Checkpoint #016 — Visão localcloud
- [ ] Criar `tests/test_cluster_simulation.py` com múltiplas instâncias via thread ou subprocess

## 🔧 Checkpoint #017 — Cache e load balancing
- [ ] Criar testes de benchmark e hit ratio no cache
- [ ] Simular fallback e hot-reload com `tests/test_cache_behavior.py`

## 🔧 Checkpoint #018 — Organização: command vs providers
- [ ] Validar com `tests/test_import_integrity.py` que não há imports cruzados indevidos

## 🔧 Checkpoint #019 — Estratégia CPU/GPU
- [ ] Criar `tests/test_gpu_restriction.py` que garante execução em CPU
- [ ] Validar que dependências CUDA não estão no ambiente

## 🔧 Checkpoint #020 — GPU na workstation
- [ ] Criar `tests/test_local_gpu_utilization.py` para flag manual (não obrigatório, mas rastreável)

---

## 🔁 Lembrete de execução contínua

Para validar tudo:
```bash
task test
