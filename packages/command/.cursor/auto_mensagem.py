import pyautogui
import json
import time
import random

with open("chat_position.json") as f:
    pos = json.load(f)

mensagens = [
    "Siga a TASKLIST.",
    "Você deve executar a próxima task, chunk a chunk.",
    "Não explique — apenas execute.",
    "Valide com teste e prossiga.",
    "Avance sem loops de intenção."
]

print("Iniciando envio automático... Ctrl+C para parar.")
while True:
    pyautogui.click(pos["x"], pos["y"])
    time.sleep(0.2)
    pyautogui.write(random.choice(mensagens), interval=0.03)
    pyautogui.press("enter")
    time.sleep(random.randint(60, 90))
