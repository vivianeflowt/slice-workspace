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
User
cursorrulesnessa rua específica aí você foi muito direto no aí pro Viber se devia dizer que aí é onde que ficam a base das classes abstratas em si o u aí provider abstrato é um deles mas essa essa esse base aí é para conter a interface Geral das outras partes do da aplicação para manter nessa rua específica aí você foi muito direto no aí pro Viber se devia dizer que aí é onde que ficam a base das classes abstratas em si o u aí provider abstrato é um deles mas essa essa esse base aí é para conter a interface Geral das outras partes do da aplicação para manter compatibilidade entendeu
Cursor