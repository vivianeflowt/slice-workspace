Se quiser posso sugerir um fluxo técnico para implementar isso usando o ecossistema Sliceadmin integrando TTS texttospeech e envio de áudio
Quer que eu detalhe como seria essa implementação
User
antes eu queria que você fizesse um diagnóstico para mim por que que esse sincronização do Git tá demorando tanto para o server eu acho que a gente tá enviando coisa que eu não devia
Cursor
Ótima observação Sincronização lenta no Git geralmente indica que arquivospastas grandes desnecessários ou gerados estão sendo versionados ou enviados para o repositório remoto
 Diagnóstico rápido possíveis causas
 node_modules dist build venv logs data coverage DS_Store arquivos de lock etc não estão no gitignore ou foram adicionados antes do ignore
 Arquivos binários grandes ex datasets áudios imagens modelos etc versionados por engano
 Arquivos temporários ou de cache ex tsbuildinfo arquivos de IDE etc presentes no repositório
 Histórico de commits muito grande por causa de arquivos pesados versionados no passado
 O que fazer agora
1 Verificar o status do Git para arquivos grandes ou suspeitos
bash
git status
2 Listar os maiores arquivos versionados
bash
git lfs track
git revlist objects all  git catfile batchcheckobjecttype objectname objectsize rest  grep blob  sort k3nr  head 20
3 Revisar o gitignore em todos os pacotes e na raiz para garantir que tudo que é geradotemporário está sendo ignorado
4 Se arquivos grandes já foram versionados pode ser necessário removêlos do histórico com ferramentas como git filterrepo ou BFG RepoCleaner
Se quiser posso
 Analisar seu gitignore atual
 Sugeriradaptar regras para ignorar tudo que não deve ser versionado
 Orientar como limpar o histórico se necessário
Quer que eu comece revisando o gitignore ou rode algum comando específico para diagnóstico
shellscript
git status