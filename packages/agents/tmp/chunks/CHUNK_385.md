 Input Cada minidataset gerado na etapa anterior
 Processo
 Usar a LLM para gerar uma sumarização do assunto principal e do contexto macro daquele bloco
 Salvar a sumarização como metadado ex em um campo JSON ou como header do arquivo
 Output Minidatasets com sumarização embutida
 Exemplo de Estrutura de Script
 a Segmentação
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
 b Sumarização
python
 summarize_blockspy
from mcp_ollama import ask_model
import json
import glob
def summarize_blockmessages modelllama3
 Prompt Resuma o assunto e contexto macro deste bloco de conversa
pass