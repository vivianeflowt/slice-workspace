1 Remova o ambiente virtual antigo opcional mas recomendado
bash
rm rf venv
2 Recrie o ambiente virtual e reinstale as dependências
bash
pdm venv create
pdm install
Ou se não usar o plugin de venv do pdm
bash
python3 m venv venv
source venvbinactivate
pdm install
3 Tente rodar novamente
bash
pdm run uvicorn serverappapp host 0000 port 11001 reload
Resumo
Ambientes virtuais Python não são portáveis entre pathsdiscos diferentes Sempre que mover remova e recrie o venv para garantir que todos os binários e links estejam corretos
Se der qualquer erro na reinstalação envie aqui o log que eu te ajudo a resolver
plaintext
FileNotFoundError Errno 2 No such file or directory mediadatallvmpromptvenvbinuvicorn
shellscript
rm rf venv
shellscript
pdm venv create
pdm install
shellscript
python3 m venv venv
source venvbinactivate
pdm install