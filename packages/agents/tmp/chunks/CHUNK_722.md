hosts
MAKE_FILESmd deixe o makefile top cmo segue o guia
Cursor
makefile
DEFAULT_GOAL  help
PHONY build start dev test lint format clean install logs shell help
  Instala dependências projeto  vendors
install
pdm install
cd vendortts  pdm install  pip install e   pip install r requirementstxt
cd vendordeepspeaker  pip install e   pip install r requirementstxt
cd vendorretrievalbasedvoiceconversion  pdm install  pip install e   pip install r requirementstxt
cd vendorsilerosilerovad  pdm install  pip install e   pip install r requirementstxt
cd vendorsilerosileromodels  pdm install  pip install e   pip install r requirementstxt
cd vendorwhisper  pip install r requirementstxt
  Build do projeto
build
echo Nada para buildar explicitamente  Python interpretado
  Inicia produção
start
pdm run serve
  Inicia modo dev hot reload
pdm run dev
  Testes
test
pdm run test