Vou começar pelo DeepSeekProvider e seguir para os demais sempre informando o que foi alterado em cada etapa
User
Cursor
typescript
import axios from axios
import dotenv from dotenv
import  z  from zod
import  GenerateOptionsSchema  from baseAbstractAIProvider
import  AbstractAIProvider  from baseAbstractAIProvider
import  DEEPSEEK_MODELS  from DeepSeekModels
import  getMaxResponseTokens  from utilstokens
import  DEEPSEEK_API_KEY  from constantsconstants
dotenvconfig
 Ajuste Corrige tipagem do enum de modelos e adiciona campos opcionais context systemPrompt description
const DeepseekProviderOptionsSchema  GenerateOptionsSchemaomit
model true
extend
model zenumDEEPSEEK_MODELS as unknown as string stringdescribeModelo DeepSeek a ser utilizado
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário
systemPrompt zstringoptionaldescribePrompt de sistema para contextopersonainstruções globais
description zstringoptionaldescribeDescrição livre do request útil para rastreabilidade ou experimentos
export type DeepseekProviderOptions  zinfertypeof DeepseekProviderOptionsSchema
export class DeepseekProvider extends AbstractAIProviderDeepseekProviderOptions 
private readonly NAME string
constructorname string 
super
thisNAME  name