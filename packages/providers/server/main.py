"""
🏭 Servidor Principal FastAPI - Slice/ALIVE Providers Server

Implementa padrões enterprise:
- Validação Forte com schemas Pydantic
- Compatibilidade OpenAI API
- Health checks robustos
- Logging estruturado
- Isolamento por função (não por modelo)
- CPU-only enforced

Baseado em: /docs/CONCEPTS.md - todos os conceitos fundamentais
"""

import logging
import time
from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

# APIs modulares
from server.api.classify import router as classify_router
from server.api.embed import router as embed_router
from server.api.pos_tag import router as pos_tag_router
from server.api.openai import router as openai_router
from server.constants import (
    DEBUG_MODE,
    DEFAULT_MODELS,
    FORCE_CPU_ONLY,
    HEALTH_CHECK_ENDPOINTS,
    LOG_LEVEL,
    SERVER_HOST,
    SERVER_PORT,
)
from server.utils.config_utils import get_server_config

# Modelos e constantes
from server.models import ErrorDetail, ErrorResponse, HealthCheckResponse

# Configuração de logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Criação da aplicação FastAPI
app = FastAPI(
    title="Slice Providers - HuggingFace NLP Server",
    description="""
    Servidor de Providers HuggingFace para o ecossistema Slice/ALIVE.

    Fornece modelos de NLP em português via API REST, incluindo:
    - 🎯 **Classificação de texto** (padrão e zero-shot)
    - 🧠 **Geração de embeddings** (sentence-transformers e BERT)
    - 📝 **POS tagging** (análise morfossintática)

    Todos os modelos rodam 100% em CPU, garantindo compatibilidade universal.
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log de todas as requests com timing."""
    start_time = time.time()

    # Log da request
    logger.info(f"🔄 {request.method} {request.url.path}")

    try:
        # Processa request
        response = await call_next(request)

        # Calcula tempo de processamento
        process_time = (time.time() - start_time) * 1000

        # Log da response
        logger.info(
            f"✅ {request.method} {request.url.path} - "
            f"{response.status_code} - {process_time:.2f}ms"
        )

        # Adiciona header de timing
        response.headers["X-Process-Time"] = str(process_time)

        return response

    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.error(
            f"❌ {request.method} {request.url.path} - "
            f"ERROR - {process_time:.2f}ms - {str(e)}"
        )
        raise


# Registra routers modulares
app.include_router(classify_router)
app.include_router(embed_router)
app.include_router(pos_tag_router)
app.include_router(openai_router)


# =============================================================================
# ENDPOINTS DE SISTEMA
# =============================================================================


@app.get("/", include_in_schema=False)
async def root():
    """Endpoint raiz com informações básicas."""
    return {
        "service": "Slice Providers - HuggingFace NLP Server",
        "version": "0.1.0",
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
        "health": "/health",
        "models": {
            "classify": DEFAULT_MODELS["classify"],
            "embed": DEFAULT_MODELS["embed"],
            "pos_tag": DEFAULT_MODELS["pos_tag"],
        },
    }


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check completo do serviço."""
    try:
        # Verifica status dos providers
        provider_status = {}

        # Testa provider de classificação
        try:
            from server.providers.classify import (
                get_cached_provider as get_classify_provider,
            )

            classify_provider = get_classify_provider()
            provider_status["classify"] = "available" if classify_provider else "error"
        except Exception:
            provider_status["classify"] = "error"

        # Testa provider de embeddings
        try:
            from server.providers.embed import get_cached_provider as get_embed_provider

            embed_provider = get_embed_provider()
            provider_status["embed"] = "available" if embed_provider else "error"
        except Exception:
            provider_status["embed"] = "error"

        # Testa provider de POS tagging
        try:
            from server.providers.pos_tag import get_cached_provider as get_pos_provider

            pos_provider = get_pos_provider()
            provider_status["pos_tag"] = "available" if pos_provider else "error"
        except Exception:
            provider_status["pos_tag"] = "error"

        # Verifica modelos baixados
        models_status = {}
        for function, model_name in DEFAULT_MODELS.items():
            try:
                from server.utils.model_downloader import validate_model

                is_valid = validate_model(model_name)
                models_status[function] = is_valid
            except Exception:
                models_status[function] = False

        # Determina status geral
        all_providers_ok = all(
            status == "available" for status in provider_status.values()
        )
        all_models_ok = all(models_status.values())
        overall_status = "healthy" if all_providers_ok and all_models_ok else "degraded"

        return HealthCheckResponse(
            status=overall_status,
            version="0.1.0",
            timestamp=datetime.now().isoformat(),
            services=provider_status,
            models=models_status,
        )

    except Exception as e:
        logger.error(f"Erro no health check: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Health check falhou: {str(e)}")


@app.get("/ready")
async def readiness_check():
    """Readiness check simples para Kubernetes."""
    return {"status": "ready", "timestamp": datetime.now().isoformat()}


@app.get("/info")
async def server_info():
    """Informações detalhadas do servidor."""
    import psutil
    import torch

    # Informações do sistema
    memory = psutil.virtual_memory()
    cpu_count = psutil.cpu_count()

    return {
        "server": get_server_config(),
        "system": {
            "cpu_count": cpu_count,
            "memory_total_gb": round(memory.total / (1024**3), 2),
            "memory_available_gb": round(memory.available / (1024**3), 2),
            "memory_percent": memory.percent,
        },
        "torch": {
            "version": torch.__version__,
            "cuda_available": torch.cuda.is_available(),
            "cuda_device_count": (
                torch.cuda.device_count() if torch.cuda.is_available() else 0
            ),
            "device": "cpu" if FORCE_CPU_ONLY else "auto",
        },
        "models": DEFAULT_MODELS,
        "timestamp": datetime.now().isoformat(),
    }


# =============================================================================
# COMPATIBILIDADE OPENAI API
# =============================================================================


@app.post("/v1/chat/completions")
async def openai_chat_completions(request: dict):
    """
    Endpoint compatível com OpenAI Chat Completions.

    Mapeia para classificação de texto usando o último message.
    """
    try:
        # Extrai texto da última mensagem
        messages = request.get("messages", [])
        if not messages:
            raise HTTPException(status_code=400, detail="Messages are required")

        last_message = messages[-1]
        text = last_message.get("content", "")

        if not text:
            raise HTTPException(status_code=400, detail="Message content is required")

        # Usa provider de classificação
        from server.providers.classify import get_cached_provider

        provider = get_cached_provider()

        if not provider.is_loaded():
            provider.load_model()

        # Aplica classificação
        result = provider.classify_text(text, top_k=1)

        # Formata resposta compatível com OpenAI
        response_text = f"Classificação: {result['predictions'][0]['label']} (confiança: {result['predictions'][0]['score']:.2f})"

        return {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": provider.model_name,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response_text,
                    },
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": len(text.split()),
                "completion_tokens": len(response_text.split()),
                "total_tokens": len(text.split()) + len(response_text.split()),
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/embeddings")
async def openai_embeddings(request: dict):
    """
    Endpoint compatível com OpenAI Embeddings.

    Mapeia para geração de embeddings.
    """
    try:
        input_text = request.get("input", "")
        if isinstance(input_text, list):
            input_text = input_text[0] if input_text else ""

        if not input_text:
            raise HTTPException(status_code=400, detail="Input text is required")

        # Usa provider de embeddings
        from server.providers.embed import get_cached_provider

        provider = get_cached_provider()

        if not provider.is_loaded():
            provider.load_model()

        # Gera embedding
        result = provider.generate_single_embedding(input_text)

        return {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": result["embedding"],
                    "index": 0,
                }
            ],
            "model": provider.model_name,
            "usage": {
                "prompt_tokens": len(input_text.split()),
                "total_tokens": len(input_text.split()),
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# EXCEPTION HANDLERS
# =============================================================================


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handler para HTTPExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ErrorDetail(
                code=f"HTTP_{exc.status_code}",
                message=exc.detail,
                details={"url": str(request.url), "method": request.method},
            ),
            timestamp=datetime.now().isoformat(),
        ).dict(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handler para exceções gerais."""
    logger.error(f"Erro não tratado: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error=ErrorDetail(
                code="INTERNAL_ERROR",
                message="Erro interno do servidor",
                details={"url": str(request.url), "method": request.method},
            ),
            timestamp=datetime.now().isoformat(),
        ).dict(),
    )


