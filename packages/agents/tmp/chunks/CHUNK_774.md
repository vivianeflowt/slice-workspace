typescript
const toInstall  OLLAMA_MODELS
filterorigName  installedNamesincludesOllamaManagernormalizeorigName
sorta b  MODEL_SIZESa  Infinity  MODEL_SIZESb  Infinity
 opcional shuffle apenas os de mesmo tamanho se quiser aleatoriedade
User
OllamaModelsts aqui ne
Cursor
 Exatamente é no arquivo OllamaModelsts que você pode definir ou manter um objeto com os tamanhos estimados dos modelos usando os mesmos nomes da lista OLLAMA_MODELS como chave
Exemplo de estrutura para adicionar no mesmo arquivo
export const OLLAMA_MODEL_SIZES Recordstring number  
phi3mini4b 4
llama38b 8
mistral7b 7
gemma2b 2
gemma7b 7
openchat35 35
openchat7b 7
solar107b 107
codellama34b 34
codellama70b 70
llama370b 70
mixtral8x7b 56
mixtral8x22b 176
wizardlm28x22b 176
phi3medium14b 14
solar70b 70
codestral22b 22
dbrx132b 132
llava13b 13
granite32visionlatest 32
deepseekcoder33b 33
 Embeddings e sumarização valores aproximados ou baixos
nomicembedtext 1
allminilml6v2 1
bartlargecnn 1
t5base 1
Assim você pode ordenar a lista de instalação pelo tamanho antes de baixar priorizando os menores
typescript
export const OLLAMA_MODEL_SIZES Recordstring number  
phi3mini4b 4
llama38b 8
mistral7b 7
gemma2b 2
gemma7b 7
openchat35 35
openchat7b 7
solar107b 107
codellama34b 34
codellama70b 70
llama370b 70
mixtral8x7b 56
mixtral8x22b 176
wizardlm28x22b 176
phi3medium14b 14
solar70b 70
codestral22b 22
dbrx132b 132
llava13b 13
granite32visionlatest 32
deepseekcoder33b 33
 Embeddings e sumarização valores aproximados ou baixos
nomicembedtext 1
allminilml6v2 1
bartlargecnn 1
t5base 1
User