export const OLLAMA_MODEL_SIZES Recordstring number  
  LLMs Gerais 
llama38b 8
llama370b 70
mistral7b 7
mixtral8x7b 56
mixtral8x22b 176
wizardlm28x22b 176
phi3mini4b 4
phi3medium14b 14
gemma2b 2
gemma7b 7
openchat35 35
openchat7b 7
solar107b 107
solar70b 70
  Modelos de Código 
codellama34b 34
codellama70b 70
codestral22b 22
dbrx132b 132
deepseekcoder33b 33
  Modelos Multimodais 
llava13b 13
granite32visionlatest 32
  Modelos de EmbeddingsSemelhança 
nomicembedtext 1
allminilml6v2 1
  Modelos de Sumarização 
bartlargecnn 1
t5base 1
  existing code 
User
OllamaManagerts adicione a logica de priorizacao de medelos menores na instalar
OllamaModelsts deixe comentado pra de forma que outras IA entendam que a lista de cima sao os modelos e a lista de baixo serve pra priorizacao ao manipular o arquivo
Cursor
typescript
 OLLAMA_MODELS Lista principal de modelos a serem utilizados no ambiente Ollama
 Editeadicioneremova modelos aqui para controlar quais estarão disponíveis no sistema
export const OLLAMA_MODELS  
  LLMs Gerais compreensão sumarização organização raciocínio 
llama38b  Meta Llama 3 8B  rápido bom custobenefício
llama370b  Meta Llama 3 70B  alta qualidade raciocínio avançado
mistral7b  Mistral 7B  leve rápido bom para tarefas simples
mixtral8x7b  Mixtral 8x7B  ótimo para instrução e tarefas gerais
mixtral8x22b  Mixtral 8x22B  mais robusto ótimo para raciocínio
wizardlm28x22b  WizardLM 2 8x22B  excelente para seguir comandos complexos
phi3mini4b  Microsoft Phi3 Mini 4B  pequeno eficiente ideal para edgedevices
phi3medium14b  Microsoft Phi3 Medium 14B  ótimo para raciocínio e tarefas gerais
gemma2b  Google Gemma 2B  pequeno rápido uso leve
gemma7b  Google Gemma 7B  eficiente bom para tarefas gerais
openchat35  OpenChat 35  chat instrução conversação
openchat7b  OpenChat 7B  chat instrução mais robusto
solar107b  Solar 107B  bom para raciocínio e instrução
solar70b  Solar 70B  alta qualidade ótimo para raciocínio