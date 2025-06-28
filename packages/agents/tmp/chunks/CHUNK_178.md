 Exatamente Conhecer em detalhes os schemas parâmetros opcionais como context systemPrompt description e as particularidades de cada provider permite
 Refatorar o slice chat para aceitar e repassar todos os campos opcionais de forma padronizada e flexível
 Garantir que o slice models exponha metadados completos facilitando a escolha e documentação dos modelos
 Unificar validação documentação e rastreabilidade dos requests tornando o backend mais robusto e fácil de evoluir
 Permitir logging e experimentação mais rica já que descriptioncontext podem ser usados para análise posterior
Com os providers padronizados a refatoração dos controllersrouters fica mais simples clara e escalável
Vou aplicar e manter esse padrão em toda a stack
User
ai deixe todos os schemas organizados
Cursor
 Para padronizar e organizar todos os schemas dos providers de IA o ideal é
 Todos os schemas devem conter
 prompt string obrigatório
 model enum dos modelos suportados obrigatório
 provider string obrigatório se aplicável
 systemPrompt string opcional
 context string opcional
 description string opcional para rastreabilidadeexplicação
 temperature number opcional
 maxTokens number opcional
 topP number opcional
 Outros campos específicos do provider se necessário
 Todos os campos opcionais devem ser documentados com describe para facilitar integração e uso
 O schema base pode ser centralizado ex em AbstractAIProvider e estendido por cada provider garantindo consistência