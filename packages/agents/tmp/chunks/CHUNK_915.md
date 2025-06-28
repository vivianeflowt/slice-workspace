faça isso
eu vou mover depois pra outro repo mas preciso sincronizar dev
Cursor
O principal motivo da lentidão é o volume de arquivos grandes modelos Vosk já versionados no histórico do repositório Para sincronizar o branch develop agora o push será demorado mas é possível concluir
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