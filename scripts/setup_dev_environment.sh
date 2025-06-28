#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento..."

# Atualizar os repositórios
echo "📦 Atualizando repositórios..."
sudo apt update

# Instalar dependências básicas
echo "🔧 Instalando dependências básicas..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    git \
    curl \
    wget

# Instalar Node Version Manager (nvm)
echo "📥 Instalando NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar versões do Node
echo "📥 Instalando versões do Node..."
nvm install 16
nvm install 18
nvm install 20
nvm install 22

# Usar Node 18 como padrão
nvm use 18

# Instalar gerenciadores de pacotes e ferramentas globais
echo "📦 Instalando gerenciadores de pacotes e ferramentas..."
npm i -g pnpm
npm i -g yarn

npm i -g typesync nodemon eslint prettier vitest @types/node \
    npm-check depcheck jest ts-node ts-jest prettier-package-json \
    dotenv tsconfig-paths @nestjs/cli express-generator concurrently pm2

# Instalar ferramentas Python
echo "🛠️ Instalando ferramentas Python..."
pip3 install --user \
    pipenv \
    poetry \
    black \
    flake8 \
    mypy \
    pytest \
    ipython

# Configurar os projetos
echo "🔧 Configurando projetos..."
cd packages

# Admin
echo "⚙️ Configurando admin..."
cd admin
pnpm install
cd ..

# Client
echo "⚙️ Configurando client..."
cd client
pnpm install
cd ..

# Server
echo "⚙️ Configurando server..."
cd server
pnpm install
cd ..

# Speech
echo "⚙️ Configurando speech..."
cd speech
pnpm install
cd ..

# Inspect
echo "⚙️ Configurando inspect..."
cd inspect
pnpm install
cd ..

echo "✨ Instalação concluída! ✨"
echo "
Projetos configurados:
- admin
- client
- server
- speech
- inspect

Para iniciar os projetos:
1. Entre na pasta do projeto desejado: cd packages/[nome-do-projeto]
2. Execute: pnpm dev ou pnpm start (dependendo do projeto)
"

# Verificar versões
echo "📋 Versões instaladas:"
python3 --version
pip3 --version
git --version
node --version
pnpm --version
yarn --version
