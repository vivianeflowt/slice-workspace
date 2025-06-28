 Ajuste no envio de mensagens do chat
User
admin queria um ajuste nesse servico que ao enviar pro chat ele quebra o envio por linha o certo é enviar o conteudo a textbox como um todo
Cursor
python
import os
import subprocess
import shlex
  existing code 
def send_text_to_chattext str  dict
 Caminho para o worker
worker_path  ospathjoinospathdirname__file__ send_to_chat_workerpy
 Usa shlexquote para garantir que o texto seja passado como argumento único
quoted_text  shlexquotetext
result  subprocessrun
fpython3 worker_path quoted_text
shellTrue
capture_outputTrue
textTrue
if resultreturncode  0
return status enviado output resultstdoutstrip
else
return error Erro ao enviar via worker details resultstderrstrip
  existing code 
 Ajuste realizado agora o envio para o chat preserva o conteúdo completo da textbox sem quebrar por linha
User
inclusive tem uma funcionalidade que te envio um dependendo do select uma sub system prompt pra reforçar como interpretar a menssagem iso tb tava burgado quebrando a linha ele ir tudo
Cursor