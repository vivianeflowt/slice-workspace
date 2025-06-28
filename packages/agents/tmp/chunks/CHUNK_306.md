 Crie um novo repositório ex projectmanagermodels ou use um serviço de arquivos
 Mova os arquivos grandes para lá
 Adicione scripts de downloadinstalação no setup do projeto principal
 8 gitignore
Já está atualizado para evitar que arquivos grandes sejam versionados novamente
Se quiser posso gerar um script shell único para automatizar todo o processo Só avisar
shellscript
cp r homeviviDocumentossliceprojectmanager homeviviDocumentossliceprojectmanagerbackup
shellscript
wget httpsrepo1mavenorgmaven2commadgagbfg1140bfg1140jar O bfgjar
shellscript
java jar bfgjar deletefiles carpa deletefiles fst deletefiles mdl deletefiles raw deletefiles mat deletefiles ie deletefiles model deletefiles vocab deletefiles txt deletefolders vosk 
shellscript
git reflog expire expirenow all
git gc prunenow aggressive
shellscript
git push force
shellscript
git clone urldorepositorio