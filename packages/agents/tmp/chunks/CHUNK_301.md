Regras adicionadas ao gitignore para garantir que modelos grandes do Vosk e outros arquivos pesados não sejam mais versionados Sincronize o branch com segurança novos arquivos desses tipos não irão mais para o repositório Após o push prossiga com a limpezamigração dos arquivos já versionados conforme planejado
User
e os comits anteriores
Cursor
Os commits anteriores que já versionaram arquivos grandes modelos Vosk e similares continuam presentes no histórico do repositório Isso significa que mesmo com o gitignore atualizado o histórico ainda carrega esses arquivos  o que mantém o repositório pesado e o pushpull lento
Para resolver definitivamente
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