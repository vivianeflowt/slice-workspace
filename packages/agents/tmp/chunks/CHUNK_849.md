Se quiser acessar múltiplos bancos normalmente é necessário rodar uma instância para cada arquivo ou alternar o argumento conforme a necessidade
 Próximos passos
1 Confirme o nomecaminho dos bancos DuckDB que deseja acessar
2 Ajuste a configuração no cursormcpjson se necessário
3 Se o server não aceitar argumento direto utilize comandos MCP para abrirconectar ao banco desejado após inicialização
Se quiser posso ajustar a configuração para um banco específico ou pesquisar a documentação do serverduckdb para garantir o melhor setup
json
serverduckdb 
command npx
args y serverduckdb db caminhoparaseu_bancoduckdb
User
é a ideia que você vai usar muitos bancos diferentes então às vezes você carregar o bom que memória faz sentido tem a configuração que você usa Memory Mas você como você tem um MCP que pode juntar um no outro você consegue ler o arquivo e jogar para memória por exemplo
Cursor
 Perfeito O fluxo ideal para máxima flexibilidade com DuckDB e MCP é
 Usar bancos DuckDB em memória memory para operações rápidas temporárias ou testes
 Carregar dados de arquivos DuckDB para a instância em memória quando necessário
 Salvarexportar de volta para arquivo se quiser persistir resultados
 Como fazer isso com MCP servers