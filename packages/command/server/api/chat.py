"""Endpoints para chat completions."""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from ..models import ChatCompletionRequest, ChatCompletionResponse
from ..services import CommandRService

chat_router = APIRouter()


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
                status_code=503,
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
            return response
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
