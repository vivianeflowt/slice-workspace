consolelog Encontrados os seguintes pacotes
packagesforEachname  consolelog  name
consolelognIniciando formatação com Prettiern
packagesforEachname  
const pkgPath  joinPACKAGES_DIR name
formatPackagepkgPath name
consolelogn Formatação concluída
main
 Corrigido Agora o scriptsformatjs executa diretamente npx prettier write  em cada pacote sem chamar o formatsh e sem risco de loop recursivo
Pode rodar normalmente pelo formatsh ou diretamente pelo script  a formatação será aplicada corretamente em todos os pacotes
User
packages em cada pacote coloque uma configuracao de prettierrc
Cursor