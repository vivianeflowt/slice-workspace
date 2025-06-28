typescript
 OllamaManager Responsável por sincronizar instalar e remover modelos do Ollama conforme a lista principal OLLAMA_MODELS
  Prioriza modelos menores na instalação ver OLLAMA_MODEL_SIZES
  Mantém o ambiente limpo removendo modelos não desejados
  Evita poluição de logs só loga iníciofim de download e remoção
import axios  AxiosInstance  from axios
import  OLLAMA_MODELS OllamaModel OLLAMA_MODEL_SIZES  from OllamaModels
import logger from libloggerlogger
import  OLLAMA_BASE_URL  from constantsconstants
import  flow map filter includes difference uniq toLower trim shuffle  from lodashfp
import ms from ms
const DELAY_SYNC_MODELS  ms5s
const RETRY_DELAY  ms3s
const RETRY_TIMEOUT  ms2m
async function retryUntilSuccessTfn   PromiseT label string PromiseT 
const start  Datenow
let lastError any  null
while Datenow  start  RETRY_TIMEOUT 
try 
return await fn
 catch err 
lastError  err
await new Promiser  setTimeoutr RETRY_DELAY
throw lastError
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
const installedNames  await thislistModels
const desiredNames  OLLAMA_MODELSmapOllamaManagernormalize
const toRemove  differenceinstalledNames desiredNames
for const name of toRemove 
try 
await thisdeleteModelname
loggerinfoOllama Modelo removido name
 catch err 
 Log apenas se falhar
loggerwarn
Ollama Falha ao remover name err instanceof Error  errmessage  Stringerr
 Instala modelos ausentes da lista desejada priorizando menores 
async syncInstalls Promisevoid 
const installedNames  await thislistModels
 Ordena por tamanho menor primeiro depois embaralha os de mesmo tamanho
const toInstall  OLLAMA_MODELS
filterorigName  installedNamesincludesOllamaManagernormalizeorigName
sorta b  OLLAMA_MODEL_SIZESa  Infinity  OLLAMA_MODEL_SIZESb  Infinity
for const name of toInstall 
try 
loggerinfoOllama Iniciando download do modelo name
await thispullModelname
loggerinfoOllama Download concluído do modelo name
 catch err 
loggerwarn
Ollama Falha ao instalar name err instanceof Error  errmessage  Stringerr
 Sincroniza modelos sempre remove antes de instalar 
async syncModels Promisevoid 
setTimeoutasync   
await retryUntilSuccess  thislistModels listar modelos
await thissyncRemovals
await thissyncInstalls
 DELAY_SYNC_MODELS
 Lista modelos instalados válidos 
async listModels Promisestring 
try 
const response  await thishttpClientgetapitags
const tags  responsedatamodels  responsedatatags  
const installedNames  flow
mapmodel any  OllamaManagernormalizemodelname
uniq
filterOllamaManagerisValidModel
tags
return installedNames
 catch err 
throw err