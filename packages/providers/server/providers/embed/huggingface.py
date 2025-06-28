"""
Provider HuggingFace para geração de embeddings.

Este módulo implementa a funcionalidade de embeddings usando modelos
HuggingFace, com foco em modelos sentence-transformers e similares.
"""

import time
import torch
import numpy as np
from typing import Dict, List, Any, Optional
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
from server.constants import (
    DEFAULT_MODELS,
    MODEL_CACHE_DIR,
    FORCE_CPU_ONLY,
    DEVICE,
    REQUEST_TIMEOUT_SECONDS,
)


class HuggingFaceEmbeddingProvider:
    """
    Provider para geração de embeddings usando modelos HuggingFace.
    
    Suporta tanto modelos sentence-transformers quanto modelos BERT/RoBERTa
    padrão com pooling manual.
    """
    
    def __init__(self, model_name: Optional[str] = None):
        """
        Inicializa o provider de embeddings.
        
        Args:
            model_name: Nome específico do modelo. Se None, usa o padrão.
        """
        self.model_name = model_name or DEFAULT_MODELS["embed"]
        self.model = None
        self.tokenizer = None
        self.is_sentence_transformer = False
        self._is_loaded = False
        
    def _ensure_cpu_only(self) -> None:
        """Garante que apenas CPU será usada."""
        if FORCE_CPU_ONLY:
            torch.set_default_tensor_type('torch.FloatTensor')
            if torch.cuda.is_available():
                torch.cuda.set_device(-1)
    
    def _is_sentence_transformer_model(self) -> bool:
        """Verifica se o modelo é um sentence-transformer."""
        return "sentence-transformers" in self.model_name.lower()
    
    def load_model(self) -> bool:
        """
        Carrega o modelo de embeddings.
        
        Returns:
            True se carregamento foi bem-sucedido, False caso contrário.
        """
        if self._is_loaded:
            return True
            
        try:
            self._ensure_cpu_only()
            
            print(f"🔄 Carregando modelo de embeddings: {self.model_name}")
            start_time = time.time()
            
            self.is_sentence_transformer = self._is_sentence_transformer_model()
            
            if self.is_sentence_transformer:
                self._load_sentence_transformer()
            else:
                self._load_standard_model()
            
            load_time = time.time() - start_time
            self._is_loaded = True
            
            print(f"✅ Modelo de embeddings carregado em {load_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao carregar modelo {self.model_name}: {str(e)}")
            return False
    
    def _load_sentence_transformer(self) -> None:
        """Carrega modelo sentence-transformer."""
        self.model = SentenceTransformer(
            self.model_name,
            cache_folder=MODEL_CACHE_DIR,
            device="cpu" if FORCE_CPU_ONLY else None,
        )
        
        if FORCE_CPU_ONLY:
            self.model = self.model.to("cpu")
    
    def _load_standard_model(self) -> None:
        """Carrega modelo padrão (BERT/RoBERTa/etc)."""
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            cache_dir=MODEL_CACHE_DIR,
            local_files_only=True,
        )
        
        self.model = AutoModel.from_pretrained(
            self.model_name,
            cache_dir=MODEL_CACHE_DIR,
            torch_dtype=torch.float32,
            device_map=None,
            local_files_only=True,
        )
        
        if FORCE_CPU_ONLY:
            self.model = self.model.to("cpu")
    
    def generate_embeddings(
        self, 
        texts: List[str], 
        normalize: bool = True
    ) -> Dict[str, Any]:
        """
        Gera embeddings para lista de textos.
        
        Args:
            texts: Lista de textos para processar
            normalize: Se deve normalizar os embeddings
            
        Returns:
            Dicionário com embeddings e metadados
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")
        
        start_time = time.time()
        
        try:
            if self.is_sentence_transformer:
                embeddings = self._generate_sentence_transformer_embeddings(texts, normalize)
            else:
                embeddings = self._generate_standard_embeddings(texts, normalize)
            
            processing_time = (time.time() - start_time) * 1000  # ms
            
            return {
                "embeddings": embeddings,
                "dimensions": len(embeddings[0]) if embeddings else 0,
                "model_name": self.model_name,
                "processing_time_ms": processing_time,
                "success": True,
                "normalized": normalize,
                "total_texts": len(texts),
            }
            
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            raise RuntimeError(f"Erro na geração de embeddings: {str(e)}")
    
    def _generate_sentence_transformer_embeddings(
        self, 
        texts: List[str], 
        normalize: bool
    ) -> List[List[float]]:
        """Gera embeddings usando sentence-transformer."""
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=normalize,
            batch_size=8,
            show_progress_bar=False,
        )
        
        return embeddings.tolist()
    
    def _generate_standard_embeddings(
        self, 
        texts: List[str], 
        normalize: bool
    ) -> List[List[float]]:
        """Gera embeddings usando modelo padrão com pooling manual."""
        embeddings = []
        
        for text in texts:
            # Tokeniza
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=512,
            )
            
            if FORCE_CPU_ONLY:
                inputs = {k: v.to("cpu") for k, v in inputs.items()}
            
            # Gera embeddings
            with torch.no_grad():
                outputs = self.model(**inputs)
                
                # Mean pooling
                token_embeddings = outputs.last_hidden_state
                attention_mask = inputs["attention_mask"]
                
                # Aplica máscara de atenção
                input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
                sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
                sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
                embedding = sum_embeddings / sum_mask
                
                # Normaliza se solicitado
                if normalize:
                    embedding = torch.nn.functional.normalize(embedding, p=2, dim=1)
                
                embeddings.append(embedding.squeeze().cpu().numpy().tolist())
        
        return embeddings
    
    def generate_single_embedding(
        self, 
        text: str, 
        normalize: bool = True
    ) -> Dict[str, Any]:
        """
        Gera embedding para um único texto.
        
        Args:
            text: Texto para processar
            normalize: Se deve normalizar o embedding
            
        Returns:
            Dicionário com embedding e metadados
        """
        result = self.generate_embeddings([text], normalize)
        
        return {
            "embedding": result["embeddings"][0],
            "dimensions": result["dimensions"],
            "model_name": self.model_name,
            "processing_time_ms": result["processing_time_ms"],
            "success": True,
            "normalized": normalize,
            "input_text": text,
        }
    
    def compute_similarity(
        self, 
        text1: str, 
        text2: str, 
        normalize: bool = True
    ) -> Dict[str, Any]:
        """
        Calcula similaridade entre dois textos.
        
        Args:
            text1: Primeiro texto
            text2: Segundo texto
            normalize: Se deve normalizar embeddings
            
        Returns:
            Dicionário com similaridade e metadados
        """
        start_time = time.time()
        
        # Gera embeddings
        result = self.generate_embeddings([text1, text2], normalize)
        embeddings = result["embeddings"]
        
        # Calcula similaridade cosine
        emb1 = np.array(embeddings[0])
        emb2 = np.array(embeddings[1])
        
        if normalize:
            # Se já normalizado, produto escalar é a similaridade cosine
            similarity = float(np.dot(emb1, emb2))
        else:
            # Calcula similaridade cosine manualmente
            norm1 = np.linalg.norm(emb1)
            norm2 = np.linalg.norm(emb2)
            similarity = float(np.dot(emb1, emb2) / (norm1 * norm2))
        
        processing_time = (time.time() - start_time) * 1000
        
        return {
            "similarity": round(similarity, 4),
            "text1": text1,
            "text2": text2,
            "model_name": self.model_name,
            "processing_time_ms": processing_time,
            "success": True,
        }
    
    def is_loaded(self) -> bool:
        """Verifica se o modelo está carregado."""
        return self._is_loaded
    
    def unload_model(self) -> None:
        """Descarrega o modelo da memória."""
        if self._is_loaded:
            del self.model
            if self.tokenizer:
                del self.tokenizer
            
            self.model = None
            self.tokenizer = None
            self._is_loaded = False
            
            # Força garbage collection
            import gc
            gc.collect()
            
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            print(f"🗑️  Modelo de embeddings {self.model_name} descarregado")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Retorna informações sobre o modelo."""
        return {
            "name": self.model_name,
            "type": "embedding",
            "loaded": self._is_loaded,
            "device": DEVICE,
            "is_sentence_transformer": self.is_sentence_transformer,
            "supports_similarity": True,
            "max_sequence_length": getattr(
                self.tokenizer, 
                "model_max_length", 
                512
            ) if self.tokenizer else 512,
        }


def create_embedding_provider(model_name: Optional[str] = None) -> HuggingFaceEmbeddingProvider:
    """
    Factory function para criar provider de embeddings.
    
    Args:
        model_name: Nome específico do modelo (opcional)
        
    Returns:
        Instância configurada do provider
    """
    return HuggingFaceEmbeddingProvider(model_name)


# Cache global de providers
_provider_cache: Dict[str, HuggingFaceEmbeddingProvider] = {}


def get_cached_provider(model_name: Optional[str] = None) -> HuggingFaceEmbeddingProvider:
    """
    Retorna provider cacheado ou cria novo se necessário.
    
    Args:
        model_name: Nome do modelo
        
    Returns:
        Provider cacheado
    """
    model_key = model_name or DEFAULT_MODELS["embed"]
    
    if model_key not in _provider_cache:
        _provider_cache[model_key] = create_embedding_provider(model_name)
    
    return _provider_cache[model_key]


def clear_provider_cache() -> None:
    """Limpa cache de providers."""
    global _provider_cache
    
    for provider in _provider_cache.values():
        provider.unload_model()
    
    _provider_cache.clear()
    print("🧹 Cache de providers de embeddings limpo")
