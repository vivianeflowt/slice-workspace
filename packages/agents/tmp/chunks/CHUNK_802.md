siga 1 a 1 e comente co que ajustou
Cursor
 Entendido Vou corrigir e padronizar cada provider de IA um por um comentando exatamente o que foi ajustado em cada arquivo
O foco será
 Tipagem correta do enum de modelos resolvendo erros de zodreadonly
 Inclusão dos campos opcionais context systemPrompt description
 Uso correto do cálculo de maxTokens
 Montagem do system prompt na ordem correta systemPromptbehavior primeiro context depois
 Comentários claros sobre cada ajuste
Vou começar pelo DeepSeekProvider e seguir para os demais sempre informando o que foi alterado em cada etapa
User
Cursor
typescript
import axios from axios
import dotenv from dotenv
import  z  from zod
import  GenerateOptionsSchema  from baseAbstractAIProvider
import  AbstractAIProvider  from baseAbstractAIProvider
import  DEEPSEEK_MODELS  from DeepSeekModels
import  getMaxResponseTokens  from utilstokens
import  DEEPSEEK_API_KEY  from constantsconstants
dotenvconfig