Cursor
 O envio foi quebrado após a alteração para restaurar o clipboard Isso pode acontecer porque o clipboard pode não ser restaurado a tempo ou o pyperclip pode não ser confiável em todos os ambientes especialmente em Linux com diferentes gerenciadores de área de transferência
Solução robusta
 Usar o clipboard apenas durante o envio mas garantir um pequeno delay após o ctrlv antes de restaurar o clipboard
 Alternativamente permitir que o usuário escolha entre modo seguro não mexe no clipboard e modo colar usa clipboard mas pode sobrescrever temporariamente
Vou implementar o delay após o ctrlv para garantir que o texto seja colado antes de restaurar o clipboard
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