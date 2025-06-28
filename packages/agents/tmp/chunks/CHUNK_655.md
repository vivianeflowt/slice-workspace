Ótima sacada
Se o Traefik proxy reverso estava configurado para expor o Ollama para fora mas agora está redirecionando ou bloqueando para localhost isso pode explicar
 Por que os downloads de modelos grandes dão timeouterro 500 proxy corta a conexão ou não encaminha corretamente
 Por que o GET apitags funciona requisições pequenas rápidas sem streaming
 Por que só POSTs grandes downloads falham
User
isso mesmo ia pythonzeira trafiek resolveu funcionar
Cursor
Perfeito agora ficou claro o cenário
Resumo do que aconteceu
 O Traefik proxy reverso estava com alguma configuração que redirecionava ou bloqueava o acesso externo ao Ollama deixando ele acessível só via localhost
 Por isso requisições internas rápidas GET apitags funcionavam mas downloads grandes POST apipull davam timeouterro 500  o Traefik não encaminhava corretamente ou cortava a conexão
 Como resolver e garantir funcionamento
1 Ajuste as regras do Traefik
 Certifiquese de que o serviço do Ollama está exposto na rede correta não só localhost
 No dockercomposeyml ou stacksyml confira as labels do Traefik
yaml
labels
 traefikenabletrue
 traefikhttproutersollamaruleHostollamasuaempresalocal
 traefikhttpservicesollamaloadbalancerserverport11434  ou a porta real do Ollama
 Garanta que o Traefik está ouvindo na porta pública e encaminhando para o container do Ollama
2 Teste acesso externo
 Tente acessar o endpoint do Ollama de fora do host ou de outro container na mesma rede
 Teste baixar um modelo via API ou interface