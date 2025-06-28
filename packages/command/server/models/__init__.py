"""Models para validação de dados da API OpenAI."""

from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """Mensagem individual em um chat."""
    role: str = Field(..., description="Papel da mensagem: system, user, assistant")
    content: str = Field(..., description="Conteúdo da mensagem")
    name: Optional[str] = Field(None, description="Nome do usuário (opcional)")


class ChatCompletionRequest(BaseModel):
    """Request para chat completions (compatível com OpenAI)."""
    model: str = Field(..., description="Modelo a ser usado")
    messages: List[ChatMessage] = Field(..., description="Lista de mensagens")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens a gerar")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0, description="Temperatura")
    top_p: Optional[float] = Field(1.0, ge=0.0, le=1.0, description="Top-p sampling")
    stream: Optional[bool] = Field(False, description="Se deve usar streaming")
    stop: Optional[Union[str, List[str]]] = Field(None, description="Sequências de parada")


class ChatCompletionResponse(BaseModel):
    """Response para chat completions (compatível com OpenAI)."""
    id: str = Field(..., description="ID único da resposta")
    object: str = Field("chat.completion", description="Tipo do objeto")
    created: int = Field(..., description="Timestamp de criação")
    model: str = Field(..., description="Modelo usado")
    choices: List[Dict[str, Any]] = Field(..., description="Lista de escolhas")
    usage: Dict[str, int] = Field(..., description="Informações de uso")


class CompletionRequest(BaseModel):
    """Request para text completions (compatível com OpenAI)."""
    model: str = Field(..., description="Modelo a ser usado")
    prompt: Union[str, List[str]] = Field(..., description="Prompt para completar")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens a gerar")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0, description="Temperatura")
    top_p: Optional[float] = Field(1.0, ge=0.0, le=1.0, description="Top-p sampling")
    stream: Optional[bool] = Field(False, description="Se deve usar streaming")
    stop: Optional[Union[str, List[str]]] = Field(None, description="Sequências de parada")


class EmbeddingRequest(BaseModel):
    """Request para embeddings (compatível com OpenAI)."""
    input: Union[str, List[str]] = Field(..., description="Texto para gerar embedding")
    model: str = Field(..., description="Modelo a ser usado")


class ModelInfo(BaseModel):
    """Informações sobre um modelo disponível."""
    id: str = Field(..., description="ID do modelo")
    object: str = Field("model", description="Tipo do objeto")
    created: int = Field(..., description="Timestamp de criação")
    owned_by: str = Field("slice", description="Proprietário do modelo")


class ModelsResponse(BaseModel):
    """Response para listagem de modelos."""
    object: str = Field("list", description="Tipo do objeto")
    data: List[ModelInfo] = Field(..., description="Lista de modelos")


class ErrorResponse(BaseModel):
    """Response padrão para erros."""
    error: Dict[str, Any] = Field(..., description="Detalhes do erro")
