Para configurar o DNS diretamente em um container Docker incluindo Swarm você pode
 1 No dockercomposeyml ou stackyml
Adicione a opção dns no serviço desejado
yaml
services
ollama
image ollamaollamalatest
 8888
 1111
No seu stackyml do Swarm ficaria assim
yaml
services
ollama
image ollamaollamalatest
 outras configs
 8888
 1111
 2 Na linha de comando container avulso
bash
docker run dns8888 dns1111 
 3 Para containers já rodando testar dentro
Entre no container e edite etcresolvconf
bash
docker exec it container_id bash
echo nameserver 8888  etcresolvconf
 Atenção Isso é temporário ao reiniciar o container volta ao padrão
Resumo
 Para SwarmCompose use a opção dns no serviço
 Para teste rápido edite etcresolvconf dentro do container
Se quiser posso editar seu stackyml do Ollama e mostrar como fica
yaml
services
ollama
image ollamaollamalatest
 8888
 1111