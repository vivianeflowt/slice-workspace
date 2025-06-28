 Instancia modelos Hugging Face sentimento paráfrase etc
 Fornece um endpoint HTTP para consumir esses modelos via API ex sentiment paraphrase
 Pode ser rodado localmente sem acoplar ao core do ALIVE
 Proposta de Estrutura
 Tecnologia FastAPI leve rápido fácil de integrar com Hugging Face
 Endpoints
 sentiment  recebe texto retorna sentimento
 paraphrase  recebe duas frases retorna se são paráfrases
 Configuração Modelos carregados na inicialização prontos para uso
 Exemplo de Projeto llmapiserver
Estrutura
llmapiserver
apppy
requirementstxt
READMEmd
 requirementstxt
fastapi
uvicorn
transformers
torch
 apppy
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