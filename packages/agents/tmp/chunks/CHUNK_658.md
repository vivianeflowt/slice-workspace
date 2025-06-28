Ótima hipótese Permissão de disco é um dos problemas mais comuns após migração de mount especialmente em ambientes Docker Swarm
 Checklist para Diagnóstico e Correção de Permissão
1 Verifique o usuário do processocontainer
 Descubra qual usuário está rodando o serviço Ollama
bash
docker ps  grep ollama
docker inspect container_id  grep i user
 Se não estiver explícito normalmente é root ou 10001000 usuário padrão do host
2 Cheque permissões do diretório de modelos
 Exemplo
bash
ls l mediadataollama
 O diretório deve ser gravável pelo usuário do container
3 Corrija permissões exemplo para usuário 10001000
bash
sudo chown R 10001000 mediadataollama
sudo chmod R 770 mediadataollama
 Se o usuário for diferente ajuste conforme necessário
4 Se o volume é montado no Docker confira o path
 No dockercomposeyml ou stackyml
yaml
volumes
 mediadataollamarootollama
 O path do host deve ser gravável pelo usuário do container
5 Reinicie o serviçocontainer após ajuste
bash
docker service update force nome_do_serviço_ollama
Resumo
Permissão errada  Ollama não consegue gravar modelos  falha silenciosa ou timeout
Ajuste o ownergrupo do diretório de modelos para bater com o usuário do container
Se quiser envie a saída do ls l do diretório de modelos e o trecho do composestack do Ollama para eu te passar o comando exato
shellscript
docker ps  grep ollama
docker inspect container_id  grep i user