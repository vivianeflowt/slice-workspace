 Servidores MCP já disponíveis no seu ambiente
 everythingstdio modelcontextprotocolservereverything
 memorystdio modelcontextprotocolservermemory
 filesystemstdio modelcontextprotocolserverfilesystem
 sequentialthinking modelcontextprotocolserversequentialthinking
 fetchstdio mcpserverfetch
 gitstdio mcpservergit
 jsonstdio gongrzheserverjsonmcp103
Esses são os principais servidores stdio de referência e já estão prontos para uso no seu ambiente
 Outros MCP Servers úteis encontrados no repositório e que podem ser integrados facilmente
 Oficiais e fáceis de instalar via npxuvx
 githubstdio
npx y modelcontextprotocolservergithub
_Acesso a repositórios GitHub issues PRs etc requer token de acesso_
 postgresstdio
npx y modelcontextprotocolserverpostgres postgresqllocalhostmydb
_Acesso a bancos de dados PostgreSQL via MCP_
 sqlitestdio
npx y modelcontextprotocolserversqlite pathtosqlitedb
_Acesso a bancos SQLite locais_
 webstdio
npx y modelcontextprotocolserverweb
_Acesso controlado à web scraping navegação etc_
 pythonstdio
npx y modelcontextprotocolserverpython
_Execução de código Python controlado via MCP_
 shellstdio
npx y modelcontextprotocolservershell
_Execução de comandos shell de forma controlada e segura_
 Como adicionar novos servidores
Basta copiar o comando do README do repositório e adicionar ao seu cursormcpjson seguindo o padrão
json
githubstdio 
command npx
args y modelcontextprotocolservergithub
env 
GITHUB_PERSONAL_ACCESS_TOKEN YOUR_TOKEN
Adapte os argumentos conforme a necessidade do servidor ex string de conexão para bancos de dados