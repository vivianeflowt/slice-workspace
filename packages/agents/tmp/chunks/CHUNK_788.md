 Entendido Não haverá versionamento de API neste momento
 Os endpoints seguirão o padrão OpenAI ex chatcompletions models mas sem prefixo de versão v1
 O payload das requisições deve obrigatoriamente conter os campos model e provider
 Ajustarei as rotas e validações para refletir esses requisitos mantendo a estrutura RESTful e compatível com o padrão OpenAI mas sem versionamento na URL
Vou padronizar os endpoints e garantir que model e provider sejam obrigatórios no payload
User
perfeito pode aplicar se achar algo que possa melhorar na logica tb aplique deixando mais robusto
Cursor
typescript
import  Router  from express
import  AskController  from controller
import  asyncHandler  from utilsasynchandler
const askController  new AskController
const askRouter  Router
 Padrão OpenAI POST chatcompletions
askRouterpostchatcompletions asyncHandleraskControlleraskbindaskController
export default askRouter