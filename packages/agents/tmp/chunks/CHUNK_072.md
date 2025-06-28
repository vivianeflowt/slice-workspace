 Melhor estratégia pro teu projeto segundo tua prioridade de rodar local e barato
OpçãoPrósContras
fasterwhisperLeve rápido offline boa acuráciaMenor suporte a ruído
whisper OpenAI CLIAcurado suporte amploMais pesado mais lento
sileroMuito leve simplesLimitado a arquivos curtos
Quer que eu integre fasterwhisper com fallback pra silero no pipeline
Você disse
deModelos disponíveis
tiny base small medium large largev2
como instalar
O ChatGPT disse
Pra instalar os modelos do Whisper original da OpenAI em Python basta rodar a CLI uma vez com o modelo desejado  ele será baixado automaticamente
 Passo a passo
Instalar Whisper
pip install githttpsgithubcomopenaiwhispergit
Rodar com modelo específico
whisper audiowav model large language pt fp16 False
Isso já baixa o modelo large na primeira execução
 Modelos disponíveis e tamanhos aproximados
ModeloTamanhoMemória recomendadaVelocidade
tiny39 MB 1 GBMuito rápido
base74 MB1 GBRápido
small244 MB2 GBBom equilíbrio
medium769 MB4 GBMais preciso
large1550 MB8 GBMais acurado
largev21550 MB8 GBMelhor geral
Use model largev2 para pegar a versão mais atual do modelo grande
 Onde os modelos ficam salvos
Por padrão em