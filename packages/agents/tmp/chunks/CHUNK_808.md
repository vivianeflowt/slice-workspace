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
public async generateoptions PerplexityOptions Promisestring 
const parsedOptions  PerplexityOptionsSchemaparseoptions
const  model prompt systemPrompt context temperature maxTokens topP   parsedOptions
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
const response  await axiosposthttpsapiperplexityaichatcompletions data 
headers 
Authorization Bearer PERPLEXITY_API_KEY
ContentType applicationjson
const result  responsedatachoices0messagecontent
if result 
throw new ErrorNão foi possível obter uma resposta do modelo Perplexity
return result
 catch error unknown 
if error instanceof Error 
consoleerrorErro ao gerar conteúdo com Perplexity error
throw error
consoleerrorErro ao gerar conteúdo com Perplexity Stringerror
throw error
User
ja vem por heranca nao esquece disso