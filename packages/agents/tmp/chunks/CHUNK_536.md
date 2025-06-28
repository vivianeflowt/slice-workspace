Dicas finais para seu stack
 Os modelos serão baixados automaticamente na primeira execução dos endpoints
 O ambiente está isolado seguro e pronto para produção ou experimentação
 Os endpoints seguem o padrão OpenAI JSON POST fácil integração
Se quiser posso gerar um Makefile para facilitar ainda mais ex make dev para rodar o servidor 
shellscript
pdm run uvicorn serverappapp host 0000 port 11001 reload
User
Makefile makefile serve pra isso eu nao vou lembrar
baixa eles logo pq demora
Cursor
makefile
install
pdm install
downloadmodels
pdm run python3 c from transformers import pipeline AutoTokenizer AutoModelForSequenceClassification AutoModelForTokenClassification pipelinetextclassification modeltabularisaimultilingualsentimentanalysis AutoTokenizerfrom_pretrainedPrompsitparaphrasebertpt AutoModelForSequenceClassificationfrom_pretrainedPrompsitparaphrasebertpt AutoTokenizerfrom_pretrainedLucianobertimbaubaselener_br AutoModelForTokenClassificationfrom_pretrainedLucianobertimbaubaselener_br
pdm run uvicorn serverappapp host 0000 port 11001 reload