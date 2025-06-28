PYTHON  python3
PDM  pdm
UVICORN  uvicorn
APP_MODULE  serverappapp
HOST  0000
PORT  11001
install
PDM install
downloadmodels
PYTHON serverdownload_modelspy
PDM run UVICORN APP_MODULE host HOST port PORT reload
lint
PDM run ruff server
format
PDM run ruff format server
test
PDM run pytest
clean
find  type d name __pycache__ exec rm rf  
rm rf pytest_cache ruff_cache mypy_cache
help
echo Comandos disponíveis
echo  install Instala as dependências do projeto
echo  downloadmodels Baixa os modelos necessários
echo  dev Inicia o servidor em modo desenvolvimento
echo  lint Executa o linter ruff
echo  format Formata o código ruff format
echo  test Executa os testes automatizados
echo  clean Remove arquivos temporários e caches
echo  help Mostra esta mensagem de ajuda
User