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
public get name 
return thisNAME
public async generateoptions DeepseekProviderOptions Promisestring 
const parsedOptions  DeepseekProviderOptionsSchemaparseoptions
const  model prompt systemPrompt context temperature maxTokens topP   parsedOptions
 Ajuste monta o system prompt na ordem correta systemPromptbehavior primeiro context depois
const SYSTEM_PROMPT  systemPrompt  thisgetSystemPrompt contextfilterBooleanjoinn
const MAX_TOKENS  maxTokens  getMaxResponseTokensprompt SYSTEM_PROMPT
const data  
model
messages 
 role system content SYSTEM_PROMPT 
 role user content prompt 
temperature
max_tokens MAX_TOKENS
topP
try 
const response  await axiosposthttpsapideepseekcomv1chatcompletions data 
headers 
Authorization Bearer DEEPSEEK_API_KEY
ContentType applicationjson
const result  responsedatachoices0messagecontent
if result 
throw new ErrorNão foi possível obter uma resposta do modelo DeepSeek
return result
 catch error unknown 
if error instanceof Error 
consoleerrorErro ao gerar conteúdo com DeepSeek error
throw error
consoleerrorErro ao gerar conteúdo com DeepSeek Stringerror
throw error
User