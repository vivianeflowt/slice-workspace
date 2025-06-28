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
User
isso ajuda com o mesmo sistem prompt pode atribuir certas variacoes
ai ajuste o resto dos providers
acho que so falta description