# =============================================================================
# INICIALIZAÇÃO
# =============================================================================


@app.on_event("startup")
async def startup_event():
    """Executado na inicialização do servidor."""
    logger.info("🚀 Iniciando Slice Providers Server...")
    logger.info(f"📡 Servidor: {SERVER_HOST}:{SERVER_PORT}")
    logger.info(f"🔧 Debug mode: {DEBUG_MODE}")
    logger.info(f"💻 CPU-only mode: {FORCE_CPU_ONLY}")
    logger.info(f"📋 Modelos padrão: {DEFAULT_MODELS}")

    # Valida que modelos estão disponíveis
    try:
        from server.utils.model_downloader import list_downloaded_models

        models = list_downloaded_models()
        logger.info(f"📦 Modelos baixados: {len(models)}")
    except Exception as e:
        logger.warning(f"⚠️  Erro ao verificar modelos: {str(e)}")


@app.on_event("shutdown")
async def shutdown_event():
    """Executado no shutdown do servidor."""
    logger.info("🛑 Desligando Slice Providers Server...")

    # Limpa cache de providers
    try:
        from server.providers.classify import (
            clear_provider_cache as clear_classify_cache,
        )
        from server.providers.embed import clear_provider_cache as clear_embed_cache
        from server.providers.pos_tag import clear_provider_cache as clear_pos_cache

        clear_classify_cache()
        clear_embed_cache()
        clear_pos_cache()

        logger.info("🧹 Cache de providers limpo")
    except Exception as e:
        logger.error(f"Erro ao limpar cache: {str(e)}")


# =============================================================================
# CONFIGURAÇÃO OPENAPI CUSTOMIZADA
# =============================================================================


def custom_openapi():
    """Configuração customizada do OpenAPI."""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Slice Providers - HuggingFace NLP Server",
        version="0.1.0",
        description=app.description,
        routes=app.routes,
    )

    # Adiciona informações adicionais
    openapi_schema["info"]["x-logo"] = {"url": "https://slice.com/logo.png"}

    # Adiciona exemplos aos schemas
    if "components" in openapi_schema:
        schemas = openapi_schema["components"]["schemas"]

        # Exemplo para ClassificationRequest
        if "ClassificationRequest" in schemas:
            schemas["ClassificationRequest"]["example"] = {
                "text": "Este produto é excelente, recomendo muito!",
                "language": "pt",
                "labels": ["positivo", "negativo", "neutro"],
            }

        # Exemplo para EmbeddingRequest
        if "EmbeddingRequest" in schemas:
            schemas["EmbeddingRequest"]["example"] = {
                "text": "Análise de sentimento em português",
                "language": "pt",
                "normalize": True,
            }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server.main:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=DEBUG_MODE,
        log_level=LOG_LEVEL.lower(),
    )
