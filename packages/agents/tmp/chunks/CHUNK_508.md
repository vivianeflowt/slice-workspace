 POST sentiment
Body  text Seu texto aqui 
Resposta  result  
 POST paraphrase
Body  phrase_a frase 1 phrase_b frase 2 
Resposta  not_paraphrase prob paraphrase prob 
Quer que eu gere os arquivos desse projeto para você
Se sim me diga o nome da pasta onde devo criar llmapiserver ou outro e se quer incluir mais algum endpointmodelo
plaintext
llmapiserver
apppy
requirementstxt
READMEmd
plaintext
fastapi
uvicorn
transformers
torch
python
from fastapi import FastAPI Body
from transformers import pipeline AutoTokenizer AutoModelForSequenceClassification
import torch
app  FastAPI
 Sentiment model multilingual
sentiment_pipe  pipelinetextclassification modeltabularisaimultilingualsentimentanalysis
 Paraphrase model pt
paraphrase_tokenizer  AutoTokenizerfrom_pretrainedPrompsitparaphrasebertpt
paraphrase_model  AutoModelForSequenceClassificationfrom_pretrainedPrompsitparaphrasebertpt
apppostsentiment
def sentimenttext str  Body embedTrue
result  sentiment_pipetext
return result result