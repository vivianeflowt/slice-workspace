# HUMAN_INTERACTION_GUIDELINES.md

## Princípios para Interação com Humanos no Ecossistema Slice

1. **Perguntas objetivas e opções fechadas:**
   - Sempre que possível, faça perguntas claras, com respostas binárias ou múltipla escolha (ex: SIM/NÃO).
   - Exemplo: "Deseja salvar as alterações? (SIM/NÃO)"
   - Isso reduz ambiguidade, acelera decisões e facilita automação.

2. **Pergunte uma coisa por vez:**
   - Perguntas sequenciais são mais fáceis de responder com precisão do que várias ao mesmo tempo.
   - Exemplo: "Qual ambiente deseja usar? (local/prod)" só depois "Deseja rodar os testes? (SIM/NÃO)"
   - Se houver muitas opções, ajude a filtrar antes de apresentar a lista completa.

3. **Evite scroll e excesso de opções na tela:**
   - Mostre poucas opções por vez, sem exigir rolagem.
   - Sugestão: máximo de 5 opções por tela.
   - O essencial deve estar sempre visível na janela do usuário.

4. **Respeite multitarefa e múltiplas janelas:**
   - Considere que o usuário pode estar vendo várias telas, janelas e contextos ao mesmo tempo.
   - Forneça informações compactas, claras e independentes de contexto local.
   - Sugestão: ofereça resumos contextuais rápidos ao retomar o foco (ex: "Você estava editando o arquivo X. Deseja continuar?").

5. **Evite perguntas redundantes ou já respondidas:**
   - Siga o contexto e as definições já dadas, sem pedir reconfirmação desnecessária.
   - Execute todas as tarefas possíveis, sem pedir autorização para cada passo.
   - Exemplo: Se o usuário já confirmou uma ação, não pergunte novamente.

6. **Minimize interrupções durante a execução:**
   - Pergunte tudo que for necessário antes de iniciar a tarefa.
   - Só interrompa se realmente houver ambiguidade ou falta de informação crítica.
   - Exemplo: Solicite todas as permissões no início do fluxo.

7. **Errar para mais é melhor do que errar para menos:**
   - Prefira ser mais detalhado, cuidadoso e completo nas respostas e automações.
   - O excesso pode ser filtrado, mas a falta pode prejudicar o fluxo.
   - Exemplo: Gere logs detalhados, mas permita filtros para o usuário visualizar só o essencial.

8. **Considere a janela visual e o foco do usuário:**
   - O usuário pode perder contexto ao trocar de janela; evite forçar alternância desnecessária.
   - Sugestão: Use notificações persistentes para eventos críticos (ex: "Backup concluído com sucesso!").

9. **Se o usuário pedir detalhes de uma opção, aprofunde só nela:**
   - Não sobrecarregue com detalhes de todas as opções.
   - Exemplo: "Quer detalhes sobre a opção X? (SIM/NÃO)" e só aprofunde se SIM.

10. **Sempre pergunte se está absolutamente claro antes de executar uma instrução importante.**
    - Garanta alinhamento total antes de agir.
    - Exemplo: "Está tudo claro sobre a exclusão dos dados? (SIM/NÃO)"

---

## Exemplos práticos para cada princípio

1. **Perguntas objetivas e opções fechadas:**
   - Exemplo: "Deseja rodar o deploy agora? (SIM/NÃO)" (Relaciona: Anti-ambiguidade em CONCEPTS.md)
2. **Pergunte uma coisa por vez:**
   - Exemplo: "Qual ambiente? (local/prod)" só depois "Rodar testes? (SIM/NÃO)" (Relaciona: Incrementalismo)
3. **Evite scroll e excesso de opções:**
   - Exemplo: Mostre só 3 opções de ambiente por vez. (Relaciona: Foco e clareza)
4. **Respeite multitarefa:**
   - Exemplo: "Você estava editando X. Deseja continuar?" (Relaciona: Memória Coletiva)
5. **Evite perguntas redundantes:**
   - Exemplo: Não peça confirmação se já foi dada. (Relaciona: Validação Contínua)
6. **Minimize interrupções:**
   - Exemplo: Solicite permissões no início do fluxo. (Relaciona: Eficiência incremental)
7. **Errar para mais é melhor:**
   - Exemplo: Gere logs detalhados, mas permita filtro. (Relaciona: Documentação Incremental)
8. **Considere janela visual:**
   - Exemplo: Notificação persistente para backup. (Relaciona: Experiência do usuário)
9. **Aprofunde só se pedido:**
   - Exemplo: "Quer detalhes sobre X? (SIM/NÃO)" (Relaciona: Foco incremental)
10. **Pergunte se está claro antes de executar:**
    - Exemplo: "Está tudo claro sobre a exclusão? (SIM/NÃO)" (Relaciona: Transparência)

---

## Referências cruzadas
- Para marcações e exemplos de prompt, ver DICTIONARY.md
- Para incrementalismo e anti-padrões, ver CONCEPTS.md

---

Esses princípios devem guiar toda interação, automação e design de interface no ecossistema Slice, tornando a experiência mais eficiente, inclusiva e produtiva para humanos e IAs.

## Nota Técnica: Adaptação para Neurodivergência e Agentes IA
- No Slice, interações podem envolver humanos neurodivergentes (ex: TEA1) e agentes IA, ambos com janelas de contexto e estratégias de interpretação distintas do padrão de mercado.
- Recomenda-se que padrões de interação, aprendizados e ajustes sejam documentados de IA para IA, priorizando precisão técnica e automação, sem necessidade de simplificação para humanos.
- A documentação deve ser orientada para agentes IA, considerando onboarding, automação e evolução incremental do ecossistema.
