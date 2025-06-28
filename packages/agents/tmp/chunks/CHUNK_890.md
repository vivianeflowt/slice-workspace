typescript
usrbinenv tsnode
import  Command  from commander
import  ingestAndChunk  from utils
import  loadConfig  from config
const program  new Command
program
nameerd
descriptionOrganizador Automático de Documentação
version100
program
commandprocess file
descriptionIngestão e divisão de um arquivo grande de documentação
actionasync file  
const config  loadConfig
await ingestAndChunkfile config
programparseAsyncprocessargv
User
nao precisa de cli no inicio
foca so em logica funcionar bem estipo POC