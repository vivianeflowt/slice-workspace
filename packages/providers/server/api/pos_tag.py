"""
API REST para POS tagging (Part-of-Speech).

Endpoints para análise morfossintática usando modelos HuggingFace.
"""

import time
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from server.models import (
    PosTagRequest,
    PosTagResponse,
    BatchRequest,
    BatchResponse,
)
from server.providers.pos_tag import get_cached_provider
from server.constants import REQUEST_TIMEOUT_SECONDS, MAX_BATCH_SIZE


router = APIRouter(prefix="/api/v1", tags=["pos_tagging"])


def get_pos_tag_provider(model_name: Optional[str] = None):
    """Dependency injection para provider de POS tagging."""
    try:
        provider = get_cached_provider(model_name)
        if not provider.is_loaded():
            if not provider.load_model():
                raise HTTPException(
                    status_code=503,
                    detail=f"Falha ao carregar modelo de POS tagging: {provider.model_name}"
                )
        return provider
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno no provider de POS tagging: {str(e)}"
        )


@router.post("/pos-tag", response_model=PosTagResponse)
async def tag_text(
    request: PosTagRequest,
    provider = Depends(get_pos_tag_provider)
) -> PosTagResponse:
    """
    Aplica POS tagging em um texto.
    
    Retorna cada token com sua respectiva tag morfossintática.
    """
    try:
        result = provider.tag_text(
            text=request.text,
            return_confidence=True,
            aggregate_subwords=True
        )
        
        return PosTagResponse(
            tokens=result["tokens"],
            input_text=result["input_text"],
            model_name=result["model_name"],
            processing_time_ms=result["processing_time_ms"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no POS tagging: {str(e)}"
        )


@router.post("/pos-tag/batch", response_model=BatchResponse)
async def tag_batch(
    request: BatchRequest,
    provider = Depends(get_pos_tag_provider)
) -> BatchResponse:
    """
    Aplica POS tagging em múltiplos textos em lote.
    
    Mais eficiente que chamadas individuais para grandes volumes.
    """
    try:
        if request.function != "pos_tag":
            raise HTTPException(
                status_code=400,
                detail="Função deve ser 'pos_tag' para este endpoint"
            )
        
        if len(request.texts) > MAX_BATCH_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Máximo de {MAX_BATCH_SIZE} textos por lote"
            )
        
        start_time = time.time()
        
        # Processa em lote
        results = provider.batch_tag(request.texts)
        
        total_time = (time.time() - start_time) * 1000
        
        return BatchResponse(
            results=results,
            total_processed=len(request.texts),
            processing_time_ms=total_time,
            model_name=provider.model_name,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no POS tagging em lote: {str(e)}"
        )


@router.post("/pos-tag/analyze")
async def analyze_sentence_structure(
    text: str,
    provider = Depends(get_pos_tag_provider)
) -> Dict[str, Any]:
    """
    Analisa estrutura sintática básica da sentença.
    
    Retorna análise estrutural além das tags POS individuais.
    """
    try:
        result = provider.analyze_sentence_structure(text)
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro na análise estrutural: {str(e)}"
        )


@router.get("/pos-tag/tags")
async def get_supported_tags(
    provider = Depends(get_pos_tag_provider)
) -> Dict[str, Any]:
    """
    Lista todas as tags POS suportadas pelo modelo.
    
    Retorna mapeamento de tags técnicas para descrições em português.
    """
    try:
        tags = provider.get_supported_tags()
        
        return {
            "supported_tags": tags,
            "total_tags": len(tags),
            "language": "pt",
            "model_name": provider.model_name,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar tags: {str(e)}"
        )


@router.get("/pos-tag/models")
async def list_pos_tag_models() -> Dict[str, Any]:
    """Lista modelos de POS tagging disponíveis."""
    from server.constants import DEFAULT_MODELS, ALTERNATIVE_MODELS
    
    return {
        "default_model": DEFAULT_MODELS["pos_tag"],
        "alternative_models": ALTERNATIVE_MODELS["pos_tag"],
        "function": "pos_tag",
        "language": "pt",
        "supports_analysis": True,
        "max_batch_size": MAX_BATCH_SIZE,
    }


@router.get("/pos-tag/info")
async def get_pos_tag_info(
    provider = Depends(get_pos_tag_provider)
) -> Dict[str, Any]:
    """Retorna informações sobre o modelo de POS tagging atualmente carregado."""
    return provider.get_model_info()
