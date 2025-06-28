import os
import subprocess
import shlex

def send_text_to_chat(text: str) -> dict:
    # Caminho para o worker
    worker_path = os.path.join(os.path.dirname(__file__), 'send_to_chat_worker.py')
    # Usa shlex.quote para garantir que o texto seja passado como argumento único
    quoted_text = shlex.quote(text)
    result = subprocess.run(
        f'python3 {worker_path} {quoted_text}',
        shell=True,
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        return {"status": "enviado", "output": result.stdout.strip()}
    else:
        return {"error": "Erro ao enviar via worker", "details": result.stderr.strip()}
