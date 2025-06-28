apppostparaphrase
def paraphrasephrase_a str  Body phrase_b str  Body
inputs  paraphrase_tokenizerphrase_a phrase_b return_tensorspt
logits  paraphrase_modelinputslogits
soft  torchnnSoftmaxdim1
probs  softlogitstolist0
return not_paraphrase probs0 paraphrase probs1
 Para rodar uvicorn appapp reload
plaintext
 LLM API Server
API HTTP para análise de sentimento e detecção de paráfrase usando modelos Hugging Face
 Instalação
bash
pip install r requirementstxt
 Uso
bash
uvicorn appapp reload
 Endpoints
 POST sentiment
Body  text Seu texto aqui 
Resposta  result  