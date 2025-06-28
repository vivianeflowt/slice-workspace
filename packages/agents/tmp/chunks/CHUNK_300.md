Recomendações imediatas para sincronizar
1 Garanta conexão estável durante o push
2 Execute o push pelo terminal para evitar timeouts do VSCode
git push origin develop
3 Tenha paciência o upload pode demorar bastante devido ao tamanho dos arquivos
Após sincronizar
 Prossiga com o plano de mover os modelos para outro repositório
 Limpe o histórico do repositório principal para remover rastros desses arquivos e acelerar futuros syncs
Se quiser posso preparar o passo a passo para limpeza do histórico e migração dos arquivos grandes assim que a sincronização for concluída
shellscript
git push origin develop
User
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