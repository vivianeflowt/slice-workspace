class ChatRequestBaseModel
model str
messages ListMessage
apppostchatcompletions
def chat_completionsrequest ChatRequest
 Exemplo só retorna o último conteúdo do usuário como eco
user_message  nextmcontent for m in reversedrequestmessages if mrole  user 
 Aqui você pode integrar com seu pipelinemodelo real
return 
choices 
index 0
message 
role assistant
content fVocê disse user_message
finish_reason stop
User
Ia pythonzeira se empolga e nao documenta api com swagger
Cursor
Verdade  Mas a boa notícia é que usando FastAPI a documentação automática via Swagger já está disponível por padrão  basta acessar
httplocalhost11001docs
httplocalhost11001redoc
Assim que você sobe o servidor make dev todos os endpoints definidos aparecem documentados com exemplos de requestresponse direto no navegador