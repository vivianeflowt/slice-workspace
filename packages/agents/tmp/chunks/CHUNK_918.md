Cursor
Juntar todos os commits em um só squash não remove os arquivos grandes do histórico O squash apenas cria um novo commit consolidando as alterações atuais mas o histórico anterior com os arquivos pesados ainda existe no repositório  e continua sendo transferido em pushpullclones
Resumo
 Squash  histórico limpo visualmente mas o peso dos arquivos antigos permanece
 Limpeza real  só com ferramentas como BFG RepoCleaner ou git filterrepo que removem os arquivos do histórico inteiro
Se o objetivo é deixar o repositório leve e rápido para todos
 É obrigatório reescrever o histórico para eliminar os arquivos grandes de todos os commits antigos
Se quiser posso preparar o comando de squash para simplificar o histórico atual mas para resolver o problema de lentidão e tamanho a limpeza do histórico é o caminho certo
User
qual a melhor estrategia
Cursor
A melhor estratégia para resolver definitivamente a lentidão e o peso do seu repositório é
 1 Remover Arquivos Grandes do Histórico Limpeza Profunda
 Use o BFG RepoCleaner ou git filterrepo para eliminar todos os rastros dos arquivos grandes modelos datasets binários do histórico inteiro
 Isso reduz drasticamente o tamanho do repositório e acelera pushpullclone para todos