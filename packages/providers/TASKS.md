# ✅ TASKS.md — Servidor Providers (Hugging Face) — Enterprise Edition

## 🧪 Regra Geral de Qualidade
> Nenhuma task é considerada **concluída** até que:
> 1. A funcionalidade esteja implementada e documentada
> 2. Um **teste automatizado** cubra e valide o comportamento
> 3. O teste esteja presente em `tests/` e rode com `task test`
> 4. O código siga padrões de estilo, tipagem e documentação
> 5. O PR tenha revisão cruzada (peer review)

---

## 🔧 Estrutura Inicial e Base
- [ ] Criar pasta `server/` e `tests/` com `__init__.py` (estrutura mínima)
- [ ] Validar estrutura com `tests/test_structure.py`
  - **Critério de aceitação:** Falha se faltar qualquer pasta/arquivo essencial

## 🔧 Automação e Taskfile
- [ ] Criar `Taskfile.yml` seguindo padrão Slice/ALIVE
- [ ] Implementar task `install` (PDM + download modelos Hugging Face)
- [ ] Validar automação com `tests/test_taskfile.py` (subprocess)
  - **Critério:** Task instala dependências e baixa modelos sem erro

## 🔧 Modularização e Imports
- [ ] Criar `api/`, `services/`, `models/`, `utils/` (cada um com `__init__.py`)
- [ ] Validar imports e estrutura com `tests/test_modular_structure.py`
  - **Critério:** Todos os módulos importam sem erro

## 🔧 Funções Puras, Testes e TDD
- [ ] Encapsular lógica Hugging Face em funções/classes puras
- [ ] Escrever testes antes da implementação (TDD)
- [ ] Cobrir lógica com `tests/test_pure_logic.py` (mocks)
  - **Critério:** Funções testáveis isoladamente, sem side effects

## 🔧 Robustez e Validação
- [ ] Validar entradas nulas, inválidas, limites e tipos
- [ ] Cobrir casos de borda com `tests/test_robustness.py` (`pytest.mark.parametrize`)
  - **Critério:** Funções rejeitam entradas inválidas corretamente

## 🔧 Gerenciamento de Dependências
- [ ] Rodar `pdm init` e configurar `pyproject.toml`
- [ ] Validar arquivos com `tests/test_pdm_files.py`
  - **Critério:** Arquivos de dependência presentes e válidos

## 🔧 Consistência e Integração
- [ ] Validar compatibilidade estrutural com Command-R (`tests/test_base_consistency.py`)
  - **Critério:** Estruturas compatíveis e sem sobreposição indevida

## 🔧 Configuração e Constants
- [ ] Centralizar configs em `constants.py` (porta, timeouts, modelos, etc)
- [ ] Validar ausência de números mágicos com `tests/test_magic_numbers.py`
- [ ] Porta configurável validada por `tests/test_port_config.py`

## 🔧 Taskfile como Interface
- [ ] Implementar tasks `dev`, `start`, `test`, `lint` no Taskfile
- [ ] Validar subprocessos com `tests/test_taskfile_commands.py`

## 🔧 Compatibilidade OpenAI API
- [ ] Implementar mocks compatíveis (ex: `/v1/chat/completions`)
- [ ] Cobrir endpoints com `tests/test_openai_api.py`

## 🔧 Documentação e Padronização
- [ ] Garantir docstrings em todas funções/classes públicas
- [ ] Validar com `tests/test_docstrings.py` (`pydocstyle`)
- [ ] Escrever README incremental e exemplos de uso

## 🔧 Layout e Organização
- [ ] Validar estrutura e layout com `tests/test_folder_layout.py`

## 🔧 Encapsulamento Plugável
- [ ] Criar `huggingface_service.py` plugável
- [ ] Cobrir múltiplos modelos/mocks com `tests/test_huggingface_service.py`

## 🔧 Foco Funcional e Endpoints
- [ ] Criar testes para tasks como `classificação`, `paráfrase`, `resumo` (`tests/test_functional_endpoints.py`)

## 🔧 Visão Futura e Escalabilidade
- [ ] Testar múltiplos servidores com `tests/test_parallel_server_spawning.py`
- [ ] Implementar cache local (in-memory por modelo) e validar com `tests/test_model_cache.py`

## 🔧 Isolamento e Segurança
- [ ] Garantir ausência de dependência com `command/` (`tests/test_provider_isolation.py`)
- [ ] Validar `device=cpu` em todos providers (`tests/test_cpu_only.py`)
- [ ] Garantir que nenhum provider tente acessar CUDA (`tests/test_no_cuda.py`)

---

## 🔁 Execução Contínua e Boas Práticas

```bash
# Rodar todos os testes automatizados
$ task test
```

> **Boas práticas:**
> - Sempre escreva o teste antes da implementação (TDD).
> - Cada task deve ser rastreável por commit, validada por teste e documentada.
> - Use tipagem, docstrings e siga padrões de estilo (ex: black, isort, flake8).
> - PRs devem ser revisados por pelo menos 1 pessoa (peer review).
> - Documente decisões arquiteturais relevantes no README ou em ADRs.

```bash
task test
