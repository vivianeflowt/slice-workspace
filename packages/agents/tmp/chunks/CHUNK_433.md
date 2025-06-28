Cursor
Exatamente Incluir uma breve justificativa para cada extração é uma métrica poderosa para validação e aprendizado do pipeline
 Formato Final Sugerido para Validação
 corrigir erro
 Dataset chat01md Linha 1234
Mensagem Agora vamos corrigir o erro do protocolo de tokenização
Contexto anterior O pipeline está quase pronto mas falta ajustar um detalhe
Contexto posterior Depois disso podemos testar novamente
Justificativa Aparece no início da mensagem padrão recorrente em transições de assunto
 Dataset chat03md Linha 5678
Mensagem Corrigir erro de conexão é prioridade agora
Contexto anterior A conexão está instável desde ontem
Contexto posterior Se resolver seguimos para o próximo passo
Justificativa Expressão usada para iniciar novo objetivo na conversa
 até 10 exemplos
 Vantagens
 Justificativa explícita Você entende o critério da extração
 Validação mais rica Pode discordar não só da keyword mas do motivo da extração
 Feedback mais qualificado Permite refinar o pipeline com base em erros de lógica não só de ocorrência
Vou implementar a extração incluindo a justificativa para cada exemplo
Assim seu feedback será ainda mais valioso e o pipeline evoluirá com mais precisão