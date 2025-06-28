Pastas node_modules ambientes virtuais venv caches build e dist removidas Agora seu backup ficará muito mais limpo e leve Pode prosseguir com a cópia do repositório
User
depos tem que lembra de instalar
Cursor
Perfeito Após restaurar o backup ou clonar o repositório novamente lembrese de rodar os comandos de instalação para cada pacote
Para NodejsTypeScript
pnpm install
npm install
yarn install
Para ambientes Python
python m venv venv
source venvbinactivate
pip install r requirementstxt
pdm install
Se precisar posso gerar um script para reinstalar todas as dependências automaticamente em todos os pacotes do monorepo Só avisar
shellscript
pnpm install
npm install
yarn install
shellscript
python m venv venv
source venvbinactivate
pip install r requirementstxt
pdm install