Cursor
Diagnóstico objetivo
Os maiores arquivos versionados no seu repositório são modelos de voz do Vosk com tamanhos que chegam a quase 2 GB exemplo Gcarpa HCLGfst finalraw finalmdl etc em packagesspeechvendorvosk Esses arquivos pesados tornam o push pull e sync do git extremamente lentos especialmente quando acumulados em muitos commits
Recomendações
 Remover esses arquivos do versionamento git e migrar para Git LFS ou download automatizado via script
 Limpar o histórico do git para eliminar rastros desses arquivos git filterrepo ou BFG RepoCleaner
 Garantir que o gitignore bloqueie qualquer arquivo grandemodelodataset
Esses passos vão acelerar drasticamente a sincronização e a saúde do repositório Se quiser executo a limpeza ou preparo scripts para automatizar o processo
User
faça isso
eu vou mover depois pra outro repo mas preciso sincronizar dev
Cursor
O principal motivo da lentidão é o volume de arquivos grandes modelos Vosk já versionados no histórico do repositório Para sincronizar o branch develop agora o push será demorado mas é possível concluir