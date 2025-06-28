tireo o pihole
a porta nao aparece
Cursor
Ótima observação
No Portainer a coluna Published Ports para o serviço ollama está vazia mesmo com a configuração ports  1143411434 no seu stackyml
 O que pode estar acontecendo
1 Docker Swarm  Traefik
 Quando você usa labels do Traefik e expõe o serviço via proxy o Swarm pode não mapear a porta diretamente no host deixando o Traefik responsável pelo roteamento
 O campo ports no Swarm só publica a porta se não houver conflito e se não estiver sendo gerenciado exclusivamente pelo Traefik
2 Porta já estava em uso conflito
 Se outro serviço ex pihole que você removeu já usava a porta 11434 o Swarm pode ter ignorado o mapeamento direto
3 PortainerSwarm UI Limitação
 Às vezes a UI do Portainer não mostra portas publicadas se o serviço está exposto só via rede interna ou proxy
 Como testar se o serviço está acessível
1 Via Traefik recomendado
 Acesse
httpollamalocalcloudio80
ou só httpollamalocalcloudio se o Traefik está na porta 80