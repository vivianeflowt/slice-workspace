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
lint
black server  true
isort server  true
clean
rm rf __pycache__ pdm pytest_cache venv pdmpython
find  name pyc delete
 Limpa vendors
rm rf vendorttsvenv vendorttspdm vendorttspytest_cache vendortts__pycache__
rm rf vendordeepspeakervenv vendordeepspeakerpdm vendordeepspeakerpytest_cache vendordeepspeaker__pycache__
rm rf vendorretrievalbasedvoiceconversionvenv vendorretrievalbasedvoiceconversionpdm vendorretrievalbasedvoiceconversionpytest_cache vendorretrievalbasedvoiceconversion__pycache__
rm rf vendorsilerosilerovadvenv vendorsilerosilerovadpdm vendorsilerosilerovadpytest_cache vendorsilerosilerovad__pycache__
rm rf vendorsilerosileromodelsvenv vendorsilerosileromodelspdm vendorsilerosileromodelspytest_cache vendorsilerosileromodels__pycache__
rm rf vendorwhispervenv vendorwhisperpdm vendorwhisperpytest_cache vendorwhisper__pycache__
User
MAKE_FILESmd
no caso o push ele faz push no registry da nossa infra com a imagem