import subprocess
import os

def test_task_install_runs():
    result = subprocess.run([
        'task', 'install'
    ], cwd=os.path.dirname(os.path.dirname(__file__)), capture_output=True, text=True)
    assert result.returncode == 0
