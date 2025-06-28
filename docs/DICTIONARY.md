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

## Delimitadores de Contexto/Instrucao para Prompts

### :: ... ::  (Padrão Validado)
- Usado para delimitar blocos de contexto, instruções ou mudanças de comportamento em prompts.
- Validado empiricamente: modelos avançados (GPT-4, Claude, Deepseek, Llama) reconhecem e respeitam esse padrão.
- Exemplo de uso:
  :: AJUSTE ::
  :: CONTEXTO MUDOU ::
- Recomendado para instruções críticas, mudanças de contexto ou marcação de blocos especiais.

### ::: ... :::  (Convenção Experimental)
- Não validado amplamente: não há garantia de que modelos interpretarão como camada extra de obrigação/importância.
- Pode ser útil como reforço visual ou convenção interna, mas pode causar ruído se usado como padrão universal.
- Use com cautela e sempre sinalize que é experimental.

---

## Exemplos práticos de marcações

| Símbolo / Formato | Exemplo de uso | Contexto Slice |
| ----------------- | -------------- | -------------- |
| `1.` `2.`         | 1. Instalar deps<br>2. Rodar testes | Passos de Taskfile |
| `-`               | - Baixo custo<br>- Open source | Listas de requisitos/conceitos |
| `**`              | **Importante:** Use Zod | Destaque em guideline |
| `#` `##`          | # Instalação<br>## Uso | Estrutura de docs |
| `> texto`         | > Exemplo: "task install" | Input/saída esperada |
| `:: ... ::`       | :: CONTEXTO MUDOU :: | Mudança de contexto crítico |

---

## Referência cruzada com conceitos Slice
- Use listas numeradas para processos incrementais (ver: Incrementalismo em CONCEPTS.md)
- Use markdown puro para máxima compatibilidade (ver: Documentação Incremental)
- Delimitadores :: ... :: para instruções críticas (ver: HUMAN_INTERACTION_GUIDELINES.md)

---
