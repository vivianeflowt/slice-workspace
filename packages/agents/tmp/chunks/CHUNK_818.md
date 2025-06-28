chat agora foque em finalizar a refatoracao do char
Cursor
Refatoração do módulo de chat será finalizada conforme padrão atual do ecossistema
 Garantir isolamento total da lógica de negócio no slice featureschat controller handlers helpers
 Manter o roteamento HTTP apenas no routerts seguindo o padrão OpenAI POST chatcompletions
 Garantir que o controller não dependa de detalhes de infraestrutura externa apenas dos providers e utilitários do ecossistema
 Validar e documentar todos os parâmetros esperados no controller
 Garantir tratamento de erros robusto e logging de execução
 Escrever testes unitários para controller e helpers
 Atualizar comentários e documentação para refletir o fluxo e as decisões de design
Vou executar os ajustes necessários agora
User
pode sim
Cursor
typescript
import  Request Response NextFunction  from express
import  ModelDictionary  from libmodelsModelDictionary
import  OllamaManager  from providersaiollamaOllamaManager
import  HTTP_STATUS_BAD_REQUEST  from utilshttpstatus
import  OpenaiProvider  from providersaiopenaiOpenAIProvider
import  DeepseekProvider  from providersaideepseekDeepSeekProvider
import  OllammaProvider  from providersaiollamaOllammaProvider
import  PerplexityProvider  from providersaiperplexityPerplexityProvider
import  SpeechProvider  from providersaispeechSpeechProvider
 Registry centralizado de providers
const IAProviderRegistry Recordstring any  
openai OpenaiProvider
deepseek DeepseekProvider
ollama OllammaProvider
perplexity PerplexityProvider
speech SpeechProvider