 Os erros são porque os métodos do ModelDictionary findByModel findByProvider etc são assíncronos e retornam Promise mas o código está tratando como se fossem síncronos
Como corrigir
 Sempre use await ao chamar métodos assíncronos do ModelDictionary
 Ajuste as funções auxiliares resolveProviderAndModel etc para serem async e usar await corretamente
 No controller garanta que todos os acessos ao dicionário de modelos sejam feitos de forma assíncrona
Exemplo de ajuste para o ChatController
async function resolveProviderAndModel provider model   provider string model string  
const modelDictionary  ModelDictionarygetInstance
if provider  ollama  model 
return 
resolvedProvider providertoLowerCase
resolvedModel model
modelMetadata  model 
if model 
const modelMetadata  await modelDictionaryfindByModelmodel
if modelMetadata throw new ErrorModelo não encontrado no dicionário
return 
resolvedProvider provider  modelMetadataprofileprovidertoLowerCase
resolvedModel modelMetadataprofilemodel
modelMetadata
if provider 
const providerModels  await modelDictionary
typescript
async function resolveProviderAndModel provider model   provider string model string  
const modelDictionary  ModelDictionarygetInstance
if provider  ollama  model 
return 
resolvedProvider providertoLowerCase
resolvedModel model
modelMetadata  model 
if model 
const modelMetadata  await modelDictionaryfindByModelmodel
if modelMetadata throw new ErrorModelo não encontrado no dicionário
return 
resolvedProvider provider  modelMetadataprofileprovidertoLowerCase
resolvedModel modelMetadataprofilemodel
modelMetadata
if provider 
const providerModels  await modelDictionary
User
ajuste todos
AbstractAIProviderts aqui vc podia tb adiciona context que é usando nessa logica que divide o sytem prompt com um part dinamica
context e system prompt devem ser opcionais
Cursor
typescript
export const GenerateOptionsSchema  zobject
prompt zstringdescribePrompt enviado pelo usuário para o modelo Exemplo Resuma o texto a seguir
model zstringdescribeIdentificador do modelo de IA a ser utilizado Exemplo gpt4o llama38b
systemPrompt zstringoptionaldescribePrompt de sistema para definir contexto persona ou instruções globais do modelo Exemplo Você é um assistente especializado em direito
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário Pode ser usado para enriquecer o systemPrompt de forma flexível
temperature z
number
min0
max10
defaultDEFAULT_MODEL_TEMPERATURE
describeTemperatura de amostragem 0 a 10 Valores mais altos tornam as respostas mais criativas e variadas valores baixos tornam as respostas mais determinísticas
maxTokens z
number
minDEFAULT_MODEL_MIN_TOKENS
maxDEFAULT_MODEL_MAX_TOKENS
optional
describeNúmero máximo de tokens palavrasfrases que o modelo pode gerar na resposta Útil para limitar o tamanho da saída
topP znumberoptionaldescribeTopp nucleus sampling controla a diversidade da resposta Valores próximos de 10 permitem maior variedade valores menores restringem a escolha aos tokens mais prováveis