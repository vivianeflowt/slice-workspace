encoding  tiktokenencoding_for_modelgpt4
text  Seu system prompt aqui
tokens  encodingencodetext
printTokens usados lentokens
Lib pip install tiktoken
 2 Ferramentas online sem código
OpenAI Tokenizer Tool
Tiktokenizerdev
ChatGPT Token Calculator
Só colar o System Prompt e ele conta
 Dica prática
ModeloMáx tokens por promptTokens ideais de system prompt
gpt35turbo4k16k 300
gpt48k128k 500
gpt4o128k 500 ou  5 do total
Se quiser posso te gerar um script CLI pronto pra usar Quer versão em Python Nodejs ou Bash
Você disse
existe algo pra typescript
O ChatGPT disse
Sim A melhor opção para contar tokens em TypeScript hoje é usando a lib dqbdtiktoken  que é baseada no mesmo tokenizador da OpenAI tiktoken original em Rust
 Instalação
npm install dqbdtiktoken
 Requer Node  16 Lib usa WebAssembly wasm então pode demorar um pouco na primeira execução
 Exemplo Completo em TypeScript
import  encoding_for_model  from dqbdtiktoken
async function contarTokensprompt string modelo string  gpt4 
const encoder  await encoding_for_modelmodelo
const tokens  encoderencodeprompt
consolelogTokens usados modelo tokenslength
encoderfree  Libera memória WASM