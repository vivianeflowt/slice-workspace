plaintext
nameserver 8888
nameserver 1111
yaml
services
seu_servico
image 
 8888
 1111
yaml
services
seu_servico
 8888
 1111
shellscript
docker run dns8888 dns1111 
shellscript
docker exec it container bash
echo nameserver 8888  etcresolvconf
User
parece tudo ta certo com dns
Cursor
Ótimo Se tudo está certo com o DNS resolução de nomes funcionando containers e host resolvendo domínios corretamente você já eliminou uma das causas mais comuns de falha de comunicação entre serviços timeouts e problemas de proxy
 Checklist rápido para garantir que DNS está realmente OK