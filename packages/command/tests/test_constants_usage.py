import os
import re

def test_no_magic_numbers():
    project_root = os.path.join(os.path.dirname(__file__), '..', 'server')
    magic_number_pattern = re.compile(r'[^\w]([1-9][0-9]{2,}|[1-9][0-9])[^\w]')
    allowed_files = {'constants.py', '__init__.py'}
    for root, _, files in os.walk(project_root):
        for file in files:
            if file.endswith('.py') and file not in allowed_files:
                with open(os.path.join(root, file), 'r') as f:
                    content = f.read()
                    matches = magic_number_pattern.findall(content)
                    assert not matches, f"Números mágicos encontrados em {file}: {matches}"
