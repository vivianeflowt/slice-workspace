plaintext
 Conceito do diretório routes
 Este diretório é responsável por conectar as features funcionalidades à aplicação principal expondo endpoints middlewares e regras de roteamento
 Atua como um circuit breaker e ponto central de integração isolando falhas e desacoplando a lógica de negócio da interface HTTPAPI
 Boas práticas
  Cada rota deve ser simples clara e delegar a lógica para as features correspondentes
  Evite lógica de negócio diretamente nas rotas
  Utilize middlewares para autenticação logging e tratamento de erros
  Documente endpoints e fluxos relevantes
User
cursorrulesagora nesses dois você pode colocar o conceito dessas aí que só é os slices em cima de provém as funcionalidades da agora nesses dois você pode colocar o conceito dessas aí que só é os slices em cima de provém as funcionalidades da de cada um entendeu explicando que você tem um controle de uma rota Mas aonde que você define o restante do http da aperreice é no root por quê Porque eu posso levar esse essa fita ir para outro serviço parecido com esse criar um micro serviço separado entendeu cursorrules
Cursor
plaintext
 Conceito do diretório featurechat
 Este diretório representa um slice de funcionalidade responsável por toda a lógica de chat de forma isolada e reutilizável
 Não define o roteamento HTTP completo apenas os handlers controladores e regras de negócio do chat
 O roteamento e integração HTTP são definidos no diretório routes permitindo desacoplar e até migrar esta feature para outro serviçomicroserviço se necessário
 Boas práticas
  Mantenha a lógica de negócio isolada
  Evite dependências diretas de infraestrutura
  Escreva testes para cada handler e controller
plaintext
 Conceito do diretório featuremodel
 Este diretório representa um slice de funcionalidade responsável por toda a lógica relacionada a modelos de IA de forma isolada e reutilizável
 Não define o roteamento HTTP completo apenas os handlers controladores e regras de negócio dos modelos
 O roteamento e integração HTTP são definidos no diretório routes permitindo desacoplar e até migrar esta feature para outro serviçomicroserviço se necessário
 Boas práticas
  Mantenha a lógica de negócio isolada
  Evite dependências diretas de infraestrutura
  Escreva testes para cada handler e controller
plaintext
 Conceito do diretório featurechat
 Este diretório representa um slice de funcionalidade responsável por toda a lógica de chat de forma isolada e reutilizável
 Não define o roteamento HTTP completo apenas os handlers controladores e regras de negócio do chat
 O roteamento e integração HTTP são definidos no diretório routes permitindo desacoplar e até migrar esta feature para outro serviçomicroserviço se necessário
 Pode haver algum acoplamento com providers e outras classes do ecossistema mas levando essas dependências junto a feature deve funcionar em qualquer serviço do ecossistema Slice pois todos seguem a mesma estrutura base
 Boas práticas
  Mantenha a lógica de negócio isolada
  Evite dependências diretas de infraestrutura externa ao ecossistema
  Escreva testes para cada handler e controller