User
È como vc justificasse pq extraiu a keyword baseado no chat por exemplo
Cursor
Exatamente
O pipeline precisa ser explicável para cada keyword extraída eu devo justificar claramente o motivo da extração mostrando o trecho do chat e o contexto que levou à escolha daquela palavrafrase como potencial separador de assunto
 Como será a justificativa de extração
Para cada keywordpadrão extraído o relatório trará
 A keywordpadrão extraído
 O dataset e a posição linhabloco
 A mensagem original completa
 O contexto mensagens imediatamente antes e depois
 A regra ou heurística que motivou a extração
ex Keyword apareceu no início da mensagem Expressão comum em transições Frequência alta em pontos de mudança de assunto
 Exemplo de entrada no relatório
Keyword extraída corrigir erro
Dataset chat01md
Linha 1234
Mensagem original Agora vamos corrigir o erro do protocolo de tokenização
Contexto anterior O pipeline está quase pronto mas falta ajustar um detalhe
Contexto posterior Depois disso podemos testar novamente
Justificativa Expressão corrigir erro aparece no início da mensagem padrão recorrente em transições de assunto detectadas em outros pontos do dataset
 Vantagens