 Em português o sujeito pode estar oculto no verbo quero  eu quero e isso é natural na fala e na escrita
 Quero carrega sujeito implícito e verbo ao mesmo tempo
 O predicado outra coisa é vago e depende do contexto anterior para ser interpretado
 A quem se refere o querer Pode ser a mim eu quero ou dependendo do contexto pode ser um querer direcionado ao outro quero que você faça algo
 Pontoschave para NLP e segmentação
1 Sujeito oculto
 O português permite omitir o sujeito e o verbo conjugado carrega essa informação
 Quero  eu quero mas só o contexto e a conjugação revela isso
2 Ambiguidade do predicado
 Outra coisa pode ser qualquer coisa  só o contexto anteriorposterior esclarece o que é
 Pode ser quero outra coisa de você quero outra coisa para mim quero mudar de assunto etc
3 Dependência do contexto
 Para segmentar corretamente o pipeline precisa olhar para as frases anteriores e posteriores não só para a frase isolada
 Mudanças de assunto muitas vezes são marcadas por expressões vagas outra coisa agora seguinte mas só fazem sentido com o histórico da conversa
 Como tratar isso no pipeline
 Análise de contexto
 Sempre considerar o bloco anterior e posterior para interpretar frases vagas
 Heurísticas de transição
 Expressões como quero outra coisa vamos mudar seguinte agora podem indicar transição mas só se vierem após um bloco temático
 Desambiguação por coreferência
 Ferramentas de NLP avançadas spaCy HuggingFace podem ajudar a identificar a quem o quero se refere mas ainda assim o contexto é rei
 Resumindo
 O português é rico em sujeito oculto e predicados vagos
 Segmentação de contexto exige olhar para a sequência não só para a frase isolada
 Expressões como quero outra coisa são pistas mas só o contexto diz se é realmente uma mudança de assunto
Se quiser posso sugerir um pipeline que sempre analisa contexto expandido janelas de frases para tratar esses casos