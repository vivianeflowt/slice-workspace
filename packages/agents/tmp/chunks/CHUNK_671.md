shellscript
docker stack rm ollama
sleep 5
docker stack deploy c stacksollamastackyml ollama
User
 sliceprojectmanager gitfeaturealive  ping ollamalocalcloudio
PING ollamalocalcloudio 127001 5684 bytes of data
64 bytes from localhost 127001 icmp_seq1 ttl64 time0033 ms
64 bytes from localhost 127001 icmp_seq2 ttl64 time0033 ms
64 bytes from localhost 127001 icmp_seq3 ttl64 time0020 ms
64 bytes from localhost 127001 icmp_seq4 ttl64 time0022 ms
64 bytes from localhost 127001 icmp_seq5 ttl64 time0022 ms
64 bytes from localhost 127001 icmp_seq6 ttl64 time0047 ms
64 bytes from localhost 127001 icmp_seq7 ttl64 time0021 ms
 ollamalocalcloudio ping statistics 
7 packets transmitted 7 received 0 packet loss time 6161ms
rtt minavgmaxmdev  0020002800470009 ms
 sliceprojectmanager gitfeaturealive  ping 12700111434
ping 12700111434 Nome ou serviço desconhecido
 sliceprojectmanager gitfeaturealive 
fwdisearch _
Cursor
Ótima análise Aqui está o que está acontecendo
 1 DNS está resolvendo para localhost
 ollamalocalcloudio está apontando para 127001 localhost
 O ping funciona mas isso não garante que o serviço Ollama está ouvindo na porta 11434 do localhost
 2 Erro ao tentar pingar com porta
 O comando ping 12700111434 não funciona porque o ping só testa ICMP camada de rede não portas TCP
 Para testar se a porta está aberta use telnet nc netcat ou curl
 Como testar se o Ollama está ouvindo na porta 11434
 Com curl
bash
curl http12700111434
bash
curl httpollamalocalcloudio11434
 Com netcat
bash
nc vz 127001 11434
bash
nc vz ollamalocalcloudio 11434