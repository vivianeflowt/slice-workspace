"""Endpoints para text completions."""

from fastapi import APIRouter, HTTPException, Depends
from ..models import CompletionRequest
from ..services import CommandRService

completions_router = APIRouter()


def get_command_r_service():
    """Dependency para obter o serviço Command-R."""
    from ..main import get_command_r_service
    return get_command_r_service()


@completions_router.post("/completions")
async def create_completion(
    request: CompletionRequest,
    service: CommandRService = Depends(get_command_r_service)
):
    """Cria uma text completion."""
    try:
        if not service.is_model_loaded():
            raise HTTPException(
                status_code=503,
                detail="Modelo não está carregado"
            )
        
        # TODO: Implementar text completion
        # Por enquanto retorna uma resposta simulada
        return {
            "id": "cmpl-123",
            "object": "text_completion",
            "created": 1234567890,
            "model": request.model,
            "choices": [{
                "text": f"Completion para: {request.prompt}",
                "index": 0,
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 10,
                "completion_tokens": 20,
                "total_tokens": 30
            }
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
