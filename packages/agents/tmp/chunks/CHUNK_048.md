 Quer que eu crie o protótipo completo desse pipeline
Incluindo
Transcrição com Whisper ou simulação com txt
Parser semântico
Task splitter
Geração de TASKSmd
Arquivo zip com tudo
Posso começar isso agora mesmo Confirma
Você disse
Vou te passar todos os modelos que eu tenho disponível no meu servidor aí você vê o que faz mais sentido
export const DEEPSEEK_MODELS  
deepseekchat  DeepSeek Chat modelo principal para conversação geral
deepseekcoder  DeepSeek Coder modelo especializado em programaçãocódigo
deepseekmoe  DeepSeek MoE modelo mixtureofexperts bom para tarefas diversas
deepseekvl  DeepSeek VisionLanguage modelo multimodal textoimagem
deepseekmath  DeepSeek Math modelo especializado em matemática e raciocínio lógico
deepseekreasoner  DeepSeek Reasoner modelo para raciocínio avançado
deepseekllm  DeepSeek LLM modelo base LLM
deepseekcodervl  DeepSeek Coder VL modelo de código multimodal textoimagem
 as const
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
deepseekcoder33b  Deepseek Coder 33B  Especialista em código excelente para geração e compreensão
codellama34b  CodeLlama 34B  Meta especialista em código bom para tarefas de programação
codellama70b  CodeLlama 70B  Meta especialista em código alta qualidade
codestral22b  Codestral 22B  Mistral especialista em código ótimo para tarefas complexas
dbrx132b  DBRX 132B  Databricks LLM de código e raciocínio muito robusto
 Modelos multimodais
llava13b  LLaVA 13B  Multimodal textoimagem bom para tasks visuais
granite32visionlatest  Granite Vision  Multimodal tasks visuais avançadas