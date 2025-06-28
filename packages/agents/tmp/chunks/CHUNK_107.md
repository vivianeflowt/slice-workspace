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
  Lint
lint
black server  true
isort server  true
  Formatador
format
black server
isort server
  Limpa tudo venv cache vendors etc
clean
rm rf __pycache__ pdm pytest_cache venv pdmpython
find  name pyc delete
rm rf vendorttsvenv vendorttspdm vendorttspytest_cache vendortts__pycache__
rm rf vendordeepspeakervenv vendordeepspeakerpdm vendordeepspeakerpytest_cache vendordeepspeaker__pycache__
rm rf vendorretrievalbasedvoiceconversionvenv vendorretrievalbasedvoiceconversionpdm vendorretrievalbasedvoiceconversionpytest_cache vendorretrievalbasedvoiceconversion__pycache__
rm rf vendorsilerosilerovadvenv vendorsilerosilerovadpdm vendorsilerosilerovadpytest_cache vendorsilerosilerovad__pycache__
rm rf vendorsilerosileromodelsvenv vendorsilerosileromodelspdm vendorsilerosileromodelspytest_cache vendorsilerosileromodels__pycache__
rm rf vendorwhispervenv vendorwhisperpdm vendorwhisperpytest_cache vendorwhisper__pycache__
  Logs
logs
tail f speech_serverlog  echo Nenhum log encontrado