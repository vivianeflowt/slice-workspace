Diagnóstico rápido
O erro foi
open stacksdiscoverydockercomposeyml no such file or directory
 O que está acontecendo
 O comando make stacksup tentou rodar
docker stack deploy c stacksdiscoverydockercomposeyml discovery
 Mas o arquivo stacksdiscoverydockercomposeyml não existe ou não está no local esperado
 Como resolver
1 Verifique se o arquivo existe
bash
ls lh stacksdiscoverydockercomposeyml
 Se não existir procure onde está o compose do discovery pode estar em outro path ou com outro nome
2 Se o arquivo está em outro lugar
 Ajuste o Makefile para apontar para o caminho correto
 Exemplo se estiver em stacksdiscoverydockercomposeyaml com yaml ao invés de yml corrija no Makefile
3 Se o arquivo não existe mesmo
 Verifique se o stack discovery realmente deveria existir
 Se não for necessário remova a linha correspondente do Makefile temporariamente para subir os outros stacks
4 Dica de comando para buscar todos os dockercompose
bash
find stacks name dockercompose
 Resumo de ação
 O erro não é do discomontagem mas sim de caminho de arquivo no Makefile
 Corrija o path ou crie o arquivo necessário
 Depois rode novamente
bash
make stacksup
Se quiser envie a saída do ls stacksdiscovery ou do find stacks name dockercompose para eu te ajudar a ajustar o Makefile certinho
plaintext
open stacksdiscoverydockercomposeyml no such file or directory