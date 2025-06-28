1 Verifique o status do stack discovery
bash
docker stack ps discovery
docker stack services discovery
2 Veja os logs dos serviços do stack
 Descubra o nome do serviço ex discovery_coredns ou discovery_pihole
bash
docker service ls  grep discovery
 Veja os logs
bash
docker service logs nome_do_serviço
3 Cheque se o compose está correto
 Confirme o nome e o path do arquivo stacksdiscoverystacksyml ou dockercomposeyml
 Veja se as configurações de volumes networks e environment estão corretas para o novo mount mediadata
4 Procure por erros comuns
 Porta já em uso
 Volume não encontrado
 Falha ao baixar imagem
 Permissão negada no novo path
5 Se necessário remova e suba novamente o stack
bash
docker stack rm discovery
sleep 5
docker stack deploy c stacksdiscoverystacksyml discovery
6 Se persistir envie aqui
 O erro do log do serviço
 O trecho relevante do stacksyml do discovery
 A saída dos comandos acima
Dica
DNS é crítico Se o stack discovery não sobe outros serviços podem falhar por não resolver nomes
Por isso prioridade máxima para restaurar o DNS
Se quiser cole aqui o erro do log ou o compose do discovery que eu te ajudo a debugar linha a linha
shellscript
docker stack ps discovery
docker stack services discovery
shellscript
docker service ls  grep discovery