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
  Shell no container docker
shell
docker run it rm slicespeech binbash  echo Container não está rodando
  Ajuda
help
echo n0331mComandos disponíveis0330mn
echo   install  Instala dependências projeto  vendors
echo   build  Build do projeto se aplicável
echo   start  Inicia produção
echo   dev  Inicia modo dev hot reload
echo   test  Executa testes
echo   lint  Lint do código
echo   format  Formata o código
echo   clean  Limpa tudo venv cache vendors etc
echo   logs  Mostra logs
echo   shell  Shell no container docker
echo   help  Mostra esta ajudan
 Makefile refatorado conforme o padrão do guia MAKE_FILESmd comandos claros ícones help visual instalação completa incluindo vendors limpeza total targets para dev start build test lint format logs e shell
Pronto para uso profissional e repositório próprio
User