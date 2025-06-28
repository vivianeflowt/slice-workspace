async function main 
const respostas  await inquirerprompt
type input
name inputPath
message  Caminho do arquivo de vocabulário txt
validate fsexistsSync
type input
name vocabSize
message  Tamanho do vocabulário ex 8000
default 8000
type list
name modelType
message  Tipo de modelo
choices bpe unigram word char
default bpe
type input
name modelPrefix
message  Prefixo de saída
default   pathjoinmodels meumodelo
const cmd  spm_train inputrespostasinputPath model_prefixrespostasmodelPrefix vocab_sizerespostasvocabSize model_typerespostasmodelType
consolelogn Treinando modelo
execSynccmd  stdio inherit 
const modelFile  respostasmodelPrefix  model
consolelogn Modelo gerado modelFile
 Benchmark simples
const benchmarkInput  fsreadFileSyncrespostasinputPath utf8
const linhas  benchmarkInputsplitnfilterl  ltrimlength  0
let totalTokens  0
let totalFrases  0
let tokenSet  new Setstring
for const linha of linhasslice0 100 
const tokens  tokenizelinha modelFile
totalTokens  tokenslength
tokensforEacht  tokenSetaddStringt
totalFrases
consolelogn Benchmark
consolelog Frases analisadas totalFrases
consolelog Tokens médios por frase totalTokens  totalFrasestoFixed2
consolelog Tokens únicos tokenSetsize
main
 Atualizar README com instrução da interface interativa
readme_path  mntdatasentencepiecebindingREADMEmd
with openreadme_path a as f
fwrite
  Interface CLI Interativa de Treino  Benchmark