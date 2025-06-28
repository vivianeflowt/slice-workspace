for file in globglobmini_dataset_json
with openfile as f
bloco  jsonloadf
resumo  summarize_blockblocomessages
blocosummary  resumo
with openfile w as out
jsondumpbloco out
 Recomendações
 Use prompts claros e objetivos para a LLM sempre pedindo separação por assunto e sumarização macro
 Salve logs de cada etapa para auditoria
 Documente no CONTECTmd o racional dos prompts e critérios de separação
 Se possível permita feedback humano para ajustar blocos e sumarizações
Posso gerar um script inicial para segmentação e sumarização usando MCPOllama ou prefere definir primeiro o formato do dataset de entrada
python
 segment_datasetpy
from mcp_ollama import ask_model  ou outro wrapper MCPLLM
import json
def segment_conversationconversation modelllama3
 Prompt para LLM Separe a conversa abaixo em blocos de mesmo assunto
 Retorna lista de blocos cada bloco  lista de mensagens
pass
with opendatasetjson as f
data  jsonloadf
blocos  segment_conversationdatamessages
for i bloco in enumerateblocos
with openfmini_dataset_ijson w as out
jsondumpmessages bloco out
python
 summarize_blockspy
from mcp_ollama import ask_model
import json
import glob
def summarize_blockmessages modelllama3
 Prompt Resuma o assunto e contexto macro deste bloco de conversa
pass