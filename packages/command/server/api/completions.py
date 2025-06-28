"""Endpoints para text completions."""

from fastapi import APIRouter, HTTPException, Depends
from ..models import CompletionRequest
from ..services import CommandRService
from server.constants import INTERNAL_ERROR_CODE, BAD_REQUEST_ERROR_CODE, SERVICE_UNAVAILABLE_ERROR_CODE, COMPLETION_ID_EXAMPLE, CREATED_TIMESTAMP_EXAMPLE, PROMPT_TOKENS_EXAMPLE, COMPLETION_TOKENS_EXAMPLE, TOTAL_TOKENS_EXAMPLE

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
                status_code=SERVICE_UNAVAILABLE_ERROR_CODE,
                detail="Modelo não está carregado"
            )

        # TODO: Implementar text completion
        # Por enquanto retorna uma resposta simulada
        return {
            "id": COMPLETION_ID_EXAMPLE,
            "object": "text_completion",
            "created": CREATED_TIMESTAMP_EXAMPLE,
            "model": request.model,
            "choices": [{
                "text": f"Completion para: {request.prompt}",
                "index": 0,
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": PROMPT_TOKENS_EXAMPLE,
                "completion_tokens": COMPLETION_TOKENS_EXAMPLE,
                "total_tokens": TOTAL_TOKENS_EXAMPLE
            }
        }

    except ValueError as e:
        raise HTTPException(status_code=BAD_REQUEST_ERROR_CODE, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=SERVICE_UNAVAILABLE_ERROR_CODE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=INTERNAL_ERROR_CODE, detail=f"Erro interno: {str(e)}")
