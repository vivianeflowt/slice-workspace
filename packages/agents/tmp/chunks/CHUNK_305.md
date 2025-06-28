 3 Remova Arquivos Grandes do Histórico
Execute o BFG para remover arquivos e pastas pesadas ajuste extensões conforme necessário
java jar bfgjar deletefiles carpa deletefiles fst deletefiles mdl deletefiles raw deletefiles mat deletefiles ie deletefiles model deletefiles vocab deletefiles txt deletefolders vosk 
 4 Limpe o Reflog e Rode o Garbage Collector
git reflog expire expirenow all
git gc prunenow aggressive
 5 Force o Push para o Remote
git push force
 6 Avise os Colaboradores
Todos precisarão clonar o repositório novamente após a limpeza
git clone urldorepositorio
 7 Migre os ModelosDatasets para Repositório Externo