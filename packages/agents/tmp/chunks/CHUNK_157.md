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
Isso garante código mais limpo legível e padronizado aproveitando as libs já adotadas no projeto
Se quiser posso ajustar para usar lodashfp no shuffle
javascript
import  shuffle  from lodashfp
const toInstall  shuffle
OLLAMA_MODELSfilter
origName  installedNamesincludesOllamaManagernormalizeorigName
User
vc pensa que tenha um jeto simples de ele preferie baixar primeiro os models menores