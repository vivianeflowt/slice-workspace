Vou aplicar esse ajuste agora
User
install deve installar tudo inclusive o vendors por exemplo
Cursor
makefile
DEFAULT_GOAL  help
PHONY help install dev serve test lint clean
help
echo Comandos disponíveis
echo  make install  Instala dependências do projeto e dos vendors
echo  make dev  Roda servidor FastAPI com reload dev
echo  make serve  Roda servidor FastAPI produção
echo  make test  Executa testes pytest
echo  make lint  Opcional Lintformat blackisort
echo  make clean  Limpa tudo venv pdm pdmpython __pycache__ vendors caches etc
install
pdm install
 Instala dependências dos vendors
cd vendortts  pdm install  pip install e   pip install r requirementstxt
cd vendordeepspeaker  pip install e   pip install r requirementstxt
cd vendorretrievalbasedvoiceconversion  pdm install  pip install e   pip install r requirementstxt
cd vendorsilerosilerovad  pdm install  pip install e   pip install r requirementstxt
cd vendorsilerosileromodels  pdm install  pip install e   pip install r requirementstxt
cd vendorwhisper  pip install r requirementstxt
pdm run dev
serve
pdm run serve
test
pdm run test