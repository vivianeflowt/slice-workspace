 PDM
pdmlock
pdmpython
markdown
 Projeto FastAPI NLP
Este projeto oferece uma API compatível com OpenAI para análise de sentimento detecção de paráfrase e reconhecimento de entidades nomeadas NER usando modelos transformers
 Instalação
Recomendase o uso de ambiente virtual
bash
python3 m venv venv
source venvbinactivate
pip install r requirementstxt  ou use PDMPoetry conforme pyprojecttoml
 Execução do servidor
bash
uvicorn serverappapp reload port 11001
 Endpoints principais
 POST chatcompletions  Compatível com API OpenAI
 POST sentiment  Análise de sentimento
 POST paraphrase  Detecção de paráfrase
 POST ner  Reconhecimento de entidades nomeadas