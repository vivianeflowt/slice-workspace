"""Provider HuggingFace para POS tagging."""

from .huggingface import (
    HuggingFacePosTagProvider,
    clear_provider_cache,
    create_pos_tag_provider,
    get_cached_provider,
)

__all__ = [
    "HuggingFacePosTagProvider",
    "create_pos_tag_provider",
    "get_cached_provider",
    "clear_provider_cache",
]
