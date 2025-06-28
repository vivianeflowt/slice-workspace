Se quiser posso gerar o script completo para você executar ou detalhar o passo a passo para o seu caso
shellscript
java jar bfgjar deletefiles carpa deletefiles fst deletefiles mdl deletefiles raw deletefiles mat deletefiles ie deletefiles model deletefiles vocab deletefiles txt deletefolders vosk 
shellscript
git reflog expire expirenow all
git gc prunenow aggressive
shellscript
git push force
User
sera que juntar os comiits em 1 so nao resolve
Cursor
Juntar todos os commits em um só squash não remove os arquivos grandes do histórico O squash apenas cria um novo commit consolidando as alterações atuais mas o histórico anterior com os arquivos pesados ainda existe no repositório  e continua sendo transferido em pushpullclones
Resumo
 Squash  histórico limpo visualmente mas o peso dos arquivos antigos permanece
 Limpeza real  só com ferramentas como BFG RepoCleaner ou git filterrepo que removem os arquivos do histórico inteiro
Se o objetivo é deixar o repositório leve e rápido para todos
 É obrigatório reescrever o histórico para eliminar os arquivos grandes de todos os commits antigos