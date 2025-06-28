cursorrules começa de definindo todo conceito do provider na classe abstrata
Cursor
plaintext
 Conceito de Provider de IA
 Todo provider de IA deve
  Herdar de uma classe abstrata base ex BaseAIProvider que define a interface e contratos mínimos para integração
  Implementar métodos obrigatórios para execução de requests autenticação logging e tratamento de erros
  Definir schemas de entrada e saída usando Zod para validação forte de dados garantindo consistência e segurança
  Seguir padrões de importação organização e documentação definidos neste arquivo
 Use este template como referência para os cursorrules de cada provider específico
User
cursorrules cursorrules cursorrules cursorrules cursorrules ajuste dos com o mesmo conteudo fazendo mençao que extendem da classe abstrata e schema do zod tb vem por herenca
Cursor
plaintext
 Provider DeepSeek AI
 Este provider de IA estende a classe abstrata base ex BaseAIProvider herdando contratos mínimos métodos obrigatórios e validação de schemas via Zod
 Siga os padrões definidos em srcbasecursorrules para garantir consistência segurança e integração correta
 Use este espaço para observações ou regras específicas deste provider se necessário
plaintext
 Provider Ollama AI
 Este provider de IA estende a classe abstrata base ex BaseAIProvider herdando contratos mínimos métodos obrigatórios e validação de schemas via Zod
 Siga os padrões definidos em srcbasecursorrules para garantir consistência segurança e integração correta
 Use este espaço para observações ou regras específicas deste provider se necessário