pode configurar o projeto ja com o que precisa e valide a configuracao pra nao passar raiva no momento do trabalho
Cursor
typescript
 Configuração central do projeto ERD
export const BASE_URL  httplocalhost8000  URL do servidor principal ajuste conforme necessário
export const inputPath  EXEMPLOmd  Caminho do arquivo de entrada
export const outputPath  saidamd  Caminho do arquivo de saída
 Adicione outros parâmetros conforme necessidade
export const chunkSize  1000  Exemplo tamanho do chunk em caracteres
typescript
import  BASE_URL inputPath outputPath chunkSize  from config
import fs from fsextra
import path from path
function validateConfig 
let ok  true
if BASE_URL 
consoleerror BASE_URL não definida
ok  false
if fsexistsSyncinputPath 
consoleerror Arquivo de entrada não encontrado inputPath
ok  false
const outDir  pathdirnameoutputPath
if fsexistsSyncoutDir 
consoleerror Diretório de saída não existe outDir
ok  false
if typeof chunkSize  number  chunkSize  0 
consoleerror chunkSize inválido
ok  false
if ok 
consolelog Configuração validada com sucesso
consolelog BASE_URL inputPath outputPath chunkSize 
 else 
processexit1
function main 
validateConfig
 Aqui virá o fluxo principal do organizador
consolelog Pronto para rodar o organizador
main