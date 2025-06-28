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
async listModels Promisestring 
const response  await thishttpClientgetapitags
const tags  responsedatamodels  responsedatatags  
const installedNames  flow
mapmodel any  OllamaManagernormalizemodelname
uniq
filterOllamaManagerisValidModel
tags
return installedNames
async deleteModelname string Promisevoid 
try 
await thishttpClientdeleteapidelete  data  name  
 catch err 
throw new ErrorFalha ao deletar modelo name err instanceof Error  errmessage  Stringerr
async pullModelname string Promisevoid 
if thisisDownloading 
loggerwarnJá existe um download de modelo em andamento Pulando este modelo
return
thisisDownloading  true
try 
await thishttpClientpostapipull  name 
 catch err 
throw new ErrorFalha ao puxar modelo name err instanceof Error  errmessage  Stringerr
 finally 
thisisDownloading  false
private static normalizename string  undefined  null string 
return typeof name  string  toLowertrimname  
private static isValidModelname string name is OllamaModel 
return OLLAMA_MODELSmapOllamaManagernormalizeincludesOllamaManagernormalizename
public static getInstance OllamaManager 
if OllamaManagerinstance 
OllamaManagerinstance  new OllamaManager
return OllamaManagerinstance