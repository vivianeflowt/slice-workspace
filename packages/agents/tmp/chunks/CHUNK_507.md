apppostsentiment
def sentimenttext str  Body embedTrue
result  sentiment_pipetext
return result result
apppostparaphrase
def paraphrasephrase_a str  Body phrase_b str  Body
inputs  paraphrase_tokenizerphrase_a phrase_b return_tensorspt
logits  paraphrase_modelinputslogits
soft  torchnnSoftmaxdim1
probs  softlogitstolist0
return not_paraphrase probs0 paraphrase probs1
 Para rodar uvicorn appapp reload
 READMEmd
 LLM API Server
API HTTP para análise de sentimento e detecção de paráfrase usando modelos Hugging Face
 Instalação
bash
pip install r requirementstxt
 Uso
bash
uvicorn appapp reload
 Endpoints