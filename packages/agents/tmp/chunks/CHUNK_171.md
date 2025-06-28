tente padronizar as rodas pro formato da open ai aspenas os endpoitntsask model
Cursor
 Para padronizar os endpoints dos slices ask e model no formato da OpenAI mais RESTful direto e sem pluralização desnecessária a recomendação é
 Endpoints ask promptcompletionchat
 POST v1chatcompletions  principal padrão OpenAI
 POST v1completions  opcional para prompts simples
 POST v1embeddings  se for gerar embeddings
No seu caso
 O endpoint principal para requisições de IA deve ser v1chatcompletions ou v1completions se não for chat
 Endpoints model modelos disponíveis status busca etc
 GET v1models  lista todos os modelos
 GET v1modelsmodel  detalhes de um modelo específico
 GET v1modelsmodelstatus  status de instalação de um modelo
 GET v1modelssearchq  busca inteligente
 GET v1modelscategories  lista categorias
 GET v1modelscategorycategory  modelos por categoria
 GET v1modelsinstalled  apenas instalados
 Resumo de como ficaria
 ASK
 POST v1chatcompletions  AskControllerask
 MODEL
 GET v1models  lista todos
 GET v1modelsmodel  detalhes
 GET v1modelsmodelstatus  status
 GET v1modelssearchq  busca
 GET v1modelscategories  categorias
 GET v1modelscategorycategory  por categoria
 GET v1modelsinstalled  instalados
 GET v1modelsstatus  status de todos
Próximos passos
 Ajustar os arquivos de routercontroller para refletir esses endpoints
 Garantir que as rotas antigas sejam redirecionadas ou removidas para evitar duplicidadeconfusão