GIN 20250604  045832  200  822652s  10002  GET apitags
time20250604T045833642Z levelINFO sourcedownloadgo177 msgdownloading 1cecc26325a1 in 16 256 MB parts
Cursor
Ótimo log Ele traz informações valiosas para o diagnóstico
 O Ollama está rodando com o diretório de modelos em rootollamamodels dentro do container
 O serviço está ouvindo em 000011434
 GPU está sendo reconhecida corretamente
 GET apitags funciona requisições rápidas
 POST apipull para baixar partes grandes de modelos falha com erro 500 após 10 segundos
 Diagnóstico e próximos passos
 1 Permissão do volume no host
Se você está montando mediadataollama no host para rootollama no container o diretório mediadataollama precisa ser gravável pelo usuário root ou pelo usuário que o container roda
No host rode
bash
sudo chown R 00 mediadataollama
sudo chmod R 770 mediadataollama
 00 é rootroot Se o container roda como outro usuário ajuste o UIDGID
 2 Espaço em disco
Já foi limpo mas sempre bom checar
bash
df h mediadata
 3 RedeProxy
 O Ollama está ouvindo em todas as interfaces mas se o Traefik ou firewall estiver bloqueando pode dar timeout
 Teste baixar um arquivo grande de dentro do container
bash
docker exec it container_ollama bash
curl O httpsollamacommodelosalgummodelogrande
 Se falhar pode ser rede proxy ou DNS