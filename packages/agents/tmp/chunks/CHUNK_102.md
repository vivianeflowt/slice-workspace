User
eu quero que você nesse nesse serviço aí que é o servidor de speak com os modos de speak Garanta que que no make Fire Você limpa todas as dependências para na hora que também esteja tudo no Beach que precisa para eu poder jogar isso para eu quero que você nesse nesse serviço aí que é o servidor de speak com os modos de speak Garanta que que no make Fire Você limpa todas as dependências para na hora que também esteja tudo no Beach que precisa para eu poder jogar isso para o repositório deixa ele preparado para eu colocar no repositório é justo o make file e crie tudo que precisa para docker e docker ignora nele e te ignorar também
resumindo prepare ele pra ir pra um repositorio proprio que vai sai desse
Cursor
 Resumo do que será feito para preparar o pacote speech para um repositório próprio
1 Makefile
 Garantir targets para instalação instalação de vendors dev serve test lint clean
 Adicionar um target cleanall que remove venv pdmpython __pycache__ pdm pytest_cache e dependências dos vendors
 Garantir que tudo que for dependência e build seja limpo
2 Dockerfile
 Garantir que instala todas as dependências inclusive vendors no build
 Usar dockerignore para não copiar arquivos desnecessários
3 dockerignore e gitignore
 Ignorar ambientes virtuais caches datasets grandes outputs logs arquivos temporários etc
 Garantir que nada desnecessário vá para o repositório ou para a imagem Docker
4 READMEmd
 Instruções claras de uso build dev produção e limpeza
5 Estrutura pronta para ser clonada e usada isoladamente