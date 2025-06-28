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
AbstractAIProviderts deveria vir por herenca do zod a maioria nao acha so precisando ajusta o model
Cursor
 Concordo O ideal é que todos os providers herdem o schema base GenerateOptionsSchema do AbstractAIProviderts via Zod estendendo apenas o campo model com o enum específico de cada provider e adicionando campos extras só se necessário
Vantagens
 Consistência total entre todos os providers
 Menos duplicação de código
 Facilidade de manutenção e evolução dos parâmetros globais como context systemPrompt description temperature etc
 Garantia de que todos os providers aceitam os mesmos campos opcionais exceto o model