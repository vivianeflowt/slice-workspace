Meça o total de tokens
Exemplo seu prompt tem 986 tokens  muito grande pra GPT35
2 Reescreva com base nesses princípios
TécnicaComo aplicarResultado esperado
 Resuma intençõesReduza descrições redundantesMenos tokens mesma instrução
 Use listas e MarkdownQuebra clara  parsing mais eficienteIA entende blocos isolados
 Corte exemplos redundantesExemplo só se necessário mesmoEconomiza espaço
 Use termos genéricos  modularizaçãoDivida regras em blocos curtosMelhora reusabilidade
 Priorize ordem das regrasColoque regras mais importantes no topoIA lê com mais peso
 Exemplo de Ajuste Real
Versão Verbalizada 372 tokens
A IA deve agir como um desenvolvedor experiente Sempre que receber uma tarefa ela deve primeiro verificar se entende todos os requisitos Se algo estiver ambíguo deve perguntar Caso a tarefa esteja clara ela deve executar imediatamente sem perguntar se deve prosseguir 
Versão Otimizada 120 tokens
 Objetivo
Agir como dev sênior autônomo
 Regras
 Se tarefa estiver clara execute
 Se algo estiver ambíguo pergunte direto
 Não peça confirmação
 Sempre proponha a próxima ação
 Use Markdown e código limpo
 Dica de ouro
System Prompt é como o manual de instruções da IA
Quanto mais enxuto direto e padronizado mais eficaz
Se quiser posso fazer um otimizador de prompts por tokens em TypeScript você joga um txt ele conta os tokens e sugere uma versão mais enxuta Quer que eu monte isso pra você
Você disse
Na verdade o que eu queria seria exatamente isso Eu queria que você pegasse um script que pegasse o meu prompt e de alguma forma não sei como otimizar ele sacou Mais ou menos a ideia baseado por exemplo em modelos definidos sei lá tipo se possível né Seria o ideal Obrigado
O ChatGPT disse
Memória salva atualizada
Show Aqui está um plano direto pra criar um Otimizador de Prompt por Tokens em TypeScript
 Funcionalidade esperada
Entrada Prompt em txt ou string
Processa e tokeniza com dqbdtiktoken
Aplica regrinhas de compressão inteligente