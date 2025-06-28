plaintext
 Conceito do diretório constants
 Este diretório deve concentrar todas as constantes do sistema agrupadas por contexto e categoria ex erros limites nomes de eventos etc
 Cada grupo de constantes deve ser precedido de um comentário explicando seu contexto e finalidade
 Boas práticas
  Não misture constantes de contextos diferentes no mesmo arquivo
  Comente claramente cada grupo de constantes
  Mantenha nomes descritivos e padronizados
plaintext
 Conceito do diretório lib
 Este diretório concentra classes módulos e utilitários centrais para o funcionamento interno do sistema
 Aqui ficam implementações que abstraem e centralizam lógica interna servindo de base e suporte para as features sem acoplamento direto com provedores externos
 Exemplos gerenciadores de sessão helpers de manipulação de dados factories caches internos etc
 Boas práticas
  Mantenha o código desacoplado de integrações externas
  Escreva testes para cada classe ou utilitário
  Documente a finalidade e uso de cada módulo
User
cursorrules aqui segue a mesma ideia da lib como ja expliquei mas tem relação com uso algo externo ao service por exemplo ai provider iterage com servidores externos database tb libs podem utilizar providers mas tem haver mais com regra de negocio
Cursor
plaintext
 Conceito do diretório providers
 Este diretório concentra integrações adaptadores e clientes para serviços externos ao sistema ex provedores de IA bancos de dados APIs de terceiros etc
 Providers podem ser utilizados por libs e features mas devem ser desacoplados da lógica de negócio principal focando apenas na comunicação e adaptação com o serviço externo
 Exemplos BaseAIProvider DatabaseProvider EmailProvider etc
 Boas práticas
  Mantenha a interface clara e estável
  Implemente tratamento de erros e fallback sempre que possível
  Documente dependências e fluxos de autenticação
User