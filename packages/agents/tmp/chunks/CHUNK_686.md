yaml
services
ollama
image ollamaollamalatest
 outras configs
 8888
 1111
shellscript
docker run dns8888 dns1111 
shellscript
docker exec it container_id bash
echo nameserver 8888  etcresolvconf
User
sera que rodar no host nao resolve
que passa sempre pelo server mesmo
Cursor
Sim rodar o Ollama diretamente no host fora do DockerSwarm pode ajudar a isolar o problema
Quando você executa no host o serviço usa diretamente o DNS rede e permissões do sistema operacional sem as camadas extras de abstração do DockerSwarm
 Por que isso pode resolver ou ajudar no diagnóstico
 DNS O container pode estar herdando configurações de DNS do Docker que podem ser diferentes do host No host você garante que está usando o etcresolvconf do sistema
 Rede Elimina possíveis problemas de rede interna do Docker NAT bridge overlay etc
 Permissões Usa diretamente as permissões do usuário do host
 ProxyFirewall Facilita identificar se há bloqueio no nível do container ou do host
 Como testar