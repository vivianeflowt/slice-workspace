import importlib.util
import os

def test_default_port_constant_exists():
    constants_path = os.path.join(os.path.dirname(__file__), '..', 'server', 'constants.py')
    spec = importlib.util.spec_from_file_location('constants', constants_path)
    constants = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(constants)
    assert hasattr(constants, 'SERVER_PORT') or hasattr(constants, 'DEFAULT_PORT')
