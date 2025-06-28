 Pipeline Refinado com Rastreamento de Contexto
1 Extração com Proveniência
 Para cada keywordpadrão extraído registrar
 O dataset de origem ex chat03md
 O índicelinhabloco da mensagem original
 O texto completo da mensagem
 Opcional O contexto anterior e posterior mensagens vizinhas
2 Relatório de Extração
 Gerar um relatório ex CSV JSON ou markdown com
 Keywordpadrão extraído
 Dataset e posição de origem
 Trecho da mensagem ou bloco
 Contexto ex 12 mensagens antesdepois
 Assim você pode ler o contexto real e dizer
Sim aqui faz sentido essa keyword ou Não nesse contexto não é mudança de assunto
3 Validação Iterativa
 Você valida diretamente no relatório marcando exemplos corretosincorretos
 O pipeline aprende com seu feedback refinando a extração
 Exemplo de Relatório
 Keyword  Dataset  Linha  Mensagem Original  Contexto AnteriorPosterior 
 corrigir erro  chat01md  1234  Agora vamos corrigir o erro do protocolo  mensagem anterior  depois 
 seguinte  chat03md  4567  O seguinte problema é sobre tokenização custom   
 Vantagens
 Rastreabilidade total Você sempre sabe de onde veio cada keyword
 Validação real Só considera keyword válida se fizer sentido no contexto original
 Evolução baseada em dados e feedback humano
Vou implementar a extração já mapeando dataset índice e contexto de cada ocorrência
O output será um relatório fácil de validar para você marcar o que faz sentido ou não
Se quiser algum formato específico de relatório CSV JSON markdown só avisar
Pronto para iniciar a extração rastreável e validável