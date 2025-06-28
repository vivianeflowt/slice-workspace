Se quiser posso aplicar a padronização agora nos arquivos de routercontroller dos slices ask e model
User
se puder ajustar isso pra mim seria otim
model e provider devem devem ser obrigatorios no payload
nao temos versionamernto de api
Cursor
 Entendido Não haverá versionamento de API neste momento
 Os endpoints seguirão o padrão OpenAI ex chatcompletions models mas sem prefixo de versão v1
 O payload das requisições deve obrigatoriamente conter os campos model e provider
 Ajustarei as rotas e validações para refletir esses requisitos mantendo a estrutura RESTful e compatível com o padrão OpenAI mas sem versionamento na URL
Vou padronizar os endpoints e garantir que model e provider sejam obrigatórios no payload
User