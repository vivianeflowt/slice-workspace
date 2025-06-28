 Fórmula prática
System Prompt  Instruções  Histórico  Resposta  Tamanho da Janela
Como evitar problema
System Prompt enxuto  500 tokens
Mensagens do usuário objetivas
Evite histórico gigante resumos ajudam
Conte tokens com libs como tiktoken ou dqbdtiktoken
Se quiser posso te dar um script que mede a janela de contexto gasta em tempo real somando tudo isso Quer uma versão Python Node ou CLI
Você disse
Queria um exemplo em typescript
O ChatGPT disse
Aqui vai um exemplo completo em TypeScript que calcula o total de tokens usados em uma conversa simulada System Prompt  mensagens do usuário  mensagens da IA usando o modelo gpt4
 Requisitos
npm install dqbdtiktoken
 tokencounterts
import  encoding_for_model  from dqbdtiktoken
async function contarTokensDaConversa
systemPrompt
mensagens
modelo  gpt4
systemPrompt string
mensagens  role user  assistant content string 
modelo string
const enc  await encoding_for_modelmodelo
let total  0
 System Prompt
const sysTokens  encencodesystemPrompt
total  sysTokenslength
 Conversa
for const msg of mensagens 
const roleTokens  encencodemsgrole  geralmente irrelevante mas conta
const contentTokens  encencodemsgcontent
total  roleTokenslength  contentTokenslength