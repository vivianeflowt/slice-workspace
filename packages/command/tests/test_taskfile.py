"""Testes para validar o Taskfile (Checkpoint #002 e #010)."""

import subprocess
import os
import pytest
import yaml


def test_task_install_runs():
    """Testa se task install executa sem erro."""
    result = subprocess.run([
        'task', 'install'
    ], cwd=os.path.dirname(os.path.dirname(__file__)), capture_output=True, text=True)
    assert result.returncode == 0


def test_taskfile_exists():
    """Verifica se o Taskfile.yml existe."""
    assert os.path.exists("Taskfile.yml"), "Taskfile.yml deve existir"


def test_taskfile_is_valid_yaml():
    """Verifica se o Taskfile.yml é um YAML válido."""
    with open("Taskfile.yml", 'r') as f:
        try:
            yaml.safe_load(f)
        except yaml.YAMLError as e:
            pytest.fail(f"Taskfile.yml não é um YAML válido: {e}")


def test_required_tasks_exist():
    """Verifica se as tasks obrigatórias existem."""
    with open("Taskfile.yml", 'r') as f:
        taskfile = yaml.safe_load(f)

    required_tasks = ["install", "dev", "start", "test", "lint", "clean"]
    tasks = taskfile.get("tasks", {})

    for task in required_tasks:
        assert task in tasks, f"Task '{task}' deve existir no Taskfile"


def test_install_task_has_model_download():
    """Verifica se a task install inclui download de modelos."""
    with open("Taskfile.yml", 'r') as f:
        taskfile = yaml.safe_load(f)

    install_task = taskfile["tasks"]["install"]
    cmds = install_task.get("cmds", [])

    # Deve incluir pdm install e download de modelos
    has_pdm_install = any("pdm install" in str(cmd) for cmd in cmds)
    has_model_download = any("download-models" in str(cmd) or "model" in str(cmd).lower() for cmd in cmds)

    assert has_pdm_install, "Task install deve incluir 'pdm install'"
    assert has_model_download, "Task install deve incluir download de modelos"


def test_dev_task_uses_correct_port():
    """Verifica se a task dev usa a porta correta."""
    with open("Taskfile.yml", 'r') as f:
        taskfile = yaml.safe_load(f)

    dev_task = taskfile["tasks"]["dev"]
    cmds = dev_task.get("cmds", [])

    # Deve usar a porta 5143 conforme constants.py
    has_correct_port = any("5143" in str(cmd) for cmd in cmds)
    assert has_correct_port, "Task dev deve usar porta 5143"
