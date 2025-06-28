def request_llm_segmenttext str prompt str model str  gpt4  str
response  openaiChatCompletioncreate
modelmodel
messages
role system content prompt
role user content text
return responsechoices0messagecontent
 Exemplo para Ollama local
python
import requests
def request_llm_segmenttext str prompt str model str  llama3
payload  
model model
messages 
role system
python
import openai
def request_llm_segmenttext str prompt str model str  gpt4  str
response  openaiChatCompletioncreate
modelmodel
messages
role system content prompt
role user content text
return responsechoices0messagecontent
python
import requests
def request_llm_segmenttext str prompt str model str  llama3
payload  
model model
messages 
role system
User
httpshuggingfacecotabularisaimultilingualsentimentanalysis
httpshuggingfacecoPrompsitparaphrasebertpt
httpshuggingfacecocitizenlabtwitterxlmrobertabasesentimentfinetunned