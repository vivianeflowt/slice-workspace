 3 Serviços
 Todos os serviços principais estão com 11 ou 22 réplicas OK
 discovery_coredns DNS  portas 53 TCPUDP expostas
 ollama_ollama  porta 11434 exposta
 portainer_agent e portainer_portainer  gerenciamento
 traefik_traefik  portas 80 e 8080 expostas
 4 Containers
 Todos os containers estão Up ativos e rodando
 Portas mapeadas corretamente
 Nenhum container parado ou com erro
 Diagnóstico
 Infraestrutura Swarm está saudável e operacional
 Todos os stacks essenciais estão ativos
 Containers e serviços estão rodando sem falhas aparentes
 Próximos passos sugeridos
1 Testar acesso aos serviços DNS Ollama Portainer Traefik via browser ou CLI
2 Verificar logs dos serviços se algum comportamento anômalo persistir
3 Monitorar espaço em disco e uso de recursos mas já está com folga
4 Se algum serviço específico apresentar erro envie o log para análise detalhada
Se quiser posso sugerir comandos para healthcheck automação de verificação ou checklist de pósmigração
Resumo
Infra Swarm está redonda Se houver bug pontual é caso de serviçoconfiguração  a base está sólida
Pronta para o próximo passo ou para debugar qualquer serviço específico
User
ja sei
olha o stack discovery
discovery confluto de porta