User
você tem que lembrar que aí é antigamente era Ask né agora é chat você tem que trocar o nome das funções também para fazer nesse sentido e das classes dos métodos
Use este behavior para dar instruções diretas correções ou pedidos de ajuste
Cursor
typescript
import  Request Response NextFunction  from express
import  ModelDictionary  from libmodelsModelDictionary
import  OllamaManager  from providersaiollamaOllamaManager
import  HTTP_STATUS_BAD_REQUEST  from utilshttpstatus
import  OpenaiProvider  from providersaiopenaiOpenAIProvider
import  DeepseekProvider  from providersaideepseekDeepSeekProvider
import  OllammaProvider  from providersaiollamaOllammaProvider
import  PerplexityProvider  from providersaiperplexityPerplexityProvider
import  SpeechProvider  from providersaispeechSpeechProvider
 Registry centralizado de providers
const IAProviderRegistry Recordstring any  
openai OpenaiProvider
deepseek DeepseekProvider
ollama OllammaProvider
perplexity PerplexityProvider
speech SpeechProvider
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