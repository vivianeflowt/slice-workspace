Sempre exibir os detalhes
  Como Usar
 1 Prérequisitos
 Nodejs 16
 Python 3 para o nodegyp
 C toolchain buildessential cmake etc
 libsentencepiece compilado e disponível
 2 Instalação
bash
npm install
npm install nodeaddonapi
3 Compilação
Sempre exibir os detalhes
npx nodegyp configure
npx nodegyp build
4 Uso no TypeScript
Sempre exibir os detalhes
import  tokenize  from buildReleasesentencepiece_native
const ids  tokenizeExemplo de prompt modelsllamamodel
consolelogids
 Funções Disponíveis
tokenizetext string modelPath string number
Tokeniza a string usando o modelo model do SentencePiece
Retorna array de IDs numéricos