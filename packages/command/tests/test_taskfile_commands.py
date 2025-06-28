import subprocess
import os

def test_task_dev_runs():
    result = subprocess.run([
        'task', 'dev', '--dry'
    ], cwd=os.path.dirname(os.path.dirname(__file__)), capture_output=True, text=True)
    assert result.returncode == 0

def test_task_lint_runs():
    result = subprocess.run([
        'task', 'lint', '--dry'
    ], cwd=os.path.dirname(os.path.dirname(__file__)), capture_output=True, text=True)
    assert result.returncode == 0
