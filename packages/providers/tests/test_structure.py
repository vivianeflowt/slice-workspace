"""
Teste de estrutura e layout do projeto.

Valida que todas as pastas e arquivos essenciais estão presentes,
seguindo as especificações do PROJECT.md e TASKS.md.
"""

import os
from pathlib import Path

import pytest


class TestProjectStructure:
    """Testes de estrutura do projeto."""

    def setup_method(self):
        """Setup para cada teste."""
        self.project_root = Path(__file__).parent.parent

    def test_root_files_exist(self):
        """Verifica se arquivos essenciais da raiz existem."""
        required_files = [
            "pyproject.toml",
            "Taskfile.yml",
            "PROJECT.md",
            "TASKS.md",
        ]

        for file_name in required_files:
            file_path = self.project_root / file_name
            assert (
                file_path.exists()
            ), f"Arquivo obrigatório não encontrado: {file_name}"

    def test_server_structure_exists(self):
        """Verifica se estrutura do servidor existe."""
        required_dirs = [
            "server",
            "server/api",
            "server/models",
            "server/providers",
            "server/providers/classify",
            "server/providers/embed",
            "server/providers/pos_tag",
            "server/services",
            "server/utils",
            "tests",
        ]

        for dir_name in required_dirs:
            dir_path = self.project_root / dir_name
            assert (
                dir_path.exists()
            ), f"Diretório obrigatório não encontrado: {dir_name}"
            assert dir_path.is_dir(), f"{dir_name} deve ser um diretório"

    def test_init_files_exist(self):
        """Verifica se arquivos __init__.py existem onde necessário."""
        required_init_files = [
            "server/__init__.py",
            "server/api/__init__.py",
            "server/models/__init__.py",
            "server/providers/__init__.py",
            "server/providers/classify/__init__.py",
            "server/providers/embed/__init__.py",
            "server/providers/pos_tag/__init__.py",
            "server/services/__init__.py",
            "server/utils/__init__.py",
            "tests/__init__.py",
        ]

        for init_file in required_init_files:
            init_path = self.project_root / init_file
            assert (
                init_path.exists()
            ), f"Arquivo __init__.py não encontrado: {init_file}"

    def test_core_modules_exist(self):
        """Verifica se módulos principais existem."""
        required_modules = [
            "server/constants.py",
            "server/main.py",
            "server/api/classify.py",
            "server/api/embed.py",
            "server/api/pos_tag.py",
            "server/providers/classify/huggingface.py",
            "server/providers/embed/huggingface.py",
            "server/providers/pos_tag/huggingface.py",
            "server/utils/model_downloader.py",
        ]

        for module in required_modules:
            module_path = self.project_root / module
            assert module_path.exists(), f"Módulo obrigatório não encontrado: {module}"
            assert module_path.is_file(), f"{module} deve ser um arquivo"

    def test_functional_organization(self):
        """Verifica organização funcional (não por modelo)."""
        providers_dir = self.project_root / "server/providers"

        # Deve ter diretórios por função
        required_functions = ["classify", "embed", "pos_tag"]
        for function in required_functions:
            function_dir = providers_dir / function
            assert (
                function_dir.exists()
            ), f"Diretório de função não encontrado: {function}"

        # Não deve ter diretórios nomeados por modelo
        forbidden_patterns = ["bert", "distilbert", "roberta", "gpt"]
        for item in providers_dir.iterdir():
            if item.is_dir():
                for pattern in forbidden_patterns:
                    assert pattern not in item.name.lower(), (
                        f"Diretório nomeado por modelo encontrado: {item.name}. "
                        f"Use organização funcional, não por modelo."
                    )

    def test_no_magic_numbers_in_main_files(self):
        """Verifica ausência de números mágicos em arquivos principais."""
        main_files = [
            "server/main.py",
            "server/api/classify.py",
            "server/api/embed.py",
            "server/api/pos_tag.py",
        ]

        magic_number_patterns = [
            "5115",  # Deve vir de constants.py
            "8192",  # Deve vir de constants.py
            "3600",  # Deve vir de constants.py
        ]

        for file_path in main_files:
            full_path = self.project_root / file_path
            if full_path.exists():
                content = full_path.read_text()

                for pattern in magic_number_patterns:
                    # Ignora comentários e imports de constants
                    lines = content.split("\n")
                    for line_num, line in enumerate(lines, 1):
                        if pattern in line and not line.strip().startswith("#"):
                            if "constants" not in line.lower():
                                pytest.fail(
                                    f"Número mágico '{pattern}' encontrado em {file_path}:{line_num}. "
                                    f"Use constants.py: {line.strip()}"
                                )

    def test_imports_are_valid(self):
        """Verifica se imports principais são válidos."""
        import_tests = [
            ("server.constants", ["DEFAULT_MODELS", "SERVER_PORT"]),
            ("server.models", ["ClassificationRequest", "EmbeddingResponse"]),
            ("server.providers.classify", ["get_cached_provider"]),
            ("server.providers.embed", ["get_cached_provider"]),
            ("server.providers.pos_tag", ["get_cached_provider"]),
        ]

        for module_name, expected_attrs in import_tests:
            try:
                import sys

                sys.path.insert(0, str(self.project_root))

                module = __import__(module_name, fromlist=expected_attrs)

                for attr in expected_attrs:
                    assert hasattr(
                        module, attr
                    ), f"Atributo '{attr}' não encontrado em {module_name}"
            except ImportError as e:
                pytest.fail(f"Erro ao importar {module_name}: {str(e)}")
            finally:
                if str(self.project_root) in sys.path:
                    sys.path.remove(str(self.project_root))


