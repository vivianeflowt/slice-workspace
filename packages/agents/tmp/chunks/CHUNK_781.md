User
OllamaManagerts deixe bem documentado com comentarios pra facilizar outras IA entender a responsabilidade e partes do codigo da classe tb
OllamaManagerts não precisa de mts loga apenas qd for fazer download e terminar e na remoçao deixe menos poluido os logs
Cursor
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