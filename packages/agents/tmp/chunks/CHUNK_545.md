  Testes placeholder
test
echo Adicione testes com pytest ou outro framework
  Limpa arquivos pyc e cache
clean
find  type d name __pycache__ exec rm rf  
find  type f name pyc delete
  Ajuda
help
echo n0331mComandos disponíveis0330mn
echo   install  Instala dependências e baixa modelos
echo   dev  Inicia modo dev hot reload
echo   test  Executa testes
echo   clean  Limpa arquivos pyc e cache
echo   help  Mostra esta ajudan
Resumo
 make install instala tudo e baixa todos os modelos
 make dev sobe o servidor
 make clean remove cache
 make help mostra os comandos
Se quiser posso aplicar esse Makefile direto no seu projeto
makefile
DEFAULT_GOAL  help
PHONY install downloadmodels dev test lint format clean help
  Instala dependências e baixa todos os modelos
install
pdm install
pdm run python serverdownload_sentimentpy
pdm run python serverdownload_paraphrasepy
pdm run python serverdownload_nerpy
  Inicia modo dev hot reload
pdm run uvicorn serverappapp host 0000 port 11001 reload
  Testes placeholder
test
echo Adicione testes com pytest ou outro framework