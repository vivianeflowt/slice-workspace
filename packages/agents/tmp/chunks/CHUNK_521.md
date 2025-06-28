 Baseado no BERTimbau
O BERTimbau é um BERT treinado do zero em grandes corpora de português brasileiro capturando nuances gírias nomes próprios e estruturas sintáticas do idioma
 Finetuned no LenerBr
O LenerBr é um dos maiores datasets de NER em português com anotações detalhadas de entidades como pessoas organizações locais datas valores etc
 Resultados SOTA stateoftheart
Esse modelo é referência em benchmarks nacionais para tarefas de NER
 Exemplos de uso
python
from transformers import AutoTokenizer AutoModelForTokenClassification pipeline
model_name  Lucianobertimbaubaselener_br
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelForTokenClassificationfrom_pretrainedmodel_name
ner_pipe  pipelinetokenclassification modelmodel tokenizertokenizer aggregation_strategysimple
text  A Maria foi para São Paulo em 2023
result  ner_pipetext
printresult
 entity_group PER score 099 word Maria  
 Aplicações práticas no seu pipeline
 Anonimização de dados sensíveis
 Extração de nomes datas locais organizações de conversas
 Enriquecimento semântico dos seus datasets
 Facilita sumarização busca e clusterização temática
Resumo
Se você quer NERtoken classification de alta precisão em português esse modelo é uma das melhores escolhas disponíveis hoje
Se quiser posso integrar um endpoint NER no seu servidor FastAPI para consumir esse modelo facilmente
python
from transformers import AutoTokenizer AutoModelForTokenClassification pipeline