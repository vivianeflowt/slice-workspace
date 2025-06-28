Se quiser posso preparar o comando de squash para simplificar o histórico atual mas para resolver o problema de lentidão e tamanho a limpeza do histórico é o caminho certo
User
qual a melhor estrategia
Cursor
A melhor estratégia para resolver definitivamente a lentidão e o peso do seu repositório é
 1 Remover Arquivos Grandes do Histórico Limpeza Profunda
 Use o BFG RepoCleaner ou git filterrepo para eliminar todos os rastros dos arquivos grandes modelos datasets binários do histórico inteiro
 Isso reduz drasticamente o tamanho do repositório e acelera pushpullclone para todos
 Passos
1 Backup do repositório
2 Rodar BFG RepoCleaner para remover arquivos grandes e pastas específicas
3 Limpar o reflog e rodar o garbage collector do git
4 Forçar push para o remote
5 Todos os colaboradores devem clonar novamente o repositório
 2 Atualizar gitignore
 Já foi feito garante que arquivos grandes não sejam mais versionados no futuro
 3 Migrar ModelosDatasets para Repositório Externo
 Crie um repositório só para modelosdatasets ou use Git LFS Google Drive S3 etc
 Automatize o download via script no setup do projeto
 4 Opcional Squash dos Commits
 Após a limpeza se quiser um histórico ainda mais enxuto faça um squash para consolidar os commits