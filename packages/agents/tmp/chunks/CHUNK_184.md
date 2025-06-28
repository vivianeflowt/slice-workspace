Ou seja ao construir o prompt do sistema concatene primeiro o systemPromptbehavior e depois o context separados por uma quebra de linha se ambos existirem
Exemplo de montagem
const SYSTEM_PROMPT  systemPrompt  thisgetSystemPrompt contextfilterBooleanjoinn
Assim o contexto dinâmico sempre vem depois do system prompt principal garantindo clareza e prioridade correta das instruções
Vou aplicar esse padrão no DeepSeekProvider e replicar nos demais
typescript
const SYSTEM_PROMPT  systemPrompt  thisgetSystemPrompt contextfilterBooleanjoinn
User
aqui deve ser ajustado
Cursor
typescript
protected getSystemPromptcontext string 
return thisBEHAVIOR context
filterBoolean
joinn
replaceSngm 
trim
User