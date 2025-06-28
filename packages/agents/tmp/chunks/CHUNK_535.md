bash
pdm run uvicorn serverappapp host 0000 port 11001 reload
Assim o Python usará o ambiente correto com todos os pacotes instalados via PDM e os modelos serão baixados automaticamente na primeira execução
Se quiser posso gerar um Makefile para automatizar esse comando
Avise se deseja que eu faça isso ou se quer mais algum ajuste
shellscript
pdm run python serverapppy
shellscript
pdm run uvicorn serverappapp host 0000 port 11001 reload
User
Cursor
Ótimo Com as dependências instaladas via PDM e o path correto agora é só rodar o servidor FastAPI usando o ambiente do PDM
bash
pdm run uvicorn serverappapp host 0000 port 11001 reload