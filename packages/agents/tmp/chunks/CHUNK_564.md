 Sentiment model multilingual mas funciona muito bem para pt
sentiment_pipe  pipelinetextclassification modeltabularisaimultilingualsentimentanalysis
 Paraphrase model pt
paraphrase_tokenizer  AutoTokenizerfrom_pretrainedPrompsitparaphrasebertpt
paraphrase_model  AutoModelForSequenceClassificationfrom_pretrainedPrompsitparaphrasebertpt
def paraphrase_scorephrase_a phrase_b
inputs  paraphrase_tokenizerphrase_a phrase_b return_tensorspt
logits  paraphrase_modelinputslogits
soft  torchnnSoftmaxdim1
probs  softlogitstolist0
return not_paraphrase probs0 paraphrase probs1
 NER model pt SOTA
ner_tokenizer  AutoTokenizerfrom_pretrainedLucianobertimbaubaselener_br
ner_model  AutoModelForTokenClassificationfrom_pretrainedLucianobertimbaubaselener_br
ner_pipe  pipelinetokenclassification modelner_model tokenizerner_tokenizer aggregation_strategysimple
class MessageBaseModel
role str
content str
class ChatRequestBaseModel
model str
messages ListMessage
apppostchatcompletions summaryEndpoint compatível com OpenAI Chat API tagsOpenAI Compatible
def chat_completionsrequest ChatRequest
Endpoint compatível com o padrão OpenAI Chat API sem versionamento
user_message  nextmcontent for m in reversedrequestmessages if mrole  user 
 Aqui você pode integrar com seu pipelinemodelo real
return 
choices 
index 0
message 
role assistant
content fVocê disse user_message
finish_reason stop
apppostsentiment summaryAnálise de sentimento tagsNLP
def sentimenttext str  Body embedTrue
Retorna o sentimento do texto informado
result  sentiment_pipetext
return result result
apppostparaphrase summaryDetecção de paráfrase tagsNLP
def paraphrasephrase_a str  Body phrase_b str  Body
Retorna a probabilidade das frases serem paráfrases
result  paraphrase_scorephrase_a phrase_b
return result
apppostner summaryReconhecimento de entidades nomeadas NER tagsNLP
def nertext str  Body embedTrue
Retorna entidades nomeadas encontradas no texto
result  ner_pipetext
return result result