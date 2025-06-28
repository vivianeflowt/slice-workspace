IA pythonzeira preciso de vc
MEMORYmd
CONTECTmd
recupera contexto minha IA pythonzeira
cursorrules
  CHAT 12 chat02md
Arquivo homeviviDocumentosslicesliceprojectmanagerpackagesalivebackupchat02md
Tamanho 3543 caracteres
  CONVERSA
User
ai quero que adicione descricoes no schema do zod nos providers
Cursor
typescript
  existing code 
const OpenaiOptionsProviderSchema  GenerateOptionsSchemaomit
model true
extend
model zenumOPENAI_MODELSdescribeModelo OpenAI a ser utilizado
prompt zstringdescribePrompt enviado ao modelo
systemPrompt zstringoptionaldescribePrompt de sistema contexto do modelo
temperature znumberoptionaldescribeTemperatura de amostragem
maxTokens znumberoptionaldescribeMáximo de tokens na resposta
topP znumberoptionaldescribeTopp sampling
  existing code 
User
ele extentende no abstract
abstract ja tem a maioria
AbstractAIProviderts pode começar por aqui
Cursor
typescript
import  z  from zod
import 
DEFAULT_MODEL_MAX_TOKENS
DEFAULT_MODEL_MIN_TOKENS
DEFAULT_MODEL_TEMPERATURE
 from constantsconstants
export const GenerateOptionsSchema  zobject
prompt zstringdescribePrompt enviado pelo usuário para o modelo Exemplo Resuma o texto a seguir
model zstringdescribeIdentificador do modelo de IA a ser utilizado Exemplo gpt4o llama38b
systemPrompt zstringoptionaldescribePrompt de sistema para definir contexto persona ou instruções globais do modelo Exemplo Você é um assistente especializado em direito
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
 Enum de modelos de IA deve seguir sempre os mais baratos para o mais caro e uma documentacao simples no enum
export type GenericOptions  zinfertypeof GenerateOptionsSchema
export abstract class AbstractAIProviderTOptions  any 
protected BEHAVIOR string  
protected CONTEXT string  
constructorargs any 
 Entenda Behavior como o comportamento do modelo se ele é um assistente um gerador de texto um gerador de imagens etc
public setBehaviorbehavior string 
thisBEHAVIOR  behavior
public unSetBehavior 
thisBEHAVIOR  
 Entenda Context como algo que vem antes do behavior como o contexto do problema o que o usuário está pedindo
 ou o contexto do projeto
public setContextcontext string 
thisCONTEXT  context
public unSetContext 
thisCONTEXT  
protected getSystemPrompt 
return thisCONTEXT thisBEHAVIOR
filterBoolean
joinn
replaceSngm 
trim
public abstract generateoptions TOptions Promisestring
 Descrições detalhadas adicionadas ao schema do zod em AbstractAIProviderts conforme solicitado