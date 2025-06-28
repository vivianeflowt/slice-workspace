User
 sliceprojectmanager gitfeaturealive  sudo lsof  grep mediavivif59664f261e04c7b94cad751bbbe5f4e
sudo senha para vivi
lsof WARNING cant stat fusegvfsdfuse file system runuser1000gvfs
Output information may be incomplete
lsof WARNING cant stat fuseportal file system runuser1000doc
Output information may be incomplete
lsof WARNING cant stat fuseCursor0505x86_64AppImage file system tmpmount_CursorxoeoxU
Output information may be incomplete
zsh 2418580 vivi cwd DIR 90 4096 31195157 mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
zsh 2421268 vivi cwd DIR 90 4096 31195157 mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
zsh 2457866 vivi cwd DIR 90 4096 31195157 mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
zsh 2461436 vivi cwd DIR 90 4096 31195157 mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
zsh 2477079 vivi cwd DIR 90 4096 31195157 mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
Cursor
Ótimo diagnóstico
O problema está claro vários processos do shell zsh estão com o diretório atual cwd dentro do path do disco que você quer desmontar
 O que fazer para liberar o disco
1 Saia de todos os terminaisshells que estão em mediavivif59664f261e04c7b94cad751bbbe5f4ellvmprompt
 Em cada terminal aberto execute
bash
ou vá para qualquer diretório fora do disco que será desmontado
2 Feche qualquer editor VSCode Cursor etc que esteja com arquivos desse path abertos
3 Se ainda aparecerem processos mateos manualmente
 Exemplo
bash
sudo kill 9 2418580 2421268 2457866 2461436 2477079
4 Tente desmontar novamente
bash
sudo umount devmd0
bash
sudo umount mediavivif59664f261e04c7b94cad751bbbe5f4e
Resumo
O disco só pode ser desmontado se nenhum processo estiver com o diretório atual ou arquivos abertos nele
Saia de todos os shells nesse path feche editores mate processos remanescentes e o unmount vai funcionar