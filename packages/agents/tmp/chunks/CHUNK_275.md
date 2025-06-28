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
Cursor
 Foco total em lógica funcional estilo POC Prova de Conceito
 Sem CLI ou interface no início
 Código direto simples e fácil de testar
 Funções isoladas para ingestão divisão chunking e logging dos experimentos
 Feedback e resultados sempre registrados no REPORTmd
Vou estruturar o maints para rodar a lógica principal de ingestão e chunk