Comandos para rodar manualmente
bash
sudo docker node ls
sudo docker stack ls
sudo docker service ls
sudo docker ps a  head 40
Se quiser me envie a saída desses comandos para análise detalhada da infra ou me diga se quer que eu tente rodar novamente com sudo se permitido no ambiente
Assim que tiver a saída faço o diagnóstico completo da sua infraestrutura
shellscript
sudo docker node ls
sudo docker stack ls
sudo docker service ls
sudo docker ps a  head 40
User
 sliceprojectmanager gitfeaturealive  sudo docker node ls
sudo docker stack ls
sudo docker service ls
sudo docker ps a  head 40
ID HOSTNAME STATUS AVAILABILITY MANAGER STATUS ENGINE VERSION
snpc1qk4lok4krwgmqb1y6u9x localcloud Ready Active 2822
29pg2fy3fbwwlh2grjrr8e0gg  workstation Ready Active Leader 2822
NAME SERVICES
discovery 1
ollama 1
portainer 2
traefik 1
ID NAME MODE REPLICAS IMAGE PORTS
eey5gsfopcno discovery_coredns replicated 11 corednscorednslatest 5353tcp 5353udp
9yfhz9jspl7d ollama_ollama replicated 11 ollamaollamalatest 1143411434tcp
05rxtcy32pmq portainer_agent global 22 portaineragent2203
5hc62sr0p2js portainer_portainer replicated 11 portainerportainerce2203
gokge6m19q6u traefik_traefik replicated 11 traefikv211 8080tcp 80808080tcp
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
2876295347b1 ollamaollamalatest binollama serve 3 minutes ago Up 3 minutes 11434tcp ollama_ollama13j7phpcz53wyf6fsta6uprg11
738bef9bb85d traefikv211 entrypointsh pr 39 minutes ago Up 39 minutes 80tcp traefik_traefik1oxvkeuu96ortjp3mqu9l2u5v9
f42f67a27878 portaineragent2203 agent 40 minutes ago Up 40 minutes portainer_agent29pg2fy3fbwwlh2grjrr8e0gg8d63s1fwa8nqaxa0mz45u34sa
3ff0ae77297c portainerportainerce2203 portainer 40 minutes ago Up 40 minutes 8000tcp 9443tcp 000090009000tcp 90009000tcp portainer_portainer1znum41t674mpinq9yya326jj7
9d9606388a80 corednscorednslatest coredns 41 minutes ago Up 41 minutes 53tcp 53udp discovery_coredns1d69aeug42r25qbokitgdqrp8y
Cursor
Análise da sua infraestrutura Docker Swarm
 1 Swarm Nodes
 workstation Leader Manager  você está no nó correto para gerenciar
 localcloud Worker  online e pronto
 2 Stacks Ativos
 discovery DNSCoreDNS
 ollama Modelos IA
 portainer Gerenciamento
 traefik Proxy reverso