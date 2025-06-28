Cursor
 Correto Para máxima clareza e padronização adicione o campo description opcional no schema de opções dos providers permitindo descrever o propósitocontexto do request ou do prompt
Sugestão de ajuste para todos os providers
 Adicionar description string ao schema de opções zod
 Documentar no describe que é um campo livre para contexto rastreabilidade ou explicação do uso
Exemplo
description zstringoptionaldescribeDescrição livre do request contexto ou finalidade do prompt Útil para rastreabilidade logs ou experimentos
Assim todos os providers aceitam context systemPrompt e description como opcionais tornando a interface mais flexível e informativa
Se desejar aplico esse ajuste em todos os providers agora
typescript
description zstringoptionaldescribeDescrição livre do request contexto ou finalidade do prompt Útil para rastreabilidade logs ou experimentos
User
poderia sim mt boa a ideia
sabendo mais sobre os providers te ajuda a refatorar melhor chat e models
Cursor