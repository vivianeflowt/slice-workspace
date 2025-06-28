Ação
Vou garantir que todos os providers usem essa função getMaxResponseTokens como padrão ao construir requests para os modelos exceto se o usuário sobrescrever explicitamente
Assim todo o fluxo de IA fica mais seguro eficiente e padronizado
User
mas permite enviar tb o parametro
Cursor
 Perfeito
Todos os providers devem
 Calcular automaticamente o maxTokens usando o utilitário getMaxResponseTokens quando o parâmetro não for informado
 Permitir que o usuário sobrescreva o valor de maxTokens explicitamente no payload caso deseje
Resumo do comportamento
 Se maxTokens vier no payload usa o valor informado
 Se não vier calcula automaticamente com base no promptcontextolimites do modelo
Esse padrão garante flexibilidade para o usuário avançado e segurançarobustez para o uso padrão
Vou manter e reforçar esse comportamento em todos os providers
User