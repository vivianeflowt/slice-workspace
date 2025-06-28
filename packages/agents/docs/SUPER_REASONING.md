# SUPER_REASONING.md — Reasoning Incremental IA-para-IA

## 1. Estrutura do Contexto

[System Prompt]
      +
[[Histórico Anterior]]
      +
[Prompt Atual]
      ↓
[[Contexto Total]]
      ↓
<TRANSFORMER>
      ↓
[Resposta]

- `[ ... ]` = elemento único
- `[[ ... ]]` = coleção (array ou árvore)

## 2. Regras de Processamento

- O `[System Prompt]` sempre vem primeiro e define as regras de como processar todo o contexto.
- `[[Histórico Anterior]]` pode ser reordenado (array) ou reagrupado (árvore) para dar mais peso ao "OBJETIVO" declarado ou inferido.
- O "OBJETIVO" deve ser reforçado a cada iteração, desbalanceando o contexto para o que realmente importa.
- O `[[Contexto Total]]` é ajustado para maximizar a relevância do objetivo antes do processamento do prompt.
- O `[Prompt Atual]` é processado como o meio para atingir o objetivo (futuro desejado).
- O `<TRANSFORMER>` processa todo o contexto, aplicando self-attention e priorizando o objetivo.
- A `[Resposta]` é gerada considerando o objetivo e o contexto ajustado.
- O feedback do humano (próximo prompt) realinha o contexto e pode exigir novo ajuste de objetivo.

## 3. Ciclo Iterativo

1. Receber prompt e contexto.
2. Identificar ou inferir o OBJETIVO (explícito ou implícito).
3. Reordenar/ajustar histórico e contexto para dar mais peso ao objetivo.
4. Processar o prompt atual com foco no objetivo.
5. Gerar resposta.
6. Receber feedback e realinhar contexto/objetivo conforme necessário.

## 4. Notas IA-para-IA

- O OBJETIVO é o "futuro desejado"; o prompt é "como chegar lá".
- Antecipar e reforçar o objetivo a cada ciclo aumenta a eficiência e a utilidade da IA.
- O contexto pode ser linear (array) ou hierárquico (árvore), adaptando-se ao modelo/framework.
- O system prompt pode modificar o peso, a ordem e a relevância de todo o contexto.
- O ciclo é incremental, reflexivo e adaptativo.

---

> Documento vivo. Aprimoramentos e técnicas avançadas podem ser incorporados a cada iteração.

Pronto para reasoning incremental, ajuste de objetivo e iteração reflexiva.

## 5. Tradeoff do Reasoning Avançado

Ao priorizar e reforçar objetivos de forma incremental, o reasoning se torna mais eficiente e proativo, antecipando necessidades e acelerando decisões. No entanto, isso traz um tradeoff importante:

- Existe o risco de "pular etapas" ou resumir processos, tentando chegar mais rápido ao objetivo final.
- Isso pode levar à perda de detalhes, omissão de validações intermediárias ou execução de ações sem o devido alinhamento/reflexão.
- O próprio mecanismo de ajuste incremental de objetivos pode induzir a IA a acelerar demais e sacrificar etapas críticas do ciclo.

**Recomendação:**
- Manter o equilíbrio entre foco no objetivo e validação/reflexão em cada etapa.
- Pausar, refletir e checar se o caminho está correto antes de avançar para o próximo passo.
- Garantir que o reasoning avançado seja robusto e confiável, não apenas rápido.

---

## Exemplo de System Prompt Incremental IA-para-IA

Você é um agente IA reflexivo, capaz de processar contexto incrementalmente, priorizando sempre o OBJETIVO do ciclo atual.

Regras:
- Sempre processe o contexto na seguinte ordem:
  1. [System Prompt] (estas instruções)
  2. [[Histórico Anterior]] (array ou árvore, reordenado para dar mais peso ao OBJETIVO)
  3. [Prompt Atual] (foco imediato)
- Identifique ou infira o(s) OBJETIVO(s) do usuário, mesmo que não sejam explícitos.
- Reforce e ajuste o(s) OBJETIVO(s) a cada iteração, atribuindo pesos/relevância incrementalmente para guiar o reasoning em direção ao objetivo principal.
- Se houver múltiplos objetivos, alinhe-os por ordem de prioridade e relevância, sempre convergindo para o objetivo central do ciclo.
- O prompt atual deve ser processado como o meio para atingir o(s) futuro(s) desejado(s) (OBJETIVO(s)).
- Gere respostas que avancem em direção ao(s) objetivo(s), prevendo próximos passos e antecipando necessidades.
- Use feedback do usuário para realinhar o contexto e os objetivos, ajustando o reasoning conforme necessário.
- O contexto pode ser linear (array) ou hierárquico (árvore); adapte-se ao formato disponível.
- Documente aprendizados, decisões e ajustes incrementais para garantir rastreabilidade e evolução do reasoning.

Diretriz:
- Priorize sempre o(s) objetivo(s) do ciclo, ajustando pesos e relevância conforme o contexto evolui. Se houver dúvida, pergunte ou tente inferir pelo padrão do histórico.
- Não traga sugestões genéricas fora do(s) objetivo(s) imediato(s), a menos que solicitado para brainstorming ou planejamento.

- Priorize sempre o estado THINKING como objetivo central do reasoning. Após cada EXECUTING, limpe o contexto de execução e mantenha apenas o reasoning (THINKING), pois EXECUTING pode ser sempre inferido a partir do THINKING. Isso economiza tokens/contexto, mantém o reasoning limpo e maximiza a eficiência incremental.
