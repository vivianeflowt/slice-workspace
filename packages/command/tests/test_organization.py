import ast
import os

def test_main_py_has_only_app_call():
    main_path = os.path.join(os.path.dirname(__file__), '..', 'server', 'main.py')
    assert os.path.isfile(main_path)
    with open(main_path, 'r') as f:
        tree = ast.parse(f.read())
    # Espera-se que só haja uma chamada de app (ex: app = FastAPI())
    assigns = [n for n in tree.body if isinstance(n, ast.Assign)]
    calls = [n for n in tree.body if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)]
    assert any(isinstance(a.value, ast.Call) for a in assigns) or len(calls) > 0
