apppostparaphrase
def paraphrasephrase_a str  Body phrase_b str  Body
result  paraphrase_scorephrase_a phrase_b
return result
apppostner
def nertext str  Body embedTrue
result  ner_pipetext
return result result
 Para rodar uvicorn serverappapp host 0000 port 11001 reload
if __name__  __main__
uvicornrunserverappapp host0000 port11001 reloadTrue
Servidor FastAPI pronto no path correto mediadatallvmpromptserverapppy com endpoints para
 Análise de sentimento sentiment
 Detecção de paráfrase paraphrase
 NERtoken classification ner
Todos usando modelos otimizados para português
Agora é só instalar as dependências rodar o servidor e consumir os endpoints
Se quiser já posso gerar o Makefile instruções de uso e garantir que os modelos baixem automaticamente na primeira execução
Avise se quer que eu siga com esses passos
User
vc ja ta na pasta correta