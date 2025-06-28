Cursor
Não consegui acessar o diretório de constantes devido a um timeout mas o caminho padrão para essa configuração é projectmanagerpackagesserversrcconstantsconstantsts
Ação recomendada
 Abra o arquivo constantsts nesse caminho
 Procure pela linha que define OLLAMA_BASE_URL
 Ajuste para
export const OLLAMA_BASE_URL  httpollamalocalcloudio
 Salve o arquivo
Se quiser posso tentar novamente acessar e editar esse arquivo automaticamente Confirma
typescript
export const OLLAMA_BASE_URL  httpollamalocalcloudio
User
faça tb um teste com curl pra testa o acesso com o ollama
espera que a outra ia ta configurando o trafiel