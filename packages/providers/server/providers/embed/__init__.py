"""Provider HuggingFace para geração de embeddings."""

from .huggingface import (
    HuggingFaceEmbeddingProvider,
    create_embedding_provider,
    get_cached_provider,
    clear_provider_cache,
)

__all__ = [
    "HuggingFaceEmbeddingProvider",
    "create_embedding_provider",
    "get_cached_provider", 
    "clear_provider_cache",
]
