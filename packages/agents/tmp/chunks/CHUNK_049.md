 httpsplatformopenaicomdocsmodels
export const OPENAI_MODELS  
gpt4o  GPT4o modelo mais avançado multimodal texto imagem áudio rápido e custoeficiente
gpt4turbo  GPT4 Turbo modelo de alta performance custo reduzido ótimo para produção
gpt4  GPT4 modelo robusto excelente para raciocínio e tarefas complexas
gpt432k  GPT4 32k versão com contexto expandido 32k tokens
gpt4visionpreview  GPT4 Vision entrada multimodal textoimagem preview
gpt35turbo  GPT35 Turbo modelo rápido custo baixo bom para tarefas gerais
gpt35turbo16k  GPT35 Turbo 16k versão com contexto expandido 16k tokens
gpt35  GPT35 modelo intermediário bom para tarefas gerais
textdavinci003  Davinci 003 modelo legado bom para geração de texto criativo
textdavinci002  Davinci 002 modelo legado bom para tarefas gerais
textcurie001  Curie modelo legado rápido bom para classificação e moderação
textbabbage001  Babbage modelo legado rápido tarefas simples
textada001  Ada modelo legado muito rápido tarefas básicas
whisper1  Whisper transcrição e tradução de áudio
dalle3  DALLE 3 geração de imagens de alta qualidade
dalle2  DALLE 2 geração de imagens versão anterior
tts1  TTS 1 TexttoSpeech voz sintética
tts1hd  TTS 1 HD TexttoSpeech voz sintética de alta qualidade
tts11106  TTS 1 novembro 2023 TexttoSpeech versão específica
tts1hd1106  TTS 1 HD novembro 2023 TexttoSpeech versão específica
audiotranscribe1  Audio Transcribe 1 transcrição de áudio Whisper
audiotranscribe11106  Audio Transcribe 1 novembro 2023 transcrição de áudio
audiotranslate1  Audio Translate 1 tradução de áudio
audiotranslate11106  Audio Translate 1 novembro 2023 tradução de áudio
 as const
export const PERPLEXITY_MODELS  
sonarsmallchat  Sonar Small Chat modelo leve rápido bom para tarefas simples e custo reduzido
sonarmediumchat  Sonar Medium Chat modelo intermediário equilíbrio entre custo e performance
sonarlargechat  Sonar Large Chat modelo robusto bom para tarefas complexas
sonarprochat  Sonar Pro Chat modelo mais avançado alta qualidade ótimo para produção
llama3sonarsmall32kchat  Llama 3 Sonar Small 32k Llama 3 adaptado pela Perplexity contexto expandido
llama3sonarlarge32kchat  Llama 3 Sonar Large 32k Llama 3 adaptado alta performance contexto expandido
mistral7binstruct  Mistral 7B Instruct modelo opensource instrução bom para tarefas gerais
mixtral8x7binstruct  Mixtral 8x7B Instruct modelo opensource instrução robusto
codellama70binstruct  CodeLlama 70B Instruct especializado em código instrução
 as const
export const SPEECH_MODELS  whisper silero xtts coqui as const
O ChatGPT disse
Memória salva atualizada
Perfeito Com a quantidade e variedade de modelos que você tem dá pra montar um pipeline IA de outro nível com distribuição por especialidade Aqui vai a proposta tática do fluxo
 Pipeline Áudio  Tarefas Autônomas Executáveis
 Etapas com escolha de modelo ideal
EtapaDescriçãoModelos recomendados
 TranscriçãoConverte voz para textowhisper OpenAI silero xtts
 Interpretação inicialSepara o texto em blocos de intençãocontextogpt4o deepseekreasoner sonarlargechat
 Agrupamento e síntese lógicaAgrupa ideias retira redundância e separa por domínio códigoinfradeepseekmoe mixtral gpt4turbo
 Geração de Tasks refinadasFormata em TASKSmd com title description module promptwizardlm2 phi3medium llama370b
 Atribuição de IA executoraDefine qual IA autônoma executará a taskBaseado em campo systemPromptTarget
 Output final estruturadoExporta em JSON YAML ou MarkdownNA formatação
 Exemplo de uso no seu servidor
Entrada gravação wav  whisper  texto
Texto
Quero que o sistema permita treinar vocabulário com SentencePiece Depois ele precisa criar uma interface CLI com benchmark
Tarefas geradas
 title Adicionar suporte a treino de vocabulário
systemPromptTarget iadevnlp
description Criar CLI que recebe txt roda spm_train e gera modelvocab
modelSuggestion deepseekcoder33b
 title Criar benchmark automático póstreino
systemPromptTarget iabenchmarknlp
description Avalia compressão média de tokens e gera relatório
modelSuggestion dbrx132b
 Entregável que posso montar agora
 Projeto completo com
Entrada wav mp3 ou txt