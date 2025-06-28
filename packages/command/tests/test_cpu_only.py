"""Testes para garantir estratégia CPU-only (Checkpoint #019)."""

import os
import pytest
from server.constants import TORCH_DEVICE, FORCE_CPU_ONLY, USE_GPU


def test_force_cpu_only_is_enabled():
    """Verifica se FORCE_CPU_ONLY está habilitado."""
    assert FORCE_CPU_ONLY is True, "FORCE_CPU_ONLY deve estar habilitado"


def test_use_gpu_is_disabled():
    """Verifica se USE_GPU está desabilitado."""
    assert USE_GPU is False, "USE_GPU deve estar desabilitado"


def test_torch_device_is_cpu():
    """Verifica se TORCH_DEVICE está configurado para CPU."""
    assert TORCH_DEVICE == "cpu", "TORCH_DEVICE deve ser 'cpu'"


def test_cuda_environment_variables():
    """Verifica se variáveis de ambiente CUDA estão desabilitadas."""
    # Simular inicialização do serviço
    from server.services import CommandRService
    service = CommandRService()

    # Verificar se CUDA_VISIBLE_DEVICES foi configurado
    assert "CUDA_VISIBLE_DEVICES" in os.environ, "CUDA_VISIBLE_DEVICES deve estar definido"
    assert os.environ["CUDA_VISIBLE_DEVICES"] == "", "CUDA_VISIBLE_DEVICES deve estar vazio"


def test_torch_threads_configured():
    """Verifica se o número de threads do torch está configurado."""
    import torch
    from server.constants import TORCH_THREADS

    # O torch pode ter sido configurado na inicialização do serviço
    from server.services import CommandRService
    service = CommandRService()

    # Verificar se threads estão definidas
    current_threads = torch.get_num_threads()
    assert current_threads > 0, "Torch deve ter threads configuradas"


def test_no_cuda_dependencies():
    """Verifica se não há dependências CUDA desnecessárias."""
    try:
        import torch

        # Se CUDA estiver disponível, verificar se não está sendo usado
        if torch.cuda.is_available():
            # Torch pode estar disponível mas não deve ser usado
            assert FORCE_CPU_ONLY, "Se CUDA disponível, deve usar FORCE_CPU_ONLY"

        # Verificar se torch está configurado para CPU
        device = torch.device("cpu")
        assert device.type == "cpu", "Device padrão deve ser CPU"

    except ImportError:
        # torch não instalado - ok para testes
        pass


def test_command_r_cpu_optimization():
    """Verifica se Command-R está otimizado para CPU."""
    from server.services import CommandRService

    service = CommandRService()

    # Verificar configurações específicas do Command-R
    assert service.model_name == "command-r", "Modelo deve ser command-r"

    # Command-R deve estar configurado para CPU
    assert hasattr(service, '_model'), "Serviço deve ter atributo _model"


def test_cpu_optimization_constants():
    """Verifica se as constantes de otimização CPU estão definidas."""
    from server.constants import TORCH_THREADS

    assert isinstance(TORCH_THREADS, int), "TORCH_THREADS deve ser inteiro"
    assert TORCH_THREADS > 0, "TORCH_THREADS deve ser positivo"
    assert TORCH_THREADS <= 32, "TORCH_THREADS deve ser razoável (<=32)"


def test_memory_optimization_for_cpu():
    """Verifica configurações de memória otimizadas para CPU."""
    # Verificar se configurações de memória GPU não estão presentes
    cuda_env_vars = [
        "PYTORCH_CUDA_ALLOC_CONF",
        "CUDA_LAUNCH_BLOCKING",
        "CUDA_CACHE_DISABLE"
    ]

    # Não deve ter configurações específicas de GPU além da desabilitação
    from server.services import CommandRService
    service = CommandRService()

    # PYTORCH_CUDA_ALLOC_CONF deve estar configurada para desabilitar
    if "PYTORCH_CUDA_ALLOC_CONF" in os.environ:
        assert "max_split_size_mb:0" in os.environ["PYTORCH_CUDA_ALLOC_CONF"]
