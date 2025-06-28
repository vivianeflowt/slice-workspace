eu acho que no caso do olhão você tem que configurar o pf você tem que colocar o pf igual o do o que a gente tem ali no servidor
Cursor
json
  existing code 
mcpollamastdio 
command uvx
args mcpollama port 11434
  existing code 
 Configuração do mcpollamastdio ajustada para usar a porta fixa 11434 garantindo compatibilidade com o endpoint padrão do Ollama local
Agora o MCP server irá se conectar corretamente ao Ollama rodando na mesma porta do seu servidor
User
host precisa ser 127001
Cursor
json
  existing code 
mcpollamastdio 
command uvx
args mcpollama host 127001 port 11434
  existing code 
 Parâmetro host 127001 adicionado à configuração do mcpollamastdio
Agora a conexão com o Ollama está garantida para o endereço local explícito evitando qualquer ambiguidade de rede