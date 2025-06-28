mas garanta que eles nao vao
Cursor
ignore
 Ignorar modelos grandes do Vosk e arquivos pesados
packagesspeechvendorvosk
carpa
 Ignorar arquivos de modelo e dataset em qualquer lugar
ckpt
weights
tflite
onnx
targz
vocab
model
 Ignorar arquivos de texto grandes em vendor
packagesspeechvendorvosktxt
Regras adicionadas ao gitignore para garantir que modelos grandes do Vosk e outros arquivos pesados não sejam mais versionados Sincronize o branch com segurança novos arquivos desses tipos não irão mais para o repositório Após o push prossiga com a limpezamigração dos arquivos já versionados conforme planejado
User
e os comits anteriores
Cursor
Os commits anteriores que já versionaram arquivos grandes modelos Vosk e similares continuam presentes no histórico do repositório Isso significa que mesmo com o gitignore atualizado o histórico ainda carrega esses arquivos  o que mantém o repositório pesado e o pushpull lento
Para resolver definitivamente