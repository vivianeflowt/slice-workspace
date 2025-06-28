model_name  Lucianobertimbaubaselener_br
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelForTokenClassificationfrom_pretrainedmodel_name
ner_pipe  pipelinetokenclassification modelmodel tokenizertokenizer aggregation_strategysimple
text  A Maria foi para São Paulo em 2023
result  ner_pipetext
printresult
 entity_group PER score 099 word Maria  
User
bota no seu stack
vamos fazer vc aprendeu tudo sobre meu prompt
Cursor
python
from fastapi import FastAPI Body
from transformers import pipeline AutoTokenizer AutoModelForSequenceClassification AutoModelForTokenClassification
import torch
import uvicorn
app  FastAPI
 Sentiment model multilingual mas funciona muito bem para pt
sentiment_pipe  pipelinetextclassification modeltabularisaimultilingualsentimentanalysis