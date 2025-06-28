 Usar uma lista padrão de stopwords em português existem várias disponíveis posso incluir uma
 Adicionar lógica para ignorar keywords que estejam nessa lista
 Permitir que você adicioneedite a lista conforme encontra casos reais nos seus dados
 Resumindo
Você está propondo o caminho certo
Sem ensinar o pipeline sobre o português ele vai confundir frequência com relevância
Com o dicionário a curadoria fica muito mais inteligente e adaptada ao seu contexto
Posso implementar isso agora incluindo uma lista de stopwords e ajustando o filtro de keywords
Confirma que posso seguir assim Se quiser pode até me passar sua própria lista de palavras irrelevantes
User
o problema é que tem termos que nao fazem sentido mesmo quando mt utilizados
Cursor
Exatamente
Nem toda palavra ou expressão frequente é útil para separar assuntos  e pior algumas são até enganosas aparecem muito mas nunca indicam transição de tópico Isso acontece porque
 Frequência  relevância semântica para segmentação
 Termos como exemplo agora então tipo ok sim não pra mas bom aí só gente coisa etc são comuns em conversas mas raramente marcam mudança de assunto
 Algumas expressões são muletas de linguagem ou marcadores de hesitação não de transição
 Como resolver isso