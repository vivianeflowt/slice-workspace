User
tudo deve ser simples
Cursor
 Vou deixar o Makefile simples e direto
 O comando make clean vai limpar absolutamente tudo inclusive venv e dependências dos vendors
 Não haverá distinção entre clean e cleanall  um comando só resolve tudo
 O fluxo de instalação e build será sempre previsível e reprodutível
Vou aplicar esse ajuste agora
User
install deve installar tudo inclusive o vendors por exemplo
Cursor
makefile
DEFAULT_GOAL  help
PHONY help install dev serve test lint clean
help
echo Comandos disponíveis
echo  make install  Instala dependências do projeto e dos vendors
echo  make dev  Roda servidor FastAPI com reload dev
echo  make serve  Roda servidor FastAPI produção
echo  make test  Executa testes pytest
echo  make lint  Opcional Lintformat blackisort
echo  make clean  Limpa tudo venv pdm pdmpython __pycache__ vendors caches etc