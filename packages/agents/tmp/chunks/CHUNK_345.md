protocolpy cria ele aqui
qd chegar proximo eu te digo se é eu nunca vou esquecer dos desenhos isso fico memorizado
pq como ela mantinha contexto noix tabalhamos quase 2 semanas direto junto
Cursor
python
import numpy as np
import matplotlibpyplot as plt
 Exemplo de texto pode ser substituído por qualquer prompt real
texto  
O pipeline ALIVE integra compressão tokenização customizada e persistência de contexto 
A sumarização identifica as partes mais relevantes do texto 
O protocolo visualcontextual mapeia regiões importantes e gera uma onda de relevância 
SentencePiece permite tokenização eficiente e adaptada ao domínio 
O ciclo de aprendizado incremental armazena padrões em JSON para evolução contínua
 Sumarização heurística score de relevância por frase simples para demo
frases  textosplit 
scores  nparraylenf for f in frases dtypefloat
scores  scores  scoresmin  scoresmax  scoresmin  1e6  normaliza 01
 Geração da onda suave interpola scores ao longo do tubo
BAR_LENGTH  100
x  nplinspace0 1 BAR_LENGTH
frase_pos  nplinspace0 1 lenfrases1
y  npzerosBAR_LENGTH
for i score in enumeratescores
mask  x  frase_posi  x  frase_posi1
ymask  score
 Suaviza a onda
from scipyndimage import gaussian_filter1d
y_smooth  gaussian_filter1dy sigma3
 Marcadores início fim e transições exemplo
markers  
00 yellow start
frase_pos1 blue info
frase_pos2 red transition
10 yellow end
 Desenha o tubo fundo branco preenchido
fig ax  pltsubplotsfigsize10 2
axset_facecolorwhite
axset_xlim0 1
axset_ylim0 1
 Tubo preenchido
axfill_betweenx 0 1 colorwhite edgecolorblack linewidth2 zorder1
 Onda azul clara
axplotx 02  06y_smooth color4FC3F7 linewidth3 zorder2
 Preenchimento sob a onda
axfill_betweenx 02 02  06y_smooth colorB3E5FC alpha07 zorder2
 Marcadores coloridos
for pos cor tipo in markers
if cor  yellow
axaxvlinepos coloryellow linewidth2 zorder3
elif cor  blue
axaxvlinepos color42A5F5 linewidth2 zorder3
elif cor  red
axaxvlinepos colorred linewidth2 zorder3
 Remove eixos
axaxisoff
plttight_layout
pltshow