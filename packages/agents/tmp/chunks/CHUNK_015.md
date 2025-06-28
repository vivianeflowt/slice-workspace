encfree  liberar memória WASM
consolelog Total de tokens usados total
return total
 Exemplo de uso
async   
const systemPrompt  
 Objetivo
Agir como IA dev sênior autônoma
 Regras
 Sem pedir permissão
 Sempre sugerir próxima ação
 Usar Markdown e código limpo
const mensagens  
 role user content Crie um hook de autenticação para React 
 role assistant content Claro Aqui está um exemplo de hook 
await contarTokensDaConversa systemPrompt mensagens 
 Explicação
Conta tokens do System Prompt
Conta tokens de cada mensagem da conversa
Mostra o total  você compara com os 128000 do GPT4 Turbo por exemplo
Se quiser posso empacotar isso como CLI npx contartokensconversa arquivojson Deseja essa versão também
Você disse
Agora a próxima pergunta seria isso só serve para o ChatGPT ou essa lib aceita outros tipos de mod por exemplo Perplexity sei lá o SpromptiDollama qual é a abrangência disso
O ChatGPT disse
Boa pergunta E a resposta é bem direta