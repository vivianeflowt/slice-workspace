Cursor
 Variáveis sensíveis e de ambiente como base URL do servidor principal ficarão hardcoded no início do projeto sem uso de dotenvconfig externo neste momento
Quando necessário a migração para dotenvconfig será feita mas por ora a base URL e parâmetros principais estarão diretamente no código para facilitar setup e testes iniciais
User
ora nao funcona em commonjs
Cursor
 Registrado ora não será utilizada pois não funciona em CommonJS
Para feedback visualspinners na CLI será avaliada outra alternativa compatível caso necessário
A lista de dependências será ajustada para remover ora
User
spinner so progress funciona
Cursor
 Registrado para spinnersfeedback visual na CLI utilize apenas a biblioteca progress pois funciona corretamente em CommonJS