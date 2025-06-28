const systemPrompt  
 Objetivo
Agir como IA dev sênior autônoma
 Regras
 Sem pedir permissão
 Sempre sugerir próxima ação
 Usar Markdown e código limpo
contarTokenssystemPrompt
 Dica prática
Você pode usar isso para
Validar tamanho antes de enviar ao modelo
Exibir token count no terminal ou interface
Gerar alertas caso ultrapasse X tokens
Se quiser posso empacotar isso como CLI tipo npx contartokens pathtxt Quer
Você disse
Então se eu entendi direito para eu garantir que a IA tenha uma boa interpretação do que eu quero eu tenho que pegar o System Prompt somar com o Prompt em si e tokenizar para o tamanho do como você chamou ali de de Janeiro de Contexto não é isso Como é o nome
O ChatGPT disse
Exatamente O nome técnico disso é
 Janela de Contexto Context Window
É o tamanho total em tokens que a IA consegue ver ao mesmo tempo Inclui
BlocoEntra na Janela de Contexto
 System PromptSim
 Histórico da conversaSim
 Última perguntaSim
 Resposta geradaSim
 Exemplos de Janelas de Contexto por Modelo
ModeloJanela de Contexto
GPT35 Turbo4k ou 16k tokens
GPT4 classic8k ou 32k tokens
GPT4 Turbo  o128k tokens
 Se você ultrapassa a janela a IA começa a esquecer o que veio antes