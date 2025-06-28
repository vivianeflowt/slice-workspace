5 Remonte no path correto
bash
sudo mount devmd0 mediadata
Resumo para registro
 O erro target is busy é sempre causado por algum processo usando o disco
 O comando lsof ou fuser mostra exatamente o que está travando
 Feche tudo mate o que for necessário e só então desmonte
Se quiser posso gerar um script bash para automatizar a checagem e desmontagem ou te guiar passo a passo
Só avisar
 Gere o script IA pythonzeira
Ou siga o plano acima e me avise se travar em algum ponto
shellscript
sudo lsof  grep mediavivif59664f261e04c7b94cad751bbbe5f4e
shellscript
sudo fuser vm mediavivif59664f261e04c7b94cad751bbbe5f4e
shellscript
sudo kill 9 PID
shellscript
sudo umount devmd0
shellscript
sudo umount mediavivif59664f261e04c7b94cad751bbbe5f4e
shellscript
sudo mount devmd0 mediadata