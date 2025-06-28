Cursor
python
import os
import sys
from typing import List
 Dependendo do ambiente podese usar openai ollama ou outro provider
 Aqui deixo um placeholder para a função de request ao modelo
def request_llm_segmenttext str prompt str model str  openaigpt4  str
Função placeholder para enviar texto ao modelo LLM e retornar a resposta segmentada
Substitua pelo provider real OpenAI Ollama etc
 Exemplo com openai
 import openai
 response  openaiChatCompletioncreate
 modelmodel
 messagesrole system content prompt role user content text
 return responsechoices0messagecontent
return LLM output aqui segmentação por assunto
 Prompt base para segmentação temática
BASE_PROMPT  
Analise o conteúdo abaixo e divida por assunto criando títulos temáticos claros e um resumo objetivo para cada bloco de conversa Use o seguinte formato
 Tópico X  Título do Assunto
Resumo Resumo objetivo do bloco
Conteúdo original
def read_markdown_filefilepath str  str
with openfilepath r encodingutf8 as f
return fread
def write_segmented_fileoutput_path str content str
with openoutput_path w encodingutf8 as f
fwritecontent
def chunk_texttext str max_tokens int  3000  Liststr
 Simples chunking por número de linhas ajuste conforme necessário
lines  textsplitn
chunks  
chunk  
for line in lines
chunkappendline
if lenchunk  max_tokens
chunksappendnjoinchunk
chunk  
if chunk
chunksappendnjoinchunk
return chunks