OllamaManagerts quero que ao obter a lista que vai fazer download ele faça um shuffle na lista
Pq posso reiniciar o server caso ele esteja fazendo download e um model mt pesado e assim deixe menos pesado o ambiente
Simples só randomizar a ondem da lista que deve instalar
Cursor
typescript
  existing code 
const toInstall  OLLAMA_MODELSfilter
origName  installedNamesincludesOllamaManagernormalizeorigName
 Shuffle na lista para randomizar a ordem dos downloads
for let i  toInstalllength  1 i  0 i 
const j  MathfloorMathrandom  i  1
toInstalli toInstallj  toInstallj toInstalli
for const name of toInstall 
try 
await thispullModelname
loggerinfoOllama Modelo presente ou instalado name
 catch err 
loggerwarn
Ollama Falha ao instalar name err instanceof Error  errmessage  Stringerr
  existing code 
User
poderia ter usado lodash ne
Cursor
 Sim poderia e seria até mais elegante usar lodash para fazer o shuffle da lista
import  shuffle  from lodashfp
const toInstall  shuffle
OLLAMA_MODELSfilter
origName  installedNamesincludesOllamaManagernormalizeorigName