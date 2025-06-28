Cursor
plaintext
 Conceito do diretório utils
 Este diretório deve conter apenas funções puras utilitárias e de uso geral sem dependências de contexto de negócio ou efeitos colaterais
 As funções aqui implementadas devem ser robustas testadas e altamente reutilizáveis em diferentes partes do projeto
 Boas práticas
  Priorize funções puras sem efeitos colaterais
  Escreva testes automatizados para cada utilitário
  Documente claramente a intenção e uso de cada função
  Evite dependências desnecessárias
  Mantenha o código simples legível e padronizado
User
cursorrulesaqui eu quero que você explique que aonde a gente faz a ligação entre as features e os aqui eu quero que você explique que aonde a gente faz a ligação entre as features e os e a aplicação em si é como se fosse um circuit Breaker dá uma analisada como eles nos arquivos para você ter ideia de como documentar direitinho
Cursor
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