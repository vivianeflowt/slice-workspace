 Resumo
 Você pode alternar entre bancos em disco e em memória conforme a tarefa
 Pode compor fluxos ler de um processar em outro exportar etc
 O MCP server de DuckDB permite máxima flexibilidade para automação de dados
Se quiser posso ajustar a configuração para usar memory por padrão ou criar exemplos de comandos para importarexportar entre arquivos e memória
json
serverduckdb 
command npx
args y serverduckdb db memory
ATTACH caminhoparaarquivoduckdb AS arquivo
INSERT INTO maintabela SELECT  FROM arquivotabela
EXPORT DATABASE caminhoparanovo_arquivoduckdb
User
Tenta achar algum que você consegue interagir com ollama Tenta achar algum que você consegue interagir com lhama porque você imagina você poder ter a capacidade de usar qualquer uma lá do você pode usar isso direto do server né Mas seria legal você ter algum para request http Tenta achar algum que você consegue interagir com lhama porque você imagina você poder ter a capacidade de usar qualquer uma lá do você pode usar isso direto do server né Mas seria legal você ter algum para request http e algum para interagir talvez com alguma coisa do ollama
Cursor
 Existem diversos MCP servers prontos para integração direta com Ollama e modelos Llama e outros ampliando muito sua autonomia e capacidade de automação Eis os mais relevantes para seu caso
 1 MCP Ollama Server mcpollama
 Função Integração direta com Ollama permite listar modelos obter detalhes e interagir chatcompletion com qualquer modelo local incluindo Llama Mistral Phi etc
 Comando recomendado
json
mcpollama 
command uvx
args mcpollama
 Requisitos
 Python 310
 Ollama instalado e rodando localmente
 Modelos baixados via ollama pull
 Referência Glama MCP Ollama Serverhttpsglamaaimcpserversemgeeemcpollama