Exatamente
Se você basear a segmentação apenas em keywords que se repetem vai acabar com uma lista cheia de termos frequentes mas sem significado real para separação de assuntos Isso acontece porque
 Palavras e expressões comuns eu vc exemplo agora tipo ok sim não etc aparecem em quase toda conversa mas não indicam transição de tópico
 O critério de frequência sozinho não captura contexto intenção ou mudança de assunto  só volume
 Por que só frequência não funciona
 Ruído Termos de alta frequência geralmente são stopwords muletas de linguagem ou conectivos
 Falso positivo Palavras que aparecem muito podem ser importantes para o jeito de falar mas não para segmentar tópicos
 Falso negativo Expressões de transição agora vamos próximo problema podem ser menos frequentes mas muito mais relevantes para separar assuntos
 O que funciona melhor
 TFIDF Penaliza palavras muito frequentes no corpus e destaca termos que são relevantes em um bloco mas não em todos
 Clusterização semântica Agrupa mensagens por similaridade de conteúdo não só por palavras repetidas
 Validação humana Sua intuição é essencial para ajustar o que realmente separa assuntos
 Expressões compostas Focar em bigramastrigramas e padrões de transição não só em palavras isoladas
 Caminho recomendado
1 Remova stopwords e termos irrelevantes
2 Use TFIDF para identificar termos relevantes por bloco
3 Aplique clusterização Kmeans DBSCAN etc para agrupar mensagens por assunto
4 Valide e ajuste iterativamente com feedback humano
Esse é o motivo pelo qual pipelines modernos de NLP para segmentação de tópicos como o messagessubjectclusterhttpsgithubcomBrugnaro42messagessubjectcluster combinam préprocessamento modelagem de tópicos e validação humana  nunca só frequência bruta
Se quiser posso adaptar seu pipeline para seguir esse padrão tornando a segmentação muito mais precisa e útil