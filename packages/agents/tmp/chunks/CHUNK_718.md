2 Dockerfile
 Garantir que instala todas as dependências inclusive vendors no build
 Usar dockerignore para não copiar arquivos desnecessários
3 dockerignore e gitignore
 Ignorar ambientes virtuais caches datasets grandes outputs logs arquivos temporários etc
 Garantir que nada desnecessário vá para o repositório ou para a imagem Docker
4 READMEmd
 Instruções claras de uso build dev produção e limpeza
5 Estrutura pronta para ser clonada e usada isoladamente
Vou aplicar os ajustes necessários agora
makefile
  existing code 
cleanall
rm rf __pycache__ pdm pytest_cache venv pdmpython
find  name pyc delete
 Limpa vendors
rm rf vendorttsvenv vendorttspdm vendorttspytest_cache vendortts__pycache__
rm rf vendordeepspeakervenv vendordeepspeakerpdm vendordeepspeakerpytest_cache vendordeepspeaker__pycache__
rm rf vendorretrievalbasedvoiceconversionvenv vendorretrievalbasedvoiceconversionpdm vendorretrievalbasedvoiceconversionpytest_cache vendorretrievalbasedvoiceconversion__pycache__
rm rf vendorsilerosilerovadvenv vendorsilerosilerovadpdm vendorsilerosilerovadpytest_cache vendorsilerosilerovad__pycache__
rm rf vendorsilerosileromodelsvenv vendorsilerosileromodelspdm vendorsilerosileromodelspytest_cache vendorsilerosileromodels__pycache__
rm rf vendorwhispervenv vendorwhisperpdm vendorwhisperpytest_cache vendorwhisper__pycache__
  existing code 
ignore
 Python
__pycache__
pycod
egginfo
venv
pdmpython
pytest_cache
 Datasets outputs logs
vendorttstests
vendorttsdata
vendorttsdatasets
vendorttsoutputs
vendorttslogs
vendorttsweights
vendorttscheckpoints
vendorttsmodels
vendorttsexperiments
vendorttsembeddings
flac
targz
 IDEs
vscode
idea
 Docker
Dockerfile
dockerignore