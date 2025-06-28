User
é a ideia que você vai usar muitos bancos diferentes então às vezes você carregar o bom que memória faz sentido tem a configuração que você usa Memory Mas você como você tem um MCP que pode juntar um no outro você consegue ler o arquivo e jogar para memória por exemplo
Cursor
 Perfeito O fluxo ideal para máxima flexibilidade com DuckDB e MCP é
 Usar bancos DuckDB em memória memory para operações rápidas temporárias ou testes
 Carregar dados de arquivos DuckDB para a instância em memória quando necessário
 Salvarexportar de volta para arquivo se quiser persistir resultados
 Como fazer isso com MCP servers
1 Configuração para banco em memória
json
serverduckdb 
command npx
args y serverduckdb db memory
Isso inicia o DuckDB em modo volátil tudo em RAM
2 Carregar dados de um arquivo para a memória
 Use comandos SQL via MCP para importar dados
ATTACH caminhoparaarquivoduckdb AS arquivo
INSERT INTO maintabela SELECT  FROM arquivotabela
 Ou use comandos MCP específicos se o server suportar
3 Exportarsalvar para arquivo
 Para persistir use
EXPORT DATABASE caminhoparanovo_arquivoduckdb
 Ou comandos equivalentes via MCP
4 Compor bancos e fluxos
 Combinando com outros MCP servers filesystem memory etc você pode automatizar ler arquivos carregar para memória processar salvarexportar etc