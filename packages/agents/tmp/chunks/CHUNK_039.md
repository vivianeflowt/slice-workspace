 Criando script de treino para vocabulário próprio com sentencepiece
train_ts  mntdatasentencepiecebindingsrctraints
with opentrain_ts w as f
fwrite
import  execSync  from child_process
import path from path
import fs from fs
const inputFile  processargv2
const args  processargvslice3
if inputFile  fsexistsSyncinputFile 
consoleerrorUso npx tsx srctraints inputtxt vocab_size 8000 model_type bpe model_prefix meu_modelo
processexit1
const defaults  
vocab_size 8000
model_type bpe
model_prefix pathjoinmodels meumodelo
const options  
vocab_size getArgvocab_size  defaultsvocab_size
model_type getArgmodel_type  defaultsmodel_type
model_prefix getArgmodel_prefix  defaultsmodel_prefix
const cmd  spm_train inputinputFile model_prefixoptionsmodel_prefix vocab_sizeoptionsvocab_size model_typeoptionsmodel_type
consolelog Treinando modelo
execSynccmd  stdio inherit 
consolelog Modelo salvo em optionsmodel_prefix  model
function getArgflag string string  undefined 
const index  argsindexOfflag
if index  1  argsindex  1 return argsindex  1
 Atualizar README com seção de treino
readme_path  mntdatasentencepiecebindingREADMEmd
with openreadme_path a as f
fwrite
  Treino com Vocabulário Próprio