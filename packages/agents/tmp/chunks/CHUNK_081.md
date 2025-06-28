Use este behavior quando quiser mudar completamente o foco ou contexto do trabalho
viu ele quebra em linha onde deveria ser uma unica menssagem
Cursor
 Confirmação visual o chat ainda está quebrando a mensagem em várias linhasblocos quando deveria enviar tudo como uma mensagem única
Vou corrigir para garantir que todo o conteúdo incluindo delimitadores  e o texto do behavior seja enviado e digitado como um bloco único sem separação
Vou revisar o worker Python para garantir que o argumento recebido preserve todas as quebras de linha e caracteres especiais e que o xdotool type digite exatamente o texto completo incluindo múltiplas linhas e delimitadores
Ajuste a seguir
python
import sys
import subprocess
import os
import json
import pyperclip