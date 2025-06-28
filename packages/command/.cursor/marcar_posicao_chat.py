import pyautogui
import json
import time
from datetime import datetime

print("Você tem 5 segundos para clicar no campo de mensagem do Cursor...")
time.sleep(5)

x, y = pyautogui.position()

with open("chat_position.json", "w") as f:
    json.dump({"x": x, "y": y}, f, indent=2)

print(f"Posição salva em chat_position.json: x={x}, y={y}")
