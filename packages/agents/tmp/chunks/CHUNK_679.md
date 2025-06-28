1 No host
bash
nslookup googlecom
dig ollamalocalcloudio
2 Dentro de um container
bash
docker exec it container_id nslookup googlecom
docker exec it container_id nslookup ollamalocalcloudio
3 Testar resolução interna entre containers
 Tente pingar ou curl de um container para outro usando o nome do serviço
4 Verifique se o Traefik resolve nomes de backend corretamente
 Veja os logs do Traefik para mensagens de erro de DNS
Se todos esses testes passam DNS está 100
Se ainda houver algum serviço que não aparece no Traefik ou não responde o problema provavelmente está em
 Labelsconfiguração do serviço no stack
 Porta não exposta corretamente
 Rede DockerSwarm
 Permissões ou healthcheck do serviço
Se quiser envie logs ou prints de qualquer serviço que ainda não aparece ou não responde que eu te ajudo a debugar o próximo passo
shellscript
nslookup googlecom
dig ollamalocalcloudio
shellscript
docker exec it container_id nslookup googlecom
docker exec it container_id nslookup ollamalocalcloudio
User
sliceprojectmanager gitfeaturealive  nslookup googlecom
dig ollamalocalcloudio
Server1270053
Address127005353