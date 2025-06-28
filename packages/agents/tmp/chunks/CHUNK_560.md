E adicione ao Makefile
makefile
test
pdm run pytest
Resumo
 Teste E2E  qualidade de verdade
 Tech lead pythonzeira não entrega sem teste
 Se quiser posso gerar todos os arquivos de teste e ajustar o Makefile pra você rodar tudo com make test
Quer que eu já aplique isso
python
from fastapitestclient import TestClient
from serverapp import app
client  TestClientapp
def test_sentiment
response  clientpostsentiment jsontext Eu amo esse projeto
assert responsestatus_code  200
assert result in responsejson
def test_paraphrase
response  clientpostparaphrase jsonphrase_a Oi phrase_b Olá
assert responsestatus_code  200
assert paraphrase in responsejson
def test_ner
response  clientpostner jsontext Maria foi para São Paulo em 2023
assert responsestatus_code  200
assert result in responsejson
makefile
test
pdm run pytest