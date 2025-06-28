1 Separação de contextos reais
 Conversas não seguem sempre tópicos claros assuntos se misturam mudam de tom voltam depois de interrupções
 Decidir onde começatermina um bloco de contexto exige sensibilidade semântica e muitas vezes julgamento humano
2 Preservação do fluxo e intenção
 Cortar demais pode destruir o sentido cortar de menos pode misturar contextos e poluir o aprendizado
 Emojis ironia mudanças de humor e até silêncios gaps são relevantes
3 Anotação e metadados
 Anotar corretamente tópicos intenções perfis eventoschave etc é trabalhoso e exige critério
 Metadados ruins  explicabilidade ruim
4 Evitar viés e contaminação
 Misturar sessões perfis ou contextos pode induzir a IA a aprender padrões errados ou enviesados
5 Escalabilidade
 Manualmente é inviável para grandes volumes automatizar sem perder qualidade é difícil
 Estratégia recomendada para curadoria ALIVE
1 Pipeline híbrido
 Use LLMs para sugerir cortes agrupamentos e anotações mas sempre com possibilidade de revisãoajuste humano
2 Iteratividade
 Permita ciclos de feedback IA sugere humano revisa IA aprende com o feedback
3 Logs e rastreabilidade
 Cada decisão de curadoria deve ser registrada por quê como quando por quem
4 Ferramentas de visualização
 Visualize blocoscontextos transições e anotações para facilitar revisão e auditoria