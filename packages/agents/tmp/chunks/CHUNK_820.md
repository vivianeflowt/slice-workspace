const askController  new AskController
const askRouter  Router
askRouterpostchatcompletions asyncHandleraskControlleraskbindaskController
export default askRouter
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