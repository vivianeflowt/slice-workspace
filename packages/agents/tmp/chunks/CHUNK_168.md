typescript
 OllamaManager Responsável por sincronizar instalar e remover modelos do Ollama conforme a lista principal OLLAMA_MODELS
  Prioriza modelos menores na instalação ver OLLAMA_MODEL_SIZES
  Mantém o ambiente limpo removendo modelos não desejados
  Evita poluição de logs só loga iníciofim de download e remoção
  Robusta e tolerante a falhas nunca quebra o servidor sempre tenta continuar
import axios  AxiosInstance  from axios
import  OLLAMA_MODELS OllamaModel OLLAMA_MODEL_SIZES  from OllamaModels
import logger from libloggerlogger
import  OLLAMA_BASE_URL  from constantsconstants
import  flow map filter includes difference uniq toLower trim  from lodashfp
import ms from ms
const DELAY_SYNC_MODELS  ms5s
const RETRY_DELAY  ms3s
const RETRY_TIMEOUT  ms2m
async function retryUntilSuccessTfn   PromiseT label string PromiseT  undefined 
const start  Datenow
let lastError any  null
while Datenow  start  RETRY_TIMEOUT 
try 
return await fn
 catch err 
lastError  err
await new Promiser  setTimeoutr RETRY_DELAY
loggererrorOllamaERROR Timeout ao tentar label após RETRY_TIMEOUT  1000s Último erro lastError instanceof Error  lastErrormessage  StringlastError
return undefined
export class OllamaManager 
private static instance OllamaManager
private isDownloading  false
private httpClient AxiosInstance
private constructor 
thishttpClient  axioscreate
baseURL OLLAMA_BASE_URL
timeout ms10s
 Remove modelos instalados que não estão na lista desejada 
async syncRemovals Promisevoid 
try 
const installedNames  await thissafeListModels
if installedNames return
const desiredNames  OLLAMA_MODELSmapOllamaManagernormalize
const toRemove  differenceinstalledNames desiredNames
for const name of toRemove 
try 
await thisdeleteModelname
loggerinfoOllama Modelo removido name
 catch err 
loggerwarnOllama Falha ao remover name err instanceof Error  errmessage  Stringerr
 catch err 
loggererrorOllamaERROR Falha geral na remoção de modelos err instanceof Error  errmessage  Stringerr
 Instala modelos ausentes da lista desejada priorizando menores 
async syncInstalls Promisevoid 
try 
const installedNames  await thissafeListModels
if installedNames return
const toInstall  OLLAMA_MODELS
filterorigName  installedNamesincludesOllamaManagernormalizeorigName
sorta b  OLLAMA_MODEL_SIZESa  Infinity  OLLAMA_MODEL_SIZESb  Infinity
for const name of toInstall 
try 
loggerinfoOllama Iniciando download do modelo name
await thispullModelname
loggerinfoOllama Download concluído do modelo name
 catch err 
loggerwarnOllama Falha ao instalar name err instanceof Error  errmessage  Stringerr
 Continua para o próximo modelo
 catch err 
loggererrorOllamaERROR Falha geral na instalação de modelos err instanceof Error  errmessage  Stringerr
 Sincroniza modelos sempre remove antes de instalar nunca quebra o servidor 
async syncModels Promisevoid 
setTimeoutasync   
try 
const ok  await retryUntilSuccess  thissafeListModels listar modelos
if ok 
loggererrorOllamaERROR Não foi possível listar modelos abortando sync
return
await thissyncRemovals
await thissyncInstalls
 catch err 
loggererrorOllamaERROR Falha geral na sincronização de modelos err instanceof Error  errmessage  Stringerr
 DELAY_SYNC_MODELS
 Lista modelos instalados válidos nunca lança erro 
async safeListModels Promisestring  undefined 
try 
return await thislistModels
 catch err 
loggererrorOllamaERROR Falha ao listar modelos err instanceof Error  errmessage  Stringerr
return undefined