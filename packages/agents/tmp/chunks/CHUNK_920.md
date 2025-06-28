 1 Backup do Repositório
Faça uma cópia de segurança do repositório antes de qualquer alteração drástica
cp r homeviviDocumentossliceprojectmanager homeviviDocumentossliceprojectmanagerbackup
 2 Baixe o BFG RepoCleaner
wget httpsrepo1mavenorgmaven2commadgagbfg1140bfg1140jar O bfgjar
 3 Remova Arquivos Grandes do Histórico
Execute o BFG para remover arquivos e pastas pesadas ajuste extensões conforme necessário
java jar bfgjar deletefiles carpa deletefiles fst deletefiles mdl deletefiles raw deletefiles mat deletefiles ie deletefiles model deletefiles vocab deletefiles txt deletefolders vosk 
 4 Limpe o Reflog e Rode o Garbage Collector
git reflog expire expirenow all
git gc prunenow aggressive
 5 Force o Push para o Remote