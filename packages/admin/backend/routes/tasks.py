from fastapi import APIRouter, HTTPException, Body
from pathlib import Path
import re
from pydantic import BaseModel
import yaml
import os
import json
import pyautogui
import time
import pyperclip
import subprocess
import shlex

router = APIRouter()

TASKS_DIR = Path(__file__).parent.parent / 'src' / 'data' / 'tasks'

FRONTMATTER_REGEX = re.compile(
    r'title:\s*(.+)\ncategory:\s*(.+)\npriority:\s*(.+)\n(?:description:\s*(.+)\n)?(?:habilidade:\s*(.+)\n)?',
    re.MULTILINE
)

class TaskIn(BaseModel):
    title: str
    category: str
    priority: str
    habilidade: str = ''
    description: str = ''

# Utilitário para validar campos obrigatórios
def validate_task_data(data):
    required = ['title', 'category', 'priority']
    for field in required:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f'Campo obrigatório ausente: {field}')

# Utilitário para gerar frontmatter YAML
def task_to_markdown(data):
    lines = [
        '---',
        f'title: {data["title"]}',
        f'category: {data["category"]}',
        f'priority: {data["priority"]}',
    ]
    if data.get('description'):
        lines.append(f'description: {data["description"]}')
    if data.get('habilidade'):
        lines.append(f'habilidade: {data["habilidade"]}')
    lines.append('---\n')
    return '\n'.join(lines)

@router.get('/tasks')
def list_tasks():
    tasks = []
    for file in TASKS_DIR.glob('*.md'):
        content = file.read_text(encoding='utf-8')
        match = FRONTMATTER_REGEX.search(content)
        if match:
            tasks.append({
                'file': file.name,
                'title': match.group(1),
                'category': match.group(2),
                'priority': match.group(3),
                'description': match.group(4) if match.lastindex >= 4 else '',
                'habilidade': match.group(5) if match.lastindex >= 5 else '',
            })
    return {'tasks': tasks}

@router.post('/tasks')
def create_task(task: TaskIn):
    validate_task_data(task.dict())
    filename = f'{task.title.lower().replace(" ", "_")}.md'
    file_path = TASKS_DIR / filename
    if file_path.exists():
        raise HTTPException(status_code=409, detail='Task já existe')
    file_path.write_text(task_to_markdown(task.dict()), encoding='utf-8')
    return {'status': 'created', 'file': filename}

@router.put('/tasks/{filename}')
def update_task(filename: str, task: TaskIn):
    file_path = TASKS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail='Task não encontrada')
    validate_task_data(task.dict())
    file_path.write_text(task_to_markdown(task.dict()), encoding='utf-8')
    return {'status': 'updated', 'file': filename}

@router.delete('/tasks/{filename}')
def delete_task(filename: str):
    file_path = TASKS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail='Task não encontrada')
    file_path.unlink()
    return {'status': 'deleted', 'file': filename}

@router.post('/tasks/validate/{filename}')
def validate_task(filename: str):
    file_path = TASKS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail='Task não encontrada')
    content = file_path.read_text(encoding='utf-8')
    match = FRONTMATTER_REGEX.search(content)
    if not match:
        return {'valid': False, 'reason': 'Frontmatter inválido ou campos ausentes'}
    return {'valid': True, 'file': filename}

def send_text_to_chat(text: str) -> dict:
    # Garante envio fiel do texto, preservando estrutura e quebras de linha
    worker_path = os.path.join(os.path.dirname(__file__), '../tools/send_to_chat_worker.py')
    # Usa shlex.quote para garantir que o texto seja passado como um único argumento
    result = subprocess.run([
        'python3',
        worker_path,
        text
    ], capture_output=True, text=True)
    if result.returncode == 0:
        return {"status": "enviado", "output": result.stdout.strip()}
    else:
        return {"error": "Erro ao enviar via worker", "details": result.stderr.strip()}
