 Geração da onda mapeia scores para a barra distribui proporcionalmente
amplitudes  npzerosBAR_LENGTH
frase_pos  nplinspace0 BAR_LENGTH lenfrases1 dtypeint
for i score in enumeratescores
amplitudesfrase_posifrase_posi1  score
 Marcadores início fim e transições exemplo
markers  
00 yellow start
frase_pos1BAR_LENGTH blue info
frase_pos2BAR_LENGTH red transition
10 yellow end
 Gera e exibe o protocolo visualcontextual
ascii_art  gerar_ascii_protocolomarkers amplitudestolist BAR_LENGTH
printascii_art
O código e o PATH estão corretos mas para rodar como módulo m aliveprotocol_example o import precisa ser relativo from protocol import  ou o script deve ser executado diretamente como script python aliveprotocol_examplepy
Vou corrigir o import para uso como módulo Python import relativo e garantir compatibilidade total com o padrão do projeto Em seguida reexecuto para mostrar o resultado do gerador ASCII do protocolo visualcontextual
Confirma se prefere rodar como módulo m aliveprotocol_example ou como script direto python aliveprotocol_examplepy Posso ajustar para ambos
User
cria um script shell na raiz do projeto pra eu rodar facilmente o que vc quiser
Cursor