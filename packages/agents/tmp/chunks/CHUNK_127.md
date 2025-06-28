Cursor
 Informação registrada
O roteador TPLink Omada mostrado na imagem é responsável por isolar a rede do ecossistema Slice da rede residencial garantindo uma camada extra de segurança e segmentação Isso reforça a decisão de não exigir autenticação interna para a maioria dos serviços já que o acesso externo é bloqueado e a rede é gerenciada de forma centralizada e segura
Resumo anotado no PROJECTmd
 O roteador TPLink Omada implementa isolamento físico e lógico da rede Slice permitindo operar serviços internos sem autenticação com segurança garantida pela infraestrutura de rede dedicada
User
pro mundo externo somos um dispositivo na rede residencial e o firewall fecha qualquer acesso externo podemos acessar pra fora mas ninguem consegue fora da nossa faixa de ip e pelo mac addess das 2 maquinas da nossa infra acessar
Cursor
 Informação registrada
 Para o mundo externo toda a infraestrutura Slice aparece como um único dispositivo na rede residencial com IP e MAC address específicos
 O firewall do roteador ER605 bloqueia qualquer acesso externo permitindo apenas conexões iniciadas de dentro para fora
 Apenas as máquinas da infraestrutura Slice identificadas por seus MAC addresses e faixa de IP interna têm permissão para acessar os serviços
 Não há exposição de portas ou serviços para fora da rede isolada
Resumo anotado no PROJECTmd
 A infraestrutura Slice é invisível para o mundo externo protegida por firewall e NAT do roteador Apenas dispositivos internos reconhecidos por IP e MAC address têm acesso aos serviços garantindo máxima segurança e isolamento