O erro agora mudou
cant open file homevivilocalshareTrashfilesllmnlpserverserverdownload_modelspy Errno 2 No such file or directory
Ou seja o PDM está tentando rodar o script em um ambiente virtual que está no lixo Trash e o arquivo não existe mais lá
Diagnóstico
 O ambiente virtual do PDM está corrompido ou foi movido para a lixeira
 O PDM está tentando usar um ambiente antigo não o do projeto atual
 O script serverdownload_modelspy existe no path correto do projeto mas o ambiente virtual está apontando para um local inválido
 Solução definitiva
1 Remover o ambiente virtual corrompido
pdm venv remove
2 Criar um novo ambiente virtual limpo
pdm venv create
3 Instalar as dependências novamente
pdm install
4 Executar o script de download
pdm run python3 serverdownload_modelspy
Se preferir posso rodar esses comandos para você
Assim o bagulho vai funfar de verdade sem ambiente zumbi do Trash
Confirma que posso executar essa sequência
plaintext
cant open file homevivilocalshareTrashfilesllmnlpserverserverdownload_modelspy Errno 2 No such file or directory
plaintext
pdm venv remove
plaintext
pdm venv create
plaintext
pdm install