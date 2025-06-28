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
User
Como de senior que vc é deixe essa classe mais robista e mais tolerante a falar sem quebrar o servidor
Cursor