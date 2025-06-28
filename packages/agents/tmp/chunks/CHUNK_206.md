 Logging de execução
function logExecutionTimelabel string startTime number 
consolelogChatController label duration Datenow  startTimems
 Validação básica dos parâmetros
function validateChatParamsbody any 
if body  typeof body  object throw new ErrorPayload inválido
if bodyprovider  bodymodel throw new ErrorInforme ao menos provider ou model
export class ChatController 
 Handler principal para chatcompletions
 Recebe prompt providermodel repassa para provider e retorna resposta
 Compatível com padrão OpenAI
async chatrequest Request response Response nextFunction NextFunction 
const startTime  Datenow
try 
validateChatParamsrequestbody
const  provider model system systemPrompt promptParams   requestbody
if provider  speech 
const speechResult  await new SpeechProvidergeneratepromptParams
logExecutionTimeSpeech request startTime
return responsejson result speechResult 
const  resolvedProvider resolvedModel modelMetadata   await resolveProviderAndModel
provider
model
initializeOllamaIfNeededresolvedProvider modelMetadata
const iaProviderInstance  instantiateProviderresolvedProvider
const iaPayload  buildProviderPayloadpromptParams resolvedModel systemPrompt
const iaResult  await iaProviderInstancegenerateiaPayload
logExecutionTimeRequest startTime
return responsejson result iaResult 
 catch error 
logExecutionTimeErro startTime
consoleerrorChatController Erro error
return response
statusHTTP_STATUS_BAD_REQUEST
json error error instanceof Error  errormessage  Stringerror 
User
routerts ajuste aqui tb eu ja removi o prefiro de chat que é adicionado em routes
Cursor
typescript
 Roteador para completions recebe um prompt e retorna resposta da IA
 Segue padrão OpenAI POST completions
import  Router  from express
import  ChatController  from controller
import  asyncHandler  from utilsasynchandler
const chatController  new ChatController
const chatRouter  Router