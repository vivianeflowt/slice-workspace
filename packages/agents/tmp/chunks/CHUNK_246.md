User
Cursor
javascript
usrbinenv node
const  execSync   requirechild_process
const  readdirSync statSync   requirefs
const  join   requirepath
const PACKAGES_DIR  join__dirname packages
function isDirectorypath 
try 
return statSyncpathisDirectory
 catch 
return false
function formatPackagepkgPath pkgName 
processstdoutwrite Formatando pacote pkgName 
try 
execSyncnpx prettier write   cwd pkgPath stdio ignore 
consolelog Sucesso
 catch err 
consolelog Erro
consoleerror  Falha ao formatar pkgName errmessage
function main 
let packages
try 
packages  readdirSyncPACKAGES_DIRfiltername 
isDirectoryjoinPACKAGES_DIR name
 catch err 
consoleerror Não foi possível ler o diretório de pacotes errmessage
processexit1
if packageslength 
consolelogNenhum pacote encontrado em packages
return