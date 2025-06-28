Ótima observação
Se o Traefik não está mapeando o Ollama no painel isso indica que ele não está reconhecendo o serviço como um backend HTTP válido Isso é fundamental para o proxy funcionar e para expor o serviço externamente
 Principais causas para o Traefik não mapear o Ollama
1 Labels mal posicionadas ou com erro de indentação
 No seu stackyml as labels precisam estar corretamente alinhadas não aninhadas sob networks
 Exemplo correto
yaml
services
ollama
 outras configs
networks
 traefikpublic
labels
 traefikenabletrue
 traefikhttproutersollamaruleHostollamalocalcloudio
 traefikhttproutersollamaentrypointsweb
 traefikhttpservicesollamaloadbalancerserverport11434
2 Serviço não está ouvindo na porta correta
 O Ollama precisa estar ouvindo em 11434 dentro do container
 Teste com
bash
docker exec it container_ollama netstat tulnp  grep 11434
3 Rede do serviço não é a mesma do Traefik
 Ambos precisam estar na mesma rede Docker traefikpublic
4 Stack não foi recarregado após ajuste
 Sempre faça
bash
docker stack deploy c stackyml ollama
docker service update force traefik_traefik
5 Erros de sintaxe no YAML
 Qualquer erro de indentação faz o Swarm ignorar as labels
6 Logs do Traefik
 Veja se há mensagens de erro sobre o serviço Ollama
bash
docker service logs traefik_traefik tail50
 Resumo de ação
 Corrija a indentação das labels
 Garanta que o Ollama está ouvindo na porta correta
 Certifiquese de que ambos estão na mesma rede
 Refaça o deploy do stack e force o reload do Traefik
 Verifique o painel e os logs do Traefik
Se quiser envie o trecho corrigido do stackyml e prints do painel após o reload ou os logs do Traefik para análise detalhada