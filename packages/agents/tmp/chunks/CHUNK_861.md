 O erro ocorreu porque o script formatjs está chamando o próprio formatsh dentro de cada pacote criando um loop recursivo o formatsh chama o formatjs que chama o formatsh de novo em cada pacote
 Como corrigir
 O correto é que o formatjs execute apenas o Prettier ou o script de formatação real dentro de cada pacote não o formatsh global
 O formatsh na raiz deve apenas chamar o formatjs para formatar todos os pacotes
 Solução
1 Remover a chamada ao formatsh dentro do formatjs
2 No formatjs execute diretamente o Prettier ou o comando de formatação desejado dentro de cada pacote
Se quiser posso ajustar o formatjs para rodar npx prettier write  em cada pacote tornando o fluxo à prova de loops
User
Cursor
javascript
usrbinenv node
const  execSync   requirechild_process
const  readdirSync statSync   requirefs
const  join   requirepath
const PACKAGES_DIR  join__dirname packages