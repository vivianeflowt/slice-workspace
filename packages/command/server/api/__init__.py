"""Módulo API com todos os endpoints."""

from .chat import chat_router
from .completions import completions_router
from .models import models_router
from .health import health_router

__all__ = ["chat_router", "completions_router", "models_router", "health_router"]
