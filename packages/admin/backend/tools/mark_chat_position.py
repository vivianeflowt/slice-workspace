import sys
import os
import json
import time
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QPushButton
from PyQt5.QtCore import Qt, QTimer, QPoint
from PyQt5.QtGui import QCursor

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SETTINGS_DIR = os.path.join(BASE_DIR, 'settings')
SETTINGS_PATH = os.path.join(SETTINGS_DIR, 'chat_position.json')

def load_last_window_position():
    if os.path.exists(SETTINGS_PATH):
        try:
            with open(SETTINGS_PATH, 'r') as f:
                data = json.load(f)
                print(f'[DEBUG] Última posição lida: {data}')
                return data.get('window')
        except Exception as e:
            print(f'[DEBUG] Erro ao ler posição anterior: {e}')
    return None

class PositionMarker(QWidget):
    def __init__(self):
        super().__init__()
        print('[DEBUG] Inicializando janela...')
        os.makedirs(SETTINGS_DIR, exist_ok=True)
        self.setWindowTitle('Marcar posição do chat')
        last_window = load_last_window_position()
        if last_window:
            print(f'[DEBUG] Restaurando posição da janela: {last_window}')
            self.setGeometry(last_window.get('x', 100), last_window.get('y', 100), 300, 120)
        else:
            print('[DEBUG] Usando posição padrão da janela.')
            self.setGeometry(100, 100, 300, 120)
        self.label = QLabel('Clique em Iniciar e posicione o mouse...', self)
        self.label.setGeometry(20, 20, 260, 20)
        self.button = QPushButton('Iniciar', self)
        self.button.setGeometry(100, 60, 100, 30)
        self.button.clicked.connect(self.start_countdown)
        self.countdown_started = False
        self.show()

    def start_countdown(self):
        if self.countdown_started:
            return
        print('[DEBUG] Iniciando contagem regressiva...')
        self.countdown_started = True
        self.button.setEnabled(False)
        self._count = 5
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._tick)
        self._tick()
        self._timer.start(1000)

    def _tick(self):
        if self._count > 0:
            self.label.setText(f'Posicione o mouse... {self._count}s')
            QApplication.processEvents()
            self._count -= 1
        else:
            self._timer.stop()
            self.capture_mouse_position()

    def capture_mouse_position(self):
        pos = QCursor.pos()
        pos_dict = {'x': pos.x(), 'y': pos.y()}
        window_pos = {'x': self.x(), 'y': self.y()}
        data = {'chat': pos_dict, 'window': window_pos}
        print(f'[DEBUG] Capturando posição do mouse: {pos_dict}')
        try:
            with open(SETTINGS_PATH, 'w') as f:
                json.dump(data, f)
            print(f'[DEBUG] Posição marcada e salva: {data}')
        except Exception as e:
            print(f'[ERRO] Falha ao salvar posição: {e}')
        self.close()

if __name__ == '__main__':
    print(f'[DEBUG] Salvando em: {SETTINGS_PATH}')
    app = QApplication(sys.argv)
    marker = PositionMarker()
    sys.exit(app.exec_())
