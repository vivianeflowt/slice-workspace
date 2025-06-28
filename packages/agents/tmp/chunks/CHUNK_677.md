Cursor
Para definir manualmente o DNS em um sistema Linux container Docker ou serviço você pode
 1 No Linux host
Edite ou crie o arquivo etcresolvconf
bash
sudo nano etcresolvconf
Adicione por exemplo
nameserver 8888
nameserver 1111
 Atenção Em algumas distros modernas o NetworkManager ou systemdresolved pode sobrescrever esse arquivo
 Para garantir persistência configure via NetworkManager ou systemd
 2 No Docker ComposeStack serviçocontainer
Adicione a opção dns no serviço
yaml
services
seu_servico
image 
 8888
 1111
No Swarm stack
yaml
services
seu_servico
 8888
 1111
 3 No Docker CLI container avulso
bash
docker run dns8888 dns1111 
 4 Para containers já rodando testar dentro
Entre no container e edite etcresolvconf
bash
docker exec it container bash
echo nameserver 8888  etcresolvconf
Resumo
 Para o host etcresolvconf ou via NetworkManager
 Para Docker dns no composestack ou flag dns
 Para containers já rodando edite etcresolvconf dentro do container
Se quiser um exemplo para seu stack específico só avisar
shellscript
sudo nano etcresolvconf