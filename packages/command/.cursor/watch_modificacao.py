import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime

import pyautogui
import json
import random
import threading

INTERVALO_DEBOUNCE = 30  # segundos
ARQUIVO_COORDENADAS = "chat_position.json"
MENSAGENS = [
    "Siga a TASKLIST.",
    "Execute a próxima task, chunk a chunk.",
    "Valide com teste e prossiga.",
    "Não explique, apenas execute.",
    "Evite loops de intenção — apenas avance."
]

with open(ARQUIVO_COORDENADAS) as f:
    pos = json.load(f)

ultima_modificacao = None
lock = threading.Lock()

def enviar_mensagem():
    pyautogui.click(pos["x"], pos["y"])
    time.sleep(0.2)
    pyautogui.write(random.choice(MENSAGENS), interval=0.03)
    pyautogui.press("enter")

def worker_debounce():
    global ultima_modificacao
    while True:
        time.sleep(5)
        with lock:
            if ultima_modificacao and (time.time() - ultima_modificacao > INTERVALO_DEBOUNCE):
                print(f"[{datetime.now()}] Nenhuma alteração recente. Enviando reforço...")
                enviar_mensagem()
                ultima_modificacao = None

class MeuHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global ultima_modificacao
        if not event.is_directory:
            with lock:
                ultima_modificacao = time.time()
                print(f"[{datetime.now()}] Arquivo modificado: {event.src_path}")

if __name__ == "__main__":
    path = os.path.abspath("..")
    observer = Observer()
    observer.schedule(MeuHandler(), path=path, recursive=True)

    print("Monitorando modificações no repositório com debounce...")
    print("Ctrl+C para sair.")

    thread = threading.Thread(target=worker_debounce, daemon=True)
    thread.start()

    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
