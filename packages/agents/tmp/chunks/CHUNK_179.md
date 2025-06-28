Exemplo de schema base em AbstractAIProvider
export const GenerateOptionsSchema  zobject
prompt zstringdescribePrompt enviado pelo usuário para o modelo
model zstringdescribeIdentificador do modelo de IA a ser utilizado
provider zstringdescribeNome do provider de IAoptional
systemPrompt zstringoptionaldescribePrompt de sistema para contextopersonainstruções globais
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário
description zstringoptionaldescribeDescrição livre do request útil para rastreabilidade ou experimentos
temperature znumbermin0max10defaultDEFAULT_MODEL_TEMPERATUREdescribeTemperatura de amostragem
maxTokens znumberminDEFAULT_MODEL_MIN_TOKENSmaxDEFAULT_MODEL_MAX_TOKENSoptionaldescribeMáximo de tokens
topP znumberoptionaldescribeTopp sampling
Nos providers específicos
 Use extend model zenumMODELS_ENUM  para garantir o tipo correto de modelo
 Adicione campos extras apenas se realmente necessários para aquele provider
Benefícios
 Consistência total entre todos os providers
 Facilidade de manutenção e evolução
 Melhor DX para quem integra ou debuga
Se desejar posso aplicar e refatorar todos os schemas dos providers agora para seguir esse padrão
typescript
export const GenerateOptionsSchema  zobject
prompt zstringdescribePrompt enviado pelo usuário para o modelo
model zstringdescribeIdentificador do modelo de IA a ser utilizado
provider zstringdescribeNome do provider de IAoptional
systemPrompt zstringoptionaldescribePrompt de sistema para contextopersonainstruções globais
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário
description zstringoptionaldescribeDescrição livre do request útil para rastreabilidade ou experimentos
temperature znumbermin0max10defaultDEFAULT_MODEL_TEMPERATUREdescribeTemperatura de amostragem
maxTokens znumberminDEFAULT_MODEL_MIN_TOKENSmaxDEFAULT_MODEL_MAX_TOKENSoptionaldescribeMáximo de tokens
topP znumberoptionaldescribeTopp sampling
User
tokensts nos temos uma classe feita por mim que justa max tokens automatico
Cursor
 Confirmado O arquivo utilstokensts já possui uma funçãoclass robusta feita por você para calcular automaticamente o número ideal de maxTokens considerando prompt contexto e limites do modelo
Vantagens do seu utilitário
 Estima maxTokens de forma inteligente evitando estouro de contexto
 Considera prompt systemPromptcontext e limites do modelo
 Garante que a resposta nunca será menor que o mínimo seguro
 Facilita integração com qualquer provider padronizando o comportamento