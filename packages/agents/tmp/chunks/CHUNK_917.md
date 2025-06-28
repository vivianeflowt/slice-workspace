1 Limpeza do histórico É necessário reescrever o histórico do git para remover todos os rastros desses arquivos grandes dos commits anteriores
2 Ferramentas recomendadas
 BFG RepoCleanerhttpsrtyleygithubiobfgrepocleaner mais simples e rápido
 git filterrepo mais flexível recomendado pelo próprio Git
 Passos Resumidos BFG RepoCleaner
1 Faça backup do repositório
2 Baixe e rode o BFG para remover arquivos grandes
java jar bfgjar deletefiles carpa deletefiles fst deletefiles mdl deletefiles raw deletefiles mat deletefiles ie deletefiles model deletefiles vocab deletefiles txt deletefolders vosk 
3 Limpe o reflog e compacte
git reflog expire expirenow all
git gc prunenow aggressive
4 Force o push para o remote
git push force
Atenção
 Todos os colaboradores precisarão clonar o repositório novamente após a limpeza
 O histórico será reescrito então só faça isso quando estiver pronta para sincronizar geral
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