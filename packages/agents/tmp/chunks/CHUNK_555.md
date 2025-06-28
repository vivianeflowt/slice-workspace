python
from fastapi import FastAPI Body
from pydantic import BaseModel
from typing import List
  restante dos imports e modelos já existentes
class MessageBaseModel
role str
content str
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
Resumo
 Endpoint chatcompletions
 Compatível com o padrão OpenAI body e resposta
 Pronto para integrar com seu pipeline real
Se quiser posso aplicar esse patch direto no seu apppy
python
from fastapi import FastAPI Body
from pydantic import BaseModel
from typing import List
  restante dos imports e modelos já existentes
class MessageBaseModel
role str
content str