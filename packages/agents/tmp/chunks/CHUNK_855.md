O jsonstdio normalmente não precisa de configuração extra para comandos básicos mas depende de um contexto de dados válido para funcionar Ele espera receber um caminho para um arquivo JSON uma URL de dados JSON ou um contexto de memória válido ex memory com dados carregados
 Possíveis causas do erro
 Contexto vazio Se não há dados JSON carregados ou disponíveis no endpoint consultado ele retorna vazio ou erro
 URL inválida ou sem dados Se o caminhoURL não aponta para um JSON válido não retorna nada
 Permissões ou formato O arquivoendpoint precisa ser acessível e estar em formato JSON válido
 Como testar corretamente o jsonstdio
1 Forneça um arquivo JSON local
 Exemplo
json
url filecaminhoparaseuarquivojson
jsonPath 
2 Use uma URL de JSON público
 Exemplo
json
url httpsjsonplaceholdertypicodecomtodos1
jsonPath 
3 Garanta que o contexto de memória memory tenha dados carregados
Se quiser posso criar um arquivo JSON de teste ou usar uma URL pública para demonstrar o funcionamento do jsonstdio agora
json
url filecaminhoparaseuarquivojson
jsonPath 
json
url httpsjsonplaceholdertypicodecomtodos1
jsonPath 
User
sim acho valido validar os map