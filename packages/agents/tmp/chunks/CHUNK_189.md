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
Cursor
 Perfeito
A partir de agora todos os providers seguirão esse padrão
 Herdarão o schema base do AbstractAIProvider GenerateOptionsSchema via Zod
 Só vão customizar o campo model enum dos modelos suportados e adicionar campos extras se realmente necessário
 Isso garante máxima consistência manutenção fácil e evolução rápida do ecossistema
Pronto para aplicar esse padrão em todos os providers e manter a arquitetura limpa e robusta
User