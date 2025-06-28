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
 Type guard para resposta da API
export const isOllamaModelList  models any models is  name string  
ArrayisArraymodels  modelseverym  typeof mname  string
User
tem algum problema