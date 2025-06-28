isso
Cursor
Exatamente O erro clássico do Makefile
Makefile11  faltando o separador Pare
significa que algum comando está indentado com ESPAÇOS em vez de TAB
No Makefile todo comando de target deve ser indentado com TAB não espaço
 Como corrigir
1 Abra o Makefile
2 Para cada target install downloadmodels etc garanta que a linha de comando logo abaixo está indentada com TAB
 Exemplo correto
makefile
install
PDM install
 Exemplo errado com espaço
makefile
install
PDM install
3 Faça isso para todos os comandos do arquivo
 Dica de ouro Slice
 No VSCode configure para mostrar caracteres invisíveis Settings  Render Whitespace all
 Use o comando Convert Indentation to Tabs se necessário