 Próximos passos recomendados
1 Monte o disco no path correto
Exemplo
bash
sudo mount devmd0 mediadata
2 Verifique se o mount está OK
bash
df h  grep mediadata
ls lh mediadata
3 Ajuste variáveis de ambiente configs e compose files
Garanta que todos os stacks e scripts apontem para mediadata e não mais para o path antigo
4 Suba novamente a infraestrutura
bash
cd homeviviDocumentosslicesliceinfrastructure
make stacksup
5 Teste todos os serviços
Certifiquese de que tudo está funcionando e acessando o novo mount
Se precisar de checklist script de verificação ou quiser registrar o procedimento para o futuroonboarding só avisar
Parabéns pelo trabalho  isso é engenharia de verdade 
shellscript
sudo mount devmd0 mediadata
shellscript
df h  grep mediadata
ls lh mediadata
shellscript
cd homeviviDocumentosslicesliceinfrastructure
make stacksup