"""Aplicação principal do servidor Command-R."""

import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_config
from .services import CommandRService
from .constants import SERVER_NAME, API_VERSION, OPENAI_API_BASE_PATH
from .api.chat import chat_router
from .api.completions import completions_router
from .api.models import models_router
from .api.health import health_router

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Instância global do serviço
command_r_service = CommandRService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação."""
    # Startup
    logger.info("Iniciando servidor Command-R...")
    config = get_config()
    
    try:
        # Carregar modelo
        logger.info("Carregando modelo Command-R...")
        await command_r_service.load_model()
        logger.info("Modelo Command-R carregado com sucesso!")
        
        yield
        
    except Exception as e:
        logger.error(f"Erro ao carregar modelo: {e}")
        raise
    finally:
        # Shutdown
        logger.info("Descarregando modelo Command-R...")
        await command_r_service.unload_model()
        logger.info("Servidor Command-R finalizado")


def create_app() -> FastAPI:
    """Cria e configura a aplicação FastAPI."""
    app = FastAPI(
        title=SERVER_NAME,
        description="Servidor Command-R compatível com OpenAI API",
        version=API_VERSION,
        lifespan=lifespan
    )
    
    # Middleware CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Exception handler global
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        logger.error(f"Erro não tratado: {exc}")
        return JSONResponse(
            status_code=500,
            content={"error": {"message": "Erro interno do servidor", "type": "internal_error"}}
        )
    
    # Registrar routers
    app.include_router(health_router, prefix="", tags=["health"])
    app.include_router(chat_router, prefix=OPENAI_API_BASE_PATH, tags=["chat"])
    app.include_router(completions_router, prefix=OPENAI_API_BASE_PATH, tags=["completions"])
    app.include_router(models_router, prefix=OPENAI_API_BASE_PATH, tags=["models"])
    
    return app


# Instância da aplicação
app = create_app()


def get_command_r_service() -> CommandRService:
    """Retorna a instância do serviço Command-R."""
    return command_r_service
