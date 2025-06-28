Resumo
 Priorize LLMs generalistas llama3 mistral phi3 e embeddings nomicembedtext
 Se for usar análise de código inclua deepseekcoder e codellama
 Sumarização pode ser feita com os próprios LLMs
 Se precisar de algum modelo específico já defina para instalar agora pois o download pode ser demorado
Se quiser a lista de comandos pronta para instalar todos só avisar
shellscript
ollama pull llama3
ollama pull mistral
ollama pull phi3
ollama pull deepseekcoder
ollama pull codellama
ollama pull nomicembedtext
User
OllamaModelsts adicione na lista e faça uma breve descricao os que nao estao na lista
Cursor
typescript
export const OLLAMA_MODELS  
 LLMs gerais
llama38b  Meta Llama 3 8B  LLM geral rápido bom custobenefício
llama370b  Meta Llama 3 70B  LLM geral alta qualidade excelente para raciocínio
mistral7b  Mistral 7B  LLM geral leve rápido bom para tarefas simples
mixtral8x7b  Mixtral 8x7B  LLM misto bom para instrução e tarefas gerais
mixtral8x22b  Mixtral 8x22B  LLM misto mais robusto ótimo para instrução e raciocínio
wizardlm28x22b  WizardLM 2 8x22B  LLM instrução excelente para seguir comandos complexos
phi3mini4b  Microsoft Phi3 Mini 4B  LLM pequeno eficiente bom para edgedevices
phi3medium14b  Microsoft Phi3 Medium 14B  LLM médio ótimo para raciocínio e tarefas gerais
gemma2b  Google Gemma 2B  LLM pequeno rápido bom para uso leve
gemma7b  Google Gemma 7B  LLM médio eficiente bom para tarefas gerais
openchat35  OpenChat 35  LLM de chat instrução bom para conversação
openchat7b  OpenChat 7B  LLM de chat instrução mais robusto
solar107b  Solar 107B  LLM geral bom para raciocínio e instrução
solar70b  Solar 70B  LLM geral alta qualidade ótimo para raciocínio
 Modelos de código
codellama34b  CodeLlama 34B  Meta especialista em código bom para tarefas de programação
codellama70b  CodeLlama 70B  Meta especialista em código alta qualidade
codestral22b  Codestral 22B  Mistral especialista em código ótimo para tarefas complexas
dbrx132b  DBRX 132B  Databricks LLM de código e raciocínio muito robusto
 Modelos multimodais
llava13b  LLaVA 13B  Multimodal textoimagem bom para tasks visuais
granite32visionlatest  Granite Vision  Multimodal tasks visuais avançadas
deepseekcoder33b  Deepseek Coder 33B  Especialista em código excelente para geração e compreensão  Geração de Tasks
 Modelos de embeddings e sumarização
nomicembedtext  Nomic Embed Text  Geração de embeddings para busca semântica e agrupamento
allminilml6v2  AllMiniLML6v2  Embeddings leves rápidos ótimos para deduplicação e clustering
bartlargecnn  BART Large CNN  Sumarização dedicada ideal para resumos longos
t5base  T5 Base  Sumarização e reescrita de texto versátil para NLP
export type OllamaModel  typeof OLLAMA_MODELSnumber
User