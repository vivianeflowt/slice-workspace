User
cursorrules aqui você deveria dizer que as constantes ficam todas as constantes do sistema e as constantes devem ser agrupadas por por contexto e categoria delas e comentadas tem um comentário entre cada uma e o contexto delas
Cursor
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