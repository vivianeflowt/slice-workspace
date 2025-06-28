"""
Provider HuggingFace para classificação de texto.

Este módulo implementa a funcionalidade de classificação usando modelos
HuggingFace, seguindo o princípio de organização por função, não por modelo.
"""

import time
from typing import Any, Dict, List, Optional, Tuple

import torch
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    pipeline,
)

from server.constants import (
    DEFAULT_MODELS,
    DEVICE,
    FORCE_CPU_ONLY,
    MODEL_CACHE_DIR,
    REQUEST_TIMEOUT_SECONDS,
)


class HuggingFaceClassificationProvider:
    """
    Provider para classificação de texto usando modelos HuggingFace.

    Suporta tanto classificação com labels pré-definidos quanto zero-shot
    classification com labels fornecidos pelo usuário.
    """

    def __init__(self, model_name: Optional[str] = None):
        """
        Inicializa o provider de classificação.

        Args:
            model_name: Nome específico do modelo. Se None, usa o padrão.
        """
        self.model_name = model_name or DEFAULT_MODELS["classify"]
        self.tokenizer = None
        self.model = None
        self.pipeline = None
        self._is_loaded = False

    def _ensure_cpu_only(self) -> None:
        """Garante que apenas CPU será usada."""
        if FORCE_CPU_ONLY:
            torch.set_default_tensor_type("torch.FloatTensor")
            if torch.cuda.is_available():
                torch.cuda.set_device(-1)  # Desabilita CUDA

    def load_model(self) -> bool:
        """
        Carrega o modelo de classificação.

        Returns:
            True se carregamento foi bem-sucedido, False caso contrário.
        """
        if self._is_loaded:
            return True

        try:
            self._ensure_cpu_only()

            print(f"🔄 Carregando modelo de classificação: {self.model_name}")
            start_time = time.time()

            # Carrega tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=MODEL_CACHE_DIR,
                local_files_only=True,
            )

            # Carrega modelo
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_name,
                cache_dir=MODEL_CACHE_DIR,
                torch_dtype=torch.float32,
                device_map=None,
                local_files_only=True,
            )

            # Move para CPU se necessário
            if FORCE_CPU_ONLY:
                self.model = self.model.to("cpu")

            # Cria pipeline
            self.pipeline = pipeline(
                "text-classification",
                model=self.model,
                tokenizer=self.tokenizer,
                device=-1 if FORCE_CPU_ONLY else 0,
                return_all_scores=True,
            )

            load_time = time.time() - start_time
            self._is_loaded = True

            print(f"✅ Modelo carregado em {load_time:.2f}s")
            return True

        except Exception as e:
            print(f"❌ Erro ao carregar modelo {self.model_name}: {str(e)}")
            return False

    def classify_text(
        self, text: str, labels: Optional[List[str]] = None, top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Classifica um texto.

        Args:
            text: Texto para classificar
            labels: Labels para zero-shot classification (opcional)
            top_k: Número máximo de predições a retornar

        Returns:
            Dicionário com predições e metadados
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")

        start_time = time.time()

        try:
            if labels:
                # Zero-shot classification
                predictions = self._zero_shot_classify(text, labels, top_k)
            else:
                # Classificação padrão
                predictions = self._standard_classify(text, top_k)

            processing_time = (time.time() - start_time) * 1000  # ms

            return {
                "predictions": predictions,
                "model_name": self.model_name,
                "processing_time_ms": processing_time,
                "input_text": text,
                "success": True,
            }

        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            raise RuntimeError(f"Erro na classificação: {str(e)}")

    def _standard_classify(self, text: str, top_k: int) -> List[Dict[str, Any]]:
        """Classificação padrão usando labels do modelo."""
        results = self.pipeline(text, top_k=top_k)

        return [
            {
                "label": result["label"],
                "score": round(result["score"], 4),
            }
            for result in results
        ]

    def _zero_shot_classify(
        self, text: str, labels: List[str], top_k: int
    ) -> List[Dict[str, Any]]:
        """Zero-shot classification com labels personalizados."""
        # Para zero-shot, precisamos usar um pipeline diferente
        try:
            from transformers import pipeline as hf_pipeline

            zero_shot_pipeline = hf_pipeline(
                "zero-shot-classification",
                model=self.model_name,
                device=-1 if FORCE_CPU_ONLY else 0,
            )

            result = zero_shot_pipeline(text, labels)

            # Organiza resultados
            predictions = []
            for label, score in zip(result["labels"], result["scores"]):
                predictions.append(
                    {
                        "label": label,
                        "score": round(score, 4),
                    }
                )

            return predictions[:top_k]

        except Exception:
            # Fallback: usa modelo padrão mesmo com labels customizados
            return self._standard_classify(text, top_k)

    def batch_classify(
        self, texts: List[str], labels: Optional[List[str]] = None, top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Classifica múltiplos textos em lote.

        Args:
            texts: Lista de textos para classificar
            labels: Labels para zero-shot (opcional)
            top_k: Número máximo de predições por texto

        Returns:
            Lista de resultados de classificação
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")

        results = []
        start_time = time.time()

        for text in texts:
            try:
                result = self.classify_text(text, labels, top_k)
                results.append(result)
            except Exception as e:
                results.append(
                    {
                        "predictions": [],
                        "model_name": self.model_name,
                        "processing_time_ms": 0,
                        "input_text": text,
                        "success": False,
                        "error": str(e),
                    }
                )

        total_time = (time.time() - start_time) * 1000

        return results

    def is_loaded(self) -> bool:
        """Verifica se o modelo está carregado."""
        return self._is_loaded

    def unload_model(self) -> None:
        """Descarrega o modelo da memória."""
        if self._is_loaded:
            del self.model
            del self.tokenizer
            del self.pipeline

            self.model = None
            self.tokenizer = None
            self.pipeline = None
            self._is_loaded = False

            # Força garbage collection
            import gc

            gc.collect()

            if torch.cuda.is_available():
                torch.cuda.empty_cache()

            print(f"🗑️  Modelo {self.model_name} descarregado da memória")

    def get_model_info(self) -> Dict[str, Any]:
        """Retorna informações sobre o modelo."""
        return {
            "name": self.model_name,
            "type": "classification",
            "loaded": self._is_loaded,
            "device": DEVICE,
            "supports_zero_shot": True,
            "max_sequence_length": (
                getattr(self.tokenizer, "model_max_length", 512)
                if self.tokenizer
                else 512
            ),
        }


def create_classification_provider(
    model_name: Optional[str] = None,
) -> HuggingFaceClassificationProvider:
    """
    Factory function para criar provider de classificação.

    Args:
        model_name: Nome específico do modelo (opcional)

    Returns:
        Instância configurada do provider
    """
    return HuggingFaceClassificationProvider(model_name)


# Cache global de providers para evitar recarregamentos
_provider_cache: Dict[str, HuggingFaceClassificationProvider] = {}


def get_cached_provider(
    model_name: Optional[str] = None,
) -> HuggingFaceClassificationProvider:
    """
    Retorna provider cacheado ou cria novo se necessário.

    Args:
        model_name: Nome do modelo

    Returns:
        Provider cacheado
    """
    model_key = model_name or DEFAULT_MODELS["classify"]

    if model_key not in _provider_cache:
        _provider_cache[model_key] = create_classification_provider(model_name)

    return _provider_cache[model_key]


def clear_provider_cache() -> None:
    """Limpa cache de providers."""
    global _provider_cache

    for provider in _provider_cache.values():
        provider.unload_model()

    _provider_cache.clear()
    print("🧹 Cache de providers de classificação limpo")
