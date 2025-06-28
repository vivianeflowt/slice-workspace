"""
API REST para classificação de texto.

Endpoints para classificação usando modelos HuggingFace,
com suporte tanto para classificação padrão quanto zero-shot.
"""

import time
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from server.models import (
    ClassificationRequest,
    ClassificationResponse,
    ErrorResponse,
    BatchRequest,
    BatchResponse,
)
from server.providers.classify import get_cached_provider
from server.constants import REQUEST_TIMEOUT_SECONDS


router = APIRouter(prefix="/api/v1", tags=["classification"])


def get_classification_provider(model_name: Optional[str] = None):
    """Dependency injection para provider de classificação."""
    try:
        provider = get_cached_provider(model_name)
        if not provider.is_loaded():
            if not provider.load_model():
                raise HTTPException(
                    status_code=503,
                    detail=f"Falha ao carregar modelo de classificação: {provider.model_name}"
                )
        return provider
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno no provider de classificação: {str(e)}"
        )


@router.post("/classify", response_model=ClassificationResponse)
async def classify_text(
    request: ClassificationRequest,
    provider = Depends(get_classification_provider)
) -> ClassificationResponse:
    """
    Classifica um texto usando modelo HuggingFace.
    
    Suporta tanto classificação padrão (usando labels do modelo)
    quanto zero-shot classification (com labels personalizados).
    """
    try:
        # Aplica classificação
        result = provider.classify_text(
            text=request.text,
            labels=request.labels,
            top_k=5  # Máximo de 5 predições
        )
        
        return ClassificationResponse(
            predictions=result["predictions"],
            input_text=result["input_text"],
            model_name=result["model_name"],
            processing_time_ms=result["processing_time_ms"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro na classificação: {str(e)}"
        )


@router.post("/classify/batch", response_model=BatchResponse)
async def classify_batch(
    request: BatchRequest,
    provider = Depends(get_classification_provider)
) -> BatchResponse:
    """
    Classifica múltiplos textos em lote.
    
    Mais eficiente que chamadas individuais para grandes volumes.
    """
    try:
        if request.function != "classify":
            raise HTTPException(
                status_code=400,
                detail="Função deve ser 'classify' para este endpoint"
            )
        
        start_time = time.time()
        
        # Processa em lote
        results = provider.batch_classify(
            texts=request.texts,
            labels=None,  # TODO: Adicionar suporte a labels em batch
            top_k=3
        )
        
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
            detail=f"Erro na classificação em lote: {str(e)}"
        )


@router.get("/classify/models")
async def list_classification_models() -> Dict[str, Any]:
    """Lista modelos de classificação disponíveis."""
    from server.constants import DEFAULT_MODELS, ALTERNATIVE_MODELS
    
    return {
        "default_model": DEFAULT_MODELS["classify"],
        "alternative_models": ALTERNATIVE_MODELS["classify"],
        "function": "classify",
        "supports_zero_shot": True,
        "max_labels": 10,
    }


@router.get("/classify/info")
async def get_classification_info(
    provider = Depends(get_classification_provider)
) -> Dict[str, Any]:
    """Retorna informações sobre o modelo de classificação atualmente carregado."""
    return provider.get_model_info()


@router.post("/classify/zero-shot", response_model=ClassificationResponse)
async def zero_shot_classify(
    request: ClassificationRequest,
    provider = Depends(get_classification_provider)
) -> ClassificationResponse:
    """
    Endpoint específico para zero-shot classification.
    
    Requer que labels sejam fornecidos na request.
    """
    if not request.labels or len(request.labels) == 0:
        raise HTTPException(
            status_code=400,
            detail="Labels são obrigatórios para zero-shot classification"
        )
    
    try:
        result = provider.classify_text(
            text=request.text,
            labels=request.labels,
            top_k=len(request.labels)  # Retorna score para todos os labels
        )
        
        return ClassificationResponse(
            predictions=result["predictions"],
            input_text=result["input_text"],
            model_name=result["model_name"],
            processing_time_ms=result["processing_time_ms"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no zero-shot classification: {str(e)}"
        )
