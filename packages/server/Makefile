# 🚀 Makefile — Project Manager Server (Slice Standard)
# Comandos universais para automação, build, testes e Docker

PROJECT_NAME ?= server
REGISTRY ?= <seu-registry>
IMAGE ?= $(REGISTRY)/$(PROJECT_NAME):latest

.PHONY: prepare install dev serve clean build format lint test test-e2e docker-build docker-push help

prepare:
	@echo "🔧 Preparando ambiente do projeto..."
	# Adicione comandos de preparação aqui (ex: copiar .env.example, checar pré-requisitos)

install:
	@echo "📦 Instalando dependências..."
	pnpm install || npm install || yarn install

dev:
	@echo "🚀 Iniciando em modo desenvolvimento..."
	pnpm run dev || npm run dev || yarn dev

serve:
	@echo "🌐 Iniciando em modo produção..."
	pnpm run start || npm run start || yarn start

clean:
	@echo "🧹 Limpando dependências, caches e arquivos temporários..."
	rm -rf node_modules dist .turbo .next .cache coverage .eslintcache

build:
	@echo "🏗️  Realizando build do projeto..."
	pnpm run build || npm run build || yarn build

format:
	@echo "🎨 Formatando código-fonte..."
	pnpm run format || npm run format || yarn format

lint:
	@echo "🔎 Rodando linter..."
	pnpm run lint || npm run lint || yarn lint

test:
	@echo "🧪 Executando testes unitários..."
	pnpm run test || npm run test || yarn test

test-e2e:
	@echo "🧪🔗 Executando testes end-to-end..."
	pnpm run test:e2e || npm run test:e2e || yarn test:e2e

docker-build:
	@echo "🐳 Buildando imagem Docker..."
	docker build -t $(IMAGE) .

docker-push:
	@echo "📦 Enviando imagem Docker para o registry..."
	docker push $(IMAGE)

help:
	@echo "\nComandos disponíveis para $(PROJECT_NAME):\n"
	@echo "  🔧 prepare      — Prepara o projeto para instalação"
	@echo "  📦 install      — Instala todas as dependências"
	@echo "  🚀 dev          — Executa em modo desenvolvimento"
	@echo "  🌐 serve        — Executa em modo produção"
	@echo "  🧹 clean        — Limpa dependências, caches e temporários"
	@echo "  🏗️  build        — Realiza o build do projeto"
	@echo "  🎨 format       — Formata o código-fonte"
	@echo "  🔎 lint         — Valida o código com linter"
	@echo "  🧪 test         — Executa testes unitários"
	@echo "  🧪🔗 test-e2e     — Executa testes de integração/end-to-end"
	@echo "  🐳 docker-build — Builda a imagem Docker"
	@echo "  📦 docker-push  — Envia a imagem Docker para o registry"
	@echo "  🆘 help         — Mostra esta ajuda"
