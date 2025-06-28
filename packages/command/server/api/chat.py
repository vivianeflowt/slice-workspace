"""Endpoints para chat completions."""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from ..models import ChatCompletionRequest, ChatCompletionResponse
from ..services import CommandRService
from server.constants import INTERNAL_ERROR_CODE, BAD_REQUEST_ERROR_CODE, SERVICE_UNAVAILABLE_ERROR_CODE
from pydantic import ValidationError
import logging

chat_router = APIRouter()
logger = logging.getLogger(__name__)


def get_command_r_service():
    """Dependency para obter o serviço Command-R."""
    from ..main import get_command_r_service
    return get_command_r_service()


@chat_router.post("/chat/completions", response_model=ChatCompletionResponse)
async def create_chat_completion(
    request: ChatCompletionRequest,
    service: CommandRService = Depends(get_command_r_service)
):
    """Cria uma resposta de chat completion."""
    try:
        if not service.is_model_loaded():
            raise HTTPException(
                status_code=SERVICE_UNAVAILABLE_ERROR_CODE,
                detail="Modelo não está carregado"
            )

        if request.stream:
            # Retornar streaming response
            return StreamingResponse(
                service.stream_chat_completion(request),
                media_type="text/plain",
                headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
            )
        else:
            # Retornar resposta completa
            response = await service.chat_completion(request)
            return response.dict() if hasattr(response, 'dict') else response

    except HTTPException as e:
        raise e
    except ValueError as e:
        raise HTTPException(status_code=BAD_REQUEST_ERROR_CODE, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=SERVICE_UNAVAILABLE_ERROR_CODE, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=BAD_REQUEST_ERROR_CODE, detail=str(e))
    except Exception as e:
        logger.error(f"Erro detalhado no endpoint /v1/chat/completions: {e}")
        raise HTTPException(status_code=INTERNAL_ERROR_CODE, detail=f"Erro interno: {str(e)}")
