"""
API REST para geração de embeddings.

Endpoints para embeddings usando modelos HuggingFace,
com suporte a sentence-transformers e modelos padrão.
"""

import time
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, Depends
from server.models import (
    EmbeddingRequest,
    EmbeddingResponse,
    BatchRequest,
    BatchResponse,
)
from server.providers.embed import get_cached_provider
from server.constants import REQUEST_TIMEOUT_SECONDS, MAX_BATCH_SIZE


router = APIRouter(prefix="/api/v1", tags=["embeddings"])


def get_embedding_provider(model_name: Optional[str] = None):
    """Dependency injection para provider de embeddings."""
    try:
        provider = get_cached_provider(model_name)
        if not provider.is_loaded():
            if not provider.load_model():
                raise HTTPException(
                    status_code=503,
                    detail=f"Falha ao carregar modelo de embeddings: {provider.model_name}"
                )
        return provider
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno no provider de embeddings: {str(e)}"
        )


@router.post("/embed", response_model=EmbeddingResponse)
async def generate_embedding(
    request: EmbeddingRequest,
    provider = Depends(get_embedding_provider)
) -> EmbeddingResponse:
    """
    Gera embedding para um texto.
    
    Retorna vetor numérico que representa o texto semanticamente.
    """
    try:
        result = provider.generate_single_embedding(
            text=request.text,
            normalize=request.normalize
        )
        
        return EmbeddingResponse(
            embeddings=[result["embedding"]],
            dimensions=result["dimensions"],
            input_text=result["input_text"],
            model_name=result["model_name"],
            processing_time_ms=result["processing_time_ms"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro na geração de embedding: {str(e)}"
        )


@router.post("/embed/batch", response_model=BatchResponse)
async def generate_embeddings_batch(
    request: BatchRequest,
    provider = Depends(get_embedding_provider)
) -> BatchResponse:
    """
    Gera embeddings para múltiplos textos em lote.
    
    Mais eficiente que chamadas individuais para grandes volumes.
    """
    try:
        if request.function != "embed":
            raise HTTPException(
                status_code=400,
                detail="Função deve ser 'embed' para este endpoint"
            )
        
        if len(request.texts) > MAX_BATCH_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Máximo de {MAX_BATCH_SIZE} textos por lote"
            )
        
        start_time = time.time()
        
        # Gera embeddings em lote
        result = provider.generate_embeddings(
            texts=request.texts,
            normalize=True  # Padrão normalizado
        )
        
        # Converte para formato de batch response
        batch_results = []
        for i, (text, embedding) in enumerate(zip(request.texts, result["embeddings"])):
            batch_results.append({
                "input_text": text,
                "embedding": embedding,
                "dimensions": result["dimensions"],
                "index": i,
            })
        
        total_time = (time.time() - start_time) * 1000
        
        return BatchResponse(
            results=batch_results,
            total_processed=len(request.texts),
            processing_time_ms=total_time,
            model_name=provider.model_name,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro na geração de embeddings em lote: {str(e)}"
        )


@router.post("/embed/similarity")
async def compute_similarity(
    text1: str,
    text2: str,
    normalize: bool = True,
    provider = Depends(get_embedding_provider)
) -> Dict[str, Any]:
    """
    Calcula similaridade cosine entre dois textos.
    
    Retorna valor entre -1 e 1, onde 1 indica máxima similaridade.
    """
    try:
        result = provider.compute_similarity(
            text1=text1,
            text2=text2,
            normalize=normalize
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no cálculo de similaridade: {str(e)}"
        )


@router.post("/embed/multi", response_model=EmbeddingResponse)
async def generate_multiple_embeddings(
    texts: List[str],
    normalize: bool = True,
    provider = Depends(get_embedding_provider)
) -> EmbeddingResponse:
    """
    Gera embeddings para múltiplos textos (endpoint simplificado).
    
    Diferente do batch, este retorna formato padrão EmbeddingResponse.
    """
    try:
        if len(texts) > MAX_BATCH_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Máximo de {MAX_BATCH_SIZE} textos por vez"
            )
        
        result = provider.generate_embeddings(
            texts=texts,
            normalize=normalize
        )
        
        # Para múltiplos textos, concatena como input
        combined_text = " | ".join(texts[:3])  # Primeiros 3 para preview
        if len(texts) > 3:
            combined_text += f" ... (+{len(texts)-3} textos)"
        
        return EmbeddingResponse(
            embeddings=result["embeddings"],
            dimensions=result["dimensions"],
            input_text=combined_text,
            model_name=result["model_name"],
            processing_time_ms=result["processing_time_ms"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro na geração de múltiplos embeddings: {str(e)}"
        )


@router.get("/embed/models")
async def list_embedding_models() -> Dict[str, Any]:
    """Lista modelos de embeddings disponíveis."""
    from server.constants import DEFAULT_MODELS, ALTERNATIVE_MODELS
    
    return {
        "default_model": DEFAULT_MODELS["embed"],
        "alternative_models": ALTERNATIVE_MODELS["embed"],
        "function": "embed",
        "supports_similarity": True,
        "supports_normalization": True,
        "max_batch_size": MAX_BATCH_SIZE,
    }


@router.get("/embed/info")
async def get_embedding_info(
    provider = Depends(get_embedding_provider)
) -> Dict[str, Any]:
    """Retorna informações sobre o modelo de embeddings atualmente carregado."""
    return provider.get_model_info()
