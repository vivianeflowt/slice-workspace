2 Output em formato validável
 Pode ser um arquivo markdown CSV ou JSON estruturado
 Cada bloco
 Keyword corrigir erro
Exemplo 1
 Dataset chat01md Linha 1234
 Mensagem Agora vamos corrigir o erro do protocolo de tokenização
 Contexto anterior O pipeline está quase pronto mas falta ajustar um detalhe
 Contexto posterior Depois disso podemos testar novamente
 Justificativa Aparece no início da mensagem padrão recorrente em transições
 até 10 exemplos por keyword
3 Validação
 Você lê os exemplos marca se a keyword faz sentido como separador de assunto
 Feedback seu  ajuste automático do pipeline
 Vantagens
 Validação rápida e objetiva 10 exemplos reais por keyword são suficientes para decidir se faz sentido
 Rastreabilidade Sempre possível voltar ao dataset original
 Explicabilidade Justificativa clara para cada extração
Vou implementar a extração nesse formato
 Keyword
plaintext
 Keyword corrigir erro
Exemplo 1
 Dataset chat01md Linha 1234
 Mensagem Agora vamos corrigir o erro do protocolo de tokenização
 Contexto anterior O pipeline está quase pronto mas falta ajustar um detalhe
 Contexto posterior Depois disso podemos testar novamente
 Justificativa Aparece no início da mensagem padrão recorrente em transições
 até 10 exemplos por keyword