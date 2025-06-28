Você disse
o ollama nao tem
whisper  whisper  transcrição
whisperlarge  whisperlarge  transcrição
como fazer pra instalar
O ChatGPT disse
O Ollama atualmente não oferece o modelo Whisper nativamente nem whisper nem whisperlarge como faz com LLaMA Mistral etc
 Alternativas práticas
 1 Use Whisper CLI da OpenAI
Instale com
pip install githttpsgithubcomopenaiwhispergit
E rode com
whisper audiowav model medium language pt fp16 False
Modelos disponíveis
tiny base small medium large largev2
 2 Use fasterwhisper mais rápido e leve
pip install fasterwhisper
Usa quantização com CTranslate2 mais leve que o Whisper original
 3 Use silero como fallback offline leve e direto
Instalação
pip install torch torchaudio
pip install githttpsgithubcomsnakers4sileromodelsgit
Código de exemplo depois te passo se quiser