 O que vem no pacote
bindinggyp configuração do nodegyp
bindingsentencepiece_nativecc código C com binding para encode
srcindexts wrapper TypeScript para uso direto com tipagem
srcindexdts definição de tipos tokenizetext string modelPath string
 Para compilar e usar
Instale dependências
npm install
npm install nodeaddonapi
Compile
npx nodegyp configure
npx nodegyp build
import  tokenize  from buildReleasesentencepiece_native
const ids  tokenizeExemplo de prompt modelsllamamodel
consolelogids
Se quiser posso evoluir esse projeto para
Suporte a decode