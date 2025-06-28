Vou corrigir para garantir que todo o conteúdo incluindo delimitadores  e o texto do behavior seja enviado e digitado como um bloco único sem separação
Vou revisar o worker Python para garantir que o argumento recebido preserve todas as quebras de linha e caracteres especiais e que o xdotool type digite exatamente o texto completo incluindo múltiplas linhas e delimitadores
Ajuste a seguir
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
 Move mouse e clica
subprocessrunxdotool mousemove strx stry
subprocessrunxdotool click 1
 Usa clipboard para colar o texto completo preservando quebras de linha
pyperclipcopytext
subprocessrunxdotool key ctrlv
subprocessrunxdotool key Return
finally
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
posso testar
Cursor