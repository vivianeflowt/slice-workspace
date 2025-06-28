jsonc
editorformatOnSave false
editorformatOnType false
typescript  editorformatOnSave false 
javascript  editorformatOnSave false 
User
orbigada vc arrasou
foque agora no perplexity
Cursor
typescript
import dotenv from dotenv
import  z  from zod
import axios from axios
import  AbstractAIProvider GenerateOptionsSchema  from baseAbstractAIProvider
import  getMaxResponseTokens  from utilstokens
import  PERPLEXITY_MODELS  from PerplactyModels
import  PERPLEXITY_API_KEY  from constantsconstants
dotenvconfig
const PerplexityOptionsSchema  GenerateOptionsSchemaomit
model true
extend
model zenumPERPLEXITY_MODELS as unknown as string stringdescribeModelo Perplexity a ser utilizado
context zstringoptionaldescribeContexto dinâmico do problema projeto ou usuário
systemPrompt zstringoptionaldescribePrompt de sistema para contextopersonainstruções globais
description zstringoptionaldescribeDescrição livre do request útil para rastreabilidade ou experimentos