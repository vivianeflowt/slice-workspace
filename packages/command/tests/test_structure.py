import os

def test_server_and_tests_dirs_exist():
    assert os.path.isdir(os.path.join(os.path.dirname(__file__), '..', 'server'))
    assert os.path.isdir(os.path.join(os.path.dirname(__file__), '..', 'tests'))
