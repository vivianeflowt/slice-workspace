 Listar arquivos grandes versionados git lfs lsfiles ou git revlist objects all  sort k 2  cut f 1 d   xargs n1 git catfile s  sort n  tail 20
 Verificar se há arquivos binários ou datasets no histórico
 Checar se o remote está lento testar git push via terminal e medir tempo
 Avaliar se o gitignore está eficiente
 Considerar uso de Git LFS para arquivos grandes
Se quiser executo comandos específicos para identificar os maiores arquivos versionados e sugerir limpezaotimização do repositório
User
isso
Cursor
Diagnóstico objetivo
Os maiores arquivos versionados no seu repositório são modelos de voz do Vosk com tamanhos que chegam a quase 2 GB exemplo Gcarpa HCLGfst finalraw finalmdl etc em packagesspeechvendorvosk Esses arquivos pesados tornam o push pull e sync do git extremamente lentos especialmente quando acumulados em muitos commits
Recomendações
 Remover esses arquivos do versionamento git e migrar para Git LFS ou download automatizado via script
 Limpar o histórico do git para eliminar rastros desses arquivos git filterrepo ou BFG RepoCleaner
 Garantir que o gitignore bloqueie qualquer arquivo grandemodelodataset
Esses passos vão acelerar drasticamente a sincronização e a saúde do repositório Se quiser executo a limpeza ou preparo scripts para automatizar o processo
User