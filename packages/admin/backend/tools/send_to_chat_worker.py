import sys
import subprocess
import os
import json
import time

def send_text_to_chat(text: str, x: int, y: int):
    # Captura posição original do mouse
    result = subprocess.run(['xdotool', 'getmouselocation', '--shell'], capture_output=True, text=True)
    pos = {}
    for line in result.stdout.splitlines():
        if '=' in line:
            k, v = line.strip().split('=')
            pos[k] = v
    orig_x, orig_y = pos.get('X', '0'), pos.get('Y', '0')
    try:
        # Move mouse e clica
        subprocess.run(['xdotool', 'mousemove', str(x), str(y)])
        subprocess.run(['xdotool', 'click', '1'])
        # Usa xsel para copiar para o primary selection (não afeta clipboard principal)
        subprocess.run(['xsel', '--input', '--primary'], input=text, text=True)
        time.sleep(0.1)
        subprocess.run(['xdotool', 'click', '2'])  # Cola com botão do meio
        time.sleep(0.3)
        subprocess.run(['xdotool', 'key', 'Return'])
    finally:
        subprocess.run(['xdotool', 'mousemove', orig_x, orig_y])

if __name__ == "__main__":
    text = sys.argv[1]
    # Lê coordenadas do chat_position.json
    settings_path = os.path.join(os.path.dirname(__file__), '../settings/chat_position.json')
    with open(settings_path, 'r') as f:
        data = json.load(f)
    chat_pos = data.get('chat', {'x': 100, 'y': 200})
    send_text_to_chat(text, chat_pos['x'], chat_pos['y'])
