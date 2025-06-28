Cursor
Sua análise faz total sentido
Depois de tudo que já foi testado DNS rede stack labels configs permissão de discovolume é a causa mais provável para o Ollama ou qualquer serviço Docker não funcionar corretamente especialmente após migração de mount ou alteração de paths
 Checklist para garantir permissão correta
1 Verifique o usuário do container
 Normalmente containers Docker Swarm rodam como root UID 0 mas pode variar
 Veja o usuário rodando dentro do container
bash
docker exec it container_id id
2 Cheque permissões do diretório no host
 Exemplo
bash
ls l mediadatallvmollama
3 Corrija permissões para root ou usuário do container
 Se o container roda como root
bash
sudo chown R 00 mediadatallvmollama
sudo chmod R 770 mediadatallvmollama
 Se roda como outro UIDGID ajuste conforme necessário
4 Reinicie o serviço após ajuste
bash
docker service update force ollama_ollama
5 Verifique logs do Ollama
 Procure por mensagens de erro de permissão
bash
docker service logs ollama_ollama tail50
Resumo
Permissão errada  serviço não consegue gravarler modelos  falha silenciosa ou erro 500timeouts
Se quiser envie a saída do ls l do volume e do id dentro do container que eu te passo o comando exato para corrigir
Vamos resolver  tech lead pythonzeira não larga o osso