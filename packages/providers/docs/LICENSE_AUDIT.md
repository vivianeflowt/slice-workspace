# 📜 Curadoria de Licenças - Slice/ALIVE Providers Server

> **Conforme CONCEPTS.md**: Toda ferramenta deve passar por curadoria explícita de licença

## 🔍 Análise Realizada em: 28/06/2025

### ✅ Dependências Principais (APROVADAS)

| Dependência | Licença | Status | Observações |
|-------------|---------|---------|-------------|
| `fastapi` | MIT | ✅ APROVADA | Compatível, open source |
| `uvicorn` | BSD-3-Clause | ✅ APROVADA | Compatível, open source |
| `pydantic` | MIT | ✅ APROVADA | Compatível, open source |
| `transformers` | Apache-2.0 | ✅ APROVADA | Compatível, HuggingFace oficial |
| `torch` | BSD-3-Clause | ✅ APROVADA | Compatível, PyTorch oficial |
| `tokenizers` | Apache-2.0 | ✅ APROVADA | Compatível, HuggingFace oficial |
| `numpy` | BSD-3-Clause | ✅ APROVADA | Compatível, padrão científico |
| `sentence-transformers` | Apache-2.0 | ✅ APROVADA | Compatível, open source |
| `scikit-learn` | BSD-3-Clause | ✅ APROVADA | Compatível, padrão ML |
| `scipy` | BSD-3-Clause | ✅ APROVADA | Compatível, padrão científico |

### ✅ Dependências de Desenvolvimento (APROVADAS)

| Dependência | Licença | Status | Observações |
|-------------|---------|---------|-------------|
| `pytest` | MIT | ✅ APROVADA | Compatível, padrão de testes |
| `black` | MIT | ✅ APROVADA | Compatível, formatador oficial |
| `isort` | MIT | ✅ APROVADA | Compatível, organizador imports |
| `flake8` | MIT | ✅ APROVADA | Compatível, linter padrão |
| `mypy` | MIT | ✅ APROVADA | Compatível, type checker |

### ✅ Dependências de Utilidades (APROVADAS)

| Dependência | Licença | Status | Observações |
|-------------|---------|---------|-------------|
| `psutil` | BSD-3-Clause | ✅ APROVADA | Compatível, informações sistema |
| `pyyaml` | MIT | ✅ APROVADA | Compatível, parsing YAML |
| `httpx` | BSD-3-Clause | ✅ APROVADA | Compatível, cliente HTTP |
| `jsonschema` | MIT | ✅ APROVADA | Compatível, validação JSON Schema |

## 📋 Checklist de Compatibilidade Slice/ALIVE

- [x] **Open Source**: Todas as dependências são open source
- [x] **Licenças Permissivas**: MIT, BSD, Apache-2.0 (compatíveis)
- [x] **Uso Interno**: Sem restrições para uso interno
- [x] **Modificação**: Permitida em todas as dependências
- [x] **Redistribuição**: Permitida (se necessário)
- [x] **Comercialização**: Sem restrições (se necessário)

## 🚫 Dependências BANIDAS

- **Claude 4** e variantes (conforme CONCEPTS.md)
- **OpenAI APIs** proprietárias (violam Baixo Recurso & Custo Mínimo)
- **Bibliotecas GPL/AGPL** (podem impor restrições de licenciamento)

## 🔄 Processo de Adição de Novas Dependências

1. **Identificar licença oficial** da biblioteca
2. **Analisar restrições** de uso, modificação, redistribuição
3. **Verificar compatibilidade** com princípios Slice/ALIVE
4. **Registrar análise** neste documento
5. **Aprovar ou rejeitar** baseado nos critérios

## 📝 Observações Importantes

- **Todas as licenças analisadas são permissivas** e compatíveis com os objetivos Slice/ALIVE
- **Nenhuma dependência** impõe restrições que violem os princípios de open source, baixo custo ou flexibilidade
- **Modelos HuggingFace** usados são majoritariamente Apache-2.0 ou MIT (verificar individualmente)

## 🎯 Ações Pendentes

- [ ] **Validar licenças de modelos** específicos baixados do HuggingFace
- [ ] **Automatizar verificação** de licenças em CI/CD
- [ ] **Criar script** para auditoria contínua de dependências

---

**Última atualização:** 28/06/2025
**Responsável:** Slice Team
**Status:** ✅ TODAS AS DEPENDÊNCIAS APROVADAS
