"""Endpoints para listagem de modelos."""

import time
from fastapi import APIRouter
from ..models import ModelsResponse, ModelInfo
from ..constants import MODEL_NAME

models_router = APIRouter()


@models_router.get("/models", response_model=ModelsResponse)
async def list_models():
    """Lista os modelos disponíveis."""
    models = [
        ModelInfo(
            id=MODEL_NAME,
            created=int(time.time()),
            owned_by="slice"
        )
    ]

    return ModelsResponse(data=models)
