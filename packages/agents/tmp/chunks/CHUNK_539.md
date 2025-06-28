 4 Referência
 OpenAI Chat API Referencehttpsplatformopenaicomdocsapireferencechat
Se quiser posso adaptar seu servidor para expor v1chatcompletions e outros endpoints no padrão OpenAI integrando com seus modelos de sentimento NER e paráfrase
Só avisar se quer que eu faça esse ajuste
json
model nomedomodelo
messages 
role system content Instrução do sistema
role user content Mensagem do usuário
python
from fastapi import FastAPI Body
from pydantic import BaseModel
from typing import List Dict
app  FastAPI
class MessageBaseModel
role str
content str
class ChatRequestBaseModel
model str
messages ListMessage
apppostv1chatcompletions
def chat_completionsrequest ChatRequest
 Exemplo só retorna o último conteúdo do usuário como eco
user_message  nextmcontent for m in reversedrequestmessages if mrole  user 
 Aqui você pode chamar seu pipelinemodelo real
return 
id chatcmpl123
object chatcompletion
choices 
index 0
message 
role assistant
content fVocê disse user_message
finish_reason stop
usage 
prompt_tokens 0
completion_tokens 0
total_tokens 0
User
nao precisa de version no no ecosystem so isso que muda