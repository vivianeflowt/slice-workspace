 Documentação do uso e da lista de MCP servers disponível no cursorrules
Agora todas as IAs e agentes saberão exatamente quais recursos MCP estão prontos para uso como consultar e a importância de testar antes de produção Tudo registrado e padronizado
User
formatjs queria um script pra percorrer os packages e aplicar formaracao do prettierformatsh e chamar o script aqui tente usar no script apenas libs nativas dando um feedback legal e a prova de erros
Cursor
javascript
usrbinenv node
const  execSync   requirechild_process
const  readdirSync statSync   requirefs
const  join   requirepath
const PACKAGES_DIR  join__dirname packages
const FORMAT_SCRIPT  join__dirname formatsh
function isDirectorypath 
try 
return statSyncpathisDirectory
 catch 
return false
function formatPackagepkgPath pkgName 
processstdoutwrite Formatando pacote pkgName 
try 
execSyncbash FORMAT_SCRIPT  cwd pkgPath stdio ignore 
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