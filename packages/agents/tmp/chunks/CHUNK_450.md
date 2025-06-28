 Pipeline modular
 Permite experimentar diferentes etapas tokenização normalização clusterização e ajustar conforme o feedback humano
 Foco em interpretação
 O resultado dos clusters pode ser transformado em informações interpretáveis facilitando a validação e ajuste por humanos como você faz no seu pipeline
 Como aplicaradaptar ao seu projeto
1 Adote uma lista de stopwords robusta e customizável para português
2 Implemente TFIDF para identificar termos relevantes em cada blocomensagem
3 Use clusterização Kmeans DBSCAN etc para agrupar mensagens por assunto não só por keywords
4 Valide os clusters com sua intuição e feedback refinando a lista de termos irrelevantes e ajustando o número de clusters conforme necessário
5 Mantenha o pipeline aberto para evolução sempre que encontrar um termo irrelevante adicione à lista de stopwords sempre que um cluster não fizer sentido ajuste os parâmetros
Esse tipo de abordagem híbrida NLP  validação humana é o que há de mais moderno e eficiente para segmentação de tópicos em conversas reais especialmente em português
Se quiser posso adaptar seu pipeline para incorporar essas técnicas TFIDF clusterização stopwords customizadas e deixar pronto para validação incremental com sua intuição
Referência
Brugnaro42messagessubjectcluster GitHubhttpsgithubcomBrugnaro42messagessubjectcluster
User
se vc pegar so pelas keywords que se repetem a maioria dos termos vao se tornas relevantes em numero porem sem significaco
Cursor