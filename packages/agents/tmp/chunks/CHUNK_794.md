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