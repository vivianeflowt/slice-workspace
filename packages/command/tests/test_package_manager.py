import os

def test_pyproject_toml_exists():
    project_root = os.path.join(os.path.dirname(__file__), '..')
    assert os.path.isfile(os.path.join(project_root, 'pyproject.toml'))
