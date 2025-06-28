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
async deleteModelname string Promisevoid 
try 
await thishttpClientdeleteapidelete  data  name  
 catch err 
throw new Error
Falha ao deletar modelo name err instanceof Error  errmessage  Stringerr
async pullModelname string Promisevoid 
if thisisDownloading 
throw new ErrorJá existe um download de modelo em andamento Aguarde finalizar
thisisDownloading  true
try 
await thishttpClientpostapipull  name 
 catch err 
throw new Error
Falha ao puxar modelo name err instanceof Error  errmessage  Stringerr
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
 Type guard para resposta da API
export const isOllamaModelList  models any models is  name string  
ArrayisArraymodels  modelseverym  typeof mname  string