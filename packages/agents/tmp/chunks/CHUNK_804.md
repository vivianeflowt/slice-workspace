AbstractAIProviderts deveria vir por herenca do zod a maioria nao acha so precisando ajusta o model
Cursor
 Concordo O ideal é que todos os providers herdem o schema base GenerateOptionsSchema do AbstractAIProviderts via Zod estendendo apenas o campo model com o enum específico de cada provider e adicionando campos extras só se necessário
Vantagens
 Consistência total entre todos os providers
 Menos duplicação de código
 Facilidade de manutenção e evolução dos parâmetros globais como context systemPrompt description temperature etc
 Garantia de que todos os providers aceitam os mesmos campos opcionais exceto o model
Como fazer
 No provider use
const ProviderOptionsSchema  GenerateOptionsSchemaomit model true extend
model zenumMODELS_ENUM as unknown as string stringdescribe
 outros campos específicos se necessário
 Exporte o tipo
export type ProviderOptions  zinfertypeof ProviderOptionsSchema
Resumo
Sim todos os providers devem herdar o schema base do AbstractAIProvider ajustando apenas o campo model
Esse padrão já está sendo aplicado nos ajustes recentes
typescript
const ProviderOptionsSchema  GenerateOptionsSchemaomit model true extend
model zenumMODELS_ENUM as unknown as string stringdescribe
 outros campos específicos se necessário
typescript
export type ProviderOptions  zinfertypeof ProviderOptionsSchema
User
isso mesmo pegou a ideia