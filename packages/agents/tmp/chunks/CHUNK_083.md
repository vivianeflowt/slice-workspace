Cursor
 Entendido Para não sobrescrever o clipboard do usuário o ideal é salvar o conteúdo original do clipboard antes de copiar o texto e restaurar após o envio
Vou implementar isso agora no worker
python
import sys
import subprocess
import os
import json
import pyperclip
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
 Pronto Agora o worker salva o conteúdo original do clipboard antes de colar o texto e restaura automaticamente após o envio Seu clipboard não será mais alterado pelo processo
Pode testar sem risco de perder o conteúdo do clipboard
User