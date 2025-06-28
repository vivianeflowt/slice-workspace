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
so precisa ajudar o describe delas
cursorrules pra cada um provider vc poderia adicionar um informacao util sobre isso
Cursor
plaintext
 DeepSeek AI Provider
 Este diretório contém a implementação do provedor de IA DeepSeek incluindo schemas integração de API e lógica de roteamento
 Use este espaço para regras de lint padrões de importação ou observações específicas deste provider