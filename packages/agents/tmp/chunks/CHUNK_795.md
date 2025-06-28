tokensts nos temos uma classe feita por mim que justa max tokens automatico
Cursor
 Confirmado O arquivo utilstokensts já possui uma funçãoclass robusta feita por você para calcular automaticamente o número ideal de maxTokens considerando prompt contexto e limites do modelo
Vantagens do seu utilitário
 Estima maxTokens de forma inteligente evitando estouro de contexto
 Considera prompt systemPromptcontext e limites do modelo
 Garante que a resposta nunca será menor que o mínimo seguro
 Facilita integração com qualquer provider padronizando o comportamento
Ação
Vou garantir que todos os providers usem essa função getMaxResponseTokens como padrão ao construir requests para os modelos exceto se o usuário sobrescrever explicitamente
Assim todo o fluxo de IA fica mais seguro eficiente e padronizado
User
mas permite enviar tb o parametro
Cursor
 Perfeito
Todos os providers devem