class TestTaskfileValidation:
    """Testes específicos do Taskfile.yml."""

    def setup_method(self):
        """Setup para cada teste."""
        self.project_root = Path(__file__).parent.parent
        self.taskfile_path = self.project_root / "Taskfile.yml"

    def test_taskfile_exists(self):
        """Verifica se Taskfile.yml existe."""
        assert self.taskfile_path.exists(), "Taskfile.yml não encontrado"

    def test_required_tasks_exist(self):
        """Verifica se tasks obrigatórias existem."""
        content = self.taskfile_path.read_text()

        required_tasks = [
            "install",
            "dev",
            "start",
            "test",
            "lint",
            "clean",
        ]

        for task in required_tasks:
            assert f"{task}:" in content, f"Task obrigatória não encontrada: {task}"

    def test_taskfile_syntax(self):
        """Verifica sintaxe básica do Taskfile.yml."""
        try:
            import yaml

            content = self.taskfile_path.read_text()
            yaml.safe_load(content)
        except ImportError:
            pytest.skip("PyYAML não disponível para teste de sintaxe")
        except yaml.YAMLError as e:
            pytest.fail(f"Erro de sintaxe no Taskfile.yml: {str(e)}")


class TestPyprojectValidation:
    """Testes específicos do pyproject.toml."""

    def setup_method(self):
        """Setup para cada teste."""
        self.project_root = Path(__file__).parent.parent
        self.pyproject_path = self.project_root / "pyproject.toml"

    def test_pyproject_exists(self):
        """Verifica se pyproject.toml existe."""
        assert self.pyproject_path.exists(), "pyproject.toml não encontrado"

    def test_required_dependencies(self):
        """Verifica se dependências obrigatórias estão presentes."""
        content = self.pyproject_path.read_text()

        required_deps = [
            "fastapi",
            "uvicorn",
            "pydantic",
            "transformers",
            "torch",
            "pytest",
        ]

        for dep in required_deps:
            assert dep in content, f"Dependência obrigatória não encontrada: {dep}"

    def test_pyproject_syntax(self):
        """Verifica sintaxe básica do pyproject.toml."""
        try:
            import tomli

            content = self.pyproject_path.read_text()
            tomli.loads(content)
        except ImportError:
            # Fallback para tomllib (Python 3.11+)
            try:
                import tomllib

                content = self.pyproject_path.read_text()
                tomllib.loads(content)
            except ImportError:
                pytest.skip("tomli/tomllib não disponível para teste de sintaxe")
        except Exception as e:
            pytest.fail(f"Erro de sintaxe no pyproject.toml: {str(e)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
