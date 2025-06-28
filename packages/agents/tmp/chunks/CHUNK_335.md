def adicionar_marcadoresbarra str markers ListMarker length int  BAR_LENGTH  str
barra_list  listbarra
for pos cor tipo in markers
idx  1  intpos  length  1  mapeia 01 para a barra
if cor  yellow
barra_listidx  
elif cor  blue
barra_listidx  I
elif cor  red
barra_listidx  
else
barra_listidx  
return joinbarra_list
def gerar_ondaamplitudes Listfloat length int  BAR_LENGTH  str
 Normaliza amplitudes para altura máxima de 5 linhas
max_height  5
onda  inta  max_height for a in amplitudes
linhas     length  2 for _ in rangemax_height
for i h in enumerateonda
for l in rangemax_height  h max_height
linhasl  linhasli1    linhasli2
return njoinlinhas
def gerar_ascii_protocolomarkers ListMarker amplitudes Listfloat length int  BAR_LENGTH  str
barra  gerar_barra_baselength
barra_marcada  adicionar_marcadoresbarra markers length
onda  gerar_ondaamplitudes length
return fondanbarra_marcada
O gerador modular do desenho do protocolo visualcontextual foi criado em packagesalivealiveprotocolpy com funções separadas para
 Gerar a barra base
 Adicionar marcadores coloridos amarelo azul vermelho
 Gerar a onda simulada sobre a barra
 Compor tudo em um ASCII art para visualização
Agora vou sugerir um nome de arquivo para um exemplo de aplicação prática ex protocol_examplepy onde aplico o gerador a um texto real para validação visual Confirma o nome ou sugere outro
User
depois tenta jutnar os conceitos de sumarizacao com essa ideia e setencepiece pra ajustar o prompt com usando train que ele tem e sumarizacao
Cursor