python
import sys
import subprocess
import os
import json
import time
def send_text_to_chattext str x int y int
 Captura posição original do mouse
result  subprocessrunxdotool getmouselocation shell capture_outputTrue textTrue
pos  
for line in resultstdoutsplitlines
if  in line
k v  linestripsplit
posk  v
orig_x orig_y  posgetX 0 posgetY 0
 Move mouse e clica
subprocessrunxdotool mousemove strx stry
subprocessrunxdotool click 1
 Usa xsel para copiar para o primary selection não afeta clipboard principal
subprocessrunxsel input primary inputtext textTrue
timesleep01
subprocessrunxdotool click 2  Cola com botão do meio
timesleep03
subprocessrunxdotool key Return
finally
subprocessrunxdotool mousemove orig_x orig_y
if __name__  __main__
text  sysargv1
 Lê coordenadas do chat_positionjson
settings_path  ospathjoinospathdirname__file__ settingschat_positionjson
with opensettings_path r as f
data  jsonloadf
chat_pos  datagetchat x 100 y 200
send_text_to_chattext chat_posx chat_posy
 Pronto Agora o envio usa o primary selection do X11 com xsel e cola com o botão do meio do mouse sem afetar seu CtrlCCtrlV Seu clipboard principal não será mais alterado
Pode testar seus comandos de copiarcolar continuarão funcionando normalmente durante o uso da ferramenta
User
tô tentando gravar de novo para ver se
Cursor
 Perfeito pode testar à vontade Agora o envio não interfere mais no seu clipboard principal Aguardo seu feedback sobre o novo comportamento