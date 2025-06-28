shellscript
ls l mediadataollama
shellscript
ls lR mediadataollama  head 40
shellscript
df h mediadata
shellscript
docker ps  grep ollama
shellscript
docker logs docker ps  grep ollama  awk print 1  tail 40
User
stacks analise primeiro a infra
Cursor
Não consegui rodar os comandos do Docker Swarm  provavelmente porque o terminal atual não tem permissão o Docker não está rodando ou não está no nó manager do Swarm
 O que você pode fazer
 Certifiquese de estar no hostnó correto manager
 Verifique se o Docker está rodando sudo systemctl status docker
 Se necessário rode os comandos com sudo