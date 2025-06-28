 Resolve provider e modelo a partir dos parâmetros agora assíncrono
async function resolveProviderAndModel provider model   provider string model string  
const modelDictionary  ModelDictionarygetInstance
if provider  ollama  model 
return 
resolvedProvider providertoLowerCase
resolvedModel model
modelMetadata  model 
if model 
const modelMetadata  await modelDictionaryfindByModelmodel
if modelMetadata throw new ErrorModelo não encontrado no dicionário
return 
resolvedProvider provider  modelMetadataprovidertoLowerCase
resolvedModel modelMetadatamodel
modelMetadata
if provider 
const providerModels  await modelDictionaryfindByProviderprovider
if providerModelslength
throw new ErrorNenhum modelo encontrado para o provider informado
return 
resolvedProvider providertoLowerCase
resolvedModel providerModels0model
modelMetadata providerModels0
throw new ErrorÉ necessário informar ao menos o model ou o provider
 Instancia o provider solicitado
function instantiateProviderproviderName string 
const ProviderClass  IAProviderRegistryproviderName
if ProviderClass
throw new ErrorProvider providerName não suportado ou não encontrado
return new ProviderClass
 Monta payload para provider
function buildProviderPayloadpromptParams any modelName string systemPrompt string 
return  promptParams model modelName systemPrompt   systemPrompt  
 Inicializa Ollama se necessário
function initializeOllamaIfNeededproviderName string modelMetadata any 
if providerName  ollama  modelMetadataurlincludesollama
OllamaManagergetInstance
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