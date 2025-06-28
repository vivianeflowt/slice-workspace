1 Pare o serviço Ollama no SwarmDocker
bash
docker stack rm ollama
2 Rode o Ollama no host
 Siga as instruções de instalação do Ollama para Linux binário ou via package manager
 Inicie o serviço e tente baixar modelos
3 Teste DNS e downloads normalmente
 Se funcionar no host o problema está na configuração do DockerSwarm DNS rede permissão
 Se continuar falhando o problema é externo rede firewall proxy upstream
 Resumo
 Rodar no host elimina variáveis do DockerSwarm
 Se funcionar foque em ajustar DNSrede do Docker
 Se não funcionar o problema é mais profundo rede externa firewall proxy etc
Se quiser posso te passar o passo a passo para instalar e rodar o Ollama direto no host ou ajudar a comparar as configs de DNSrede entre host e container
shellscript
docker stack rm ollama
User
tem 2 coisas esquisitas
prmeiro trafiek nao mapeia ollama no painel
Cursor