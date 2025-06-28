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
consolelog Encontrados os seguintes pacotes
packagesforEachname  consolelog  name
consolelognIniciando formatação com Prettiern
packagesforEachname  
const pkgPath  joinPACKAGES_DIR name
formatPackagepkgPath name
consolelogn Formatação concluída
main
 Corrigido Agora o scriptsformatjs executa diretamente npx prettier write  em cada pacote sem chamar o formatsh e sem risco de loop recursivo