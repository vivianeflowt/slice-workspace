User
ajusta os testes e2e
Cursor
python
def test_paraphrase
response  clientpostparaphrase jsonsentence_one Oi sentence_two Olá
assert responsestatus_code  200
assert paraphrase in responsejson
Teste E2E ajustado agora o endpoint paraphrase está alinhado com a assinatura real do FastAPI sentence_one sentence_two
Diagnóstico do erro atual
 O pytest está rodando em um ambiente virtual que foi movido para a lixeira homevivilocalshareTrashfilesllmnlpserver
 Por isso não encontra o arquivo de teste nem o projeto correto
Checklist para rodar os testes E2E de verdade
1 Remova o ambiente virtual zumbi
pdm venv remove
2 Crie um novo ambiente virtual
pdm venv create
3 Instale as dependências
pdm install
4 Rode os testes
pdm run pytest teststest_endpointspy
Resumo
 Teste ajustado 
 Ambiente virtual precisa ser limpo e recriado para os testes rodarem no path certo
Se quiser posso executar essa sequência para garantir que tudo funcione
Sinalize se posso seguir ou se prefere rodar manualmente