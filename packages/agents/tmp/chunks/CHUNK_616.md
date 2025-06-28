User
usammos docker swarm ia pythonzeira
Makefile makefile pra isso veja o que tem up e coloque no script pra descer
up down os stacks que tao deploy
Cursor
Perfeito Você está usando Docker Swarm e os stacks ativos visíveis no Portainer são
 discovery_coredns
 discovery_pihole
 ollama_ollama
 portainer_agent
 portainer_portainer
 traefik_traefik
 Script Makefile para down e up dos stacks
Aqui está um exemplo de como automatizar a descida e subida dos stacks no seu Makefile em sliceinfrastructureMakefile
makefile
PHONY stacksdown stacksup