foque agora no perplexity
Cursor
typescript
import dotenv from dotenv
import  z  from zod
import axios from axios
import  AbstractAIProvider GenerateOptionsSchema  from baseAbstractAIProvider
import  getMaxResponseTokens  from utilstokens
import  PERPLEXITY_MODELS  from PerplactyModels
import  PERPLEXITY_API_KEY  from constantsconstants
dotenvconfig
const PerplexityOptionsSchema  GenerateOptionsSchemaomit
model true
extend
model zenumPERPLEXITY_MODELS as unknown as string stringdescribeModelo Perplexity a ser utilizado
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário
systemPrompt zstringoptionaldescribePrompt de sistema para contextopersonainstruções globais
description zstringoptionaldescribeDescrição livre do request útil para rastreabilidade ou experimentos
export type PerplexityOptions  zinfertypeof PerplexityOptionsSchema
 Provider para Perplexity AI usando API Key e endpoint oficial
 Modelos disponíveis sonarsmallchat sonarmediumchat sonarlargechat sonarprochat
 Veja httpsdocsperplexityaiapireferencechatcompletions
export class PerplexityProvider extends AbstractAIProviderPerplexityOptions 
private readonly NAME string
constructorname string 
super
thisNAME  name
public get name 
return thisNAME