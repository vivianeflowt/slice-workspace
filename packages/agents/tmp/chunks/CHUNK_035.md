 Criar CLI para otimização de prompt
cli_path  mntdatasentencepiecebindingsrcclits
with opencli_path w as f
fwrite
import fs from fs
import path from path
import  tokenize  from index
const modelPath  processargv2
const promptPath  processargv3
if modelPath  promptPath 
consoleerrorUso npx tsx srcclits modelomodel prompttxt
processexit1
const prompt  fsreadFileSyncpromptPath utf8
const tokens  tokenizeprompt modelPath
consolelog Tokens usados tokenslength
 Sugestão básica de otimização remover linhas muito longas ou vazias
const otimizadas  prompt
splitn
filterl  llength  200  ltrimlength  0
mapl  ltrim
const novoTexto  otimizadasjoinn
const saida  pathjoinpathdirnamepromptPath prompt_otimizadotxt
fswriteFileSyncsaida novoTexto
consolelog Prompt otimizado salvo em saida
 Atualizar README
readme_path  mntdatasentencepiecebindingREADMEmd
with openreadme_path a as f
fwrite
  Funções Adicionais