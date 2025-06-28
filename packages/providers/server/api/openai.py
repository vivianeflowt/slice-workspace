"""
API OpenAI-like para geração de texto (chat/completions) e listagem de modelos.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from providers.generate.deepseek import DeepSeekProvider
from providers.generate.amthinking import AMThinkingProvider
from server.constants import DEFAULT_MODELS

router = APIRouter(prefix="/v1", tags=["openai-compatible"])

class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[Message]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95
    # Outros campos OpenAI podem ser adicionados conforme necessário

@router.post("/chat/completions")
def chat_completions(request: ChatCompletionRequest) -> Dict[str, Any]:
    model = request.model
    messages = [m.dict() for m in request.messages]
    max_tokens = request.max_tokens
    temperature = request.temperature
    top_p = request.top_p

    # Roteamento dinâmico para o provider correto
    if model == "deepseek-r1-qwen-7b":
        provider = DeepSeekProvider()
    elif model == "am-thinking-v1":
        provider = AMThinkingProvider()
    else:
        raise HTTPException(status_code=400, detail=f"Modelo não suportado: {model}")

    try:
        result = provider.generate(
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na geração: {str(e)}")

@router.get("/models")
def list_models() -> Dict[str, Any]:
    # Retorna a lista de modelos disponíveis no padrão OpenAI
    models = [
        {"id": key, "object": "model", "owned_by": "provider"}
        for key in DEFAULT_MODELS.keys()
        if key not in ("classify", "embed", "pos_tag")
    ]
    return {"object": "list", "data": models}
