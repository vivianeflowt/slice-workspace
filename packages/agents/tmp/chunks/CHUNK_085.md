Ajuste a seguir
python
import sys
import subprocess
import os
import json
import pyperclip
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
original_clipboard  pyperclippaste
 Move mouse e clica
subprocessrunxdotool mousemove strx stry
subprocessrunxdotool click 1
 Usa clipboard para colar o texto completo preservando quebras de linha
pyperclipcopytext
subprocessrunxdotool key ctrlv
timesleep03  Pequeno delay para garantir que o texto seja colado
subprocessrunxdotool key Return
finally
 Restaura clipboard original
pyperclipcopyoriginal_clipboard
 Volta mouse para posição original
subprocessrunxdotool mousemove orig_x orig_y
if __name__  __main__
text  sysargv1
 Lê coordenadas do chat_positionjson
settings_path  ospathjoinospathdirname__file__ settingschat_positionjson
with opensettings_path r as f
data  jsonloadf
chat_pos  datagetchat x 100 y 200
send_text_to_chattext chat_posx chat_posy
User
sempre uso linux derivado de ubuntu
Cursor
 Ajuste aplicado agora há um pequeno delay após o ctrlv para garantir que o texto seja colado antes de restaurar o clipboard Isso é especialmente importante em ambientes LinuxUbuntu onde o clipboard pode demorar para sincronizar
O fluxo está otimizado para seu ambiente LinuxUbuntu Pode testar novamente