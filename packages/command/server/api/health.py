"""Endpoints para health check."""

from fastapi import APIRouter, Depends
from ..services import CommandRService

health_router = APIRouter()


def get_command_r_service():
    """Dependency para obter o serviço Command-R."""
    from ..main import get_command_r_service
    return get_command_r_service()


@health_router.get("/health")
async def health_check(service: CommandRService = Depends(get_command_r_service)):
    """Verifica o status de saúde do servidor."""
    return {
        "status": "healthy",
        "model_loaded": service.is_model_loaded(),
        "service": "command-r-server"
    }


@health_router.get("/")
async def root():
    """Endpoint raiz."""
    return {
        "message": "Slice Command-R Server",
        "status": "running",
        "docs": "/docs"
    }
