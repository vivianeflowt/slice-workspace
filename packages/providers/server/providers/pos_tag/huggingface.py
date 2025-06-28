"""
Provider HuggingFace para POS Tagging (Part-of-Speech).

Este módulo implementa funcionalidade de POS tagging usando modelos
HuggingFace para análise morfossintática de texto em português.
"""

import time
import torch
from typing import Dict, List, Any, Optional, Tuple
from transformers import (
    AutoTokenizer, 
    AutoModelForTokenClassification,
    pipeline,
)
from server.constants import (
    DEFAULT_MODELS,
    MODEL_CACHE_DIR,
    FORCE_CPU_ONLY,
    DEVICE,
    REQUEST_TIMEOUT_SECONDS,
)


class HuggingFacePosTagProvider:
    """
    Provider para POS tagging usando modelos HuggingFace.
    
    Analisa texto e retorna tags morfossintáticas para cada token,
    útil para análise linguística e pré-processamento de NLP.
    """
    
    def __init__(self, model_name: Optional[str] = None):
        """
        Inicializa o provider de POS tagging.
        
        Args:
            model_name: Nome específico do modelo. Se None, usa o padrão.
        """
        self.model_name = model_name or DEFAULT_MODELS["pos_tag"]
        self.tokenizer = None
        self.model = None
        self.pipeline = None
        self._is_loaded = False
        
        # Mapeamento de tags POS padrão para português
        self.pos_tag_mapping = {
            "NOUN": "substantivo",
            "VERB": "verbo", 
            "ADJ": "adjetivo",
            "ADV": "advérbio",
            "PRON": "pronome",
            "DET": "determinante",
            "ADP": "preposição",
            "CONJ": "conjunção",
            "NUM": "numeral",
            "PRT": "partícula",
            "PUNCT": "pontuação",
            "X": "outro",
            "PROPN": "nome_próprio",
            "AUX": "auxiliar",
            "CCONJ": "conjunção_coordenativa", 
            "SCONJ": "conjunção_subordinativa",
            "PART": "partícula",
            "INTJ": "interjeição",
            "SYM": "símbolo",
        }
        
    def _ensure_cpu_only(self) -> None:
        """Garante que apenas CPU será usada."""
        if FORCE_CPU_ONLY:
            torch.set_default_tensor_type('torch.FloatTensor')
            if torch.cuda.is_available():
                torch.cuda.set_device(-1)
    
    def load_model(self) -> bool:
        """
        Carrega o modelo de POS tagging.
        
        Returns:
            True se carregamento foi bem-sucedido, False caso contrário.
        """
        if self._is_loaded:
            return True
            
        try:
            self._ensure_cpu_only()
            
            print(f"🔄 Carregando modelo de POS tagging: {self.model_name}")
            start_time = time.time()
            
            # Carrega tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=MODEL_CACHE_DIR,
                local_files_only=True,
            )
            
            # Carrega modelo
            self.model = AutoModelForTokenClassification.from_pretrained(
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
                "token-classification",
                model=self.model,
                tokenizer=self.tokenizer,
                device=-1 if FORCE_CPU_ONLY else 0,
                aggregation_strategy="simple",
            )
            
            load_time = time.time() - start_time
            self._is_loaded = True
            
            print(f"✅ Modelo de POS tagging carregado em {load_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao carregar modelo {self.model_name}: {str(e)}")
            return False
    
    def tag_text(
        self, 
        text: str, 
        return_confidence: bool = True,
        aggregate_subwords: bool = True
    ) -> Dict[str, Any]:
        """
        Aplica POS tagging em um texto.
        
        Args:
            text: Texto para analisar
            return_confidence: Se deve incluir scores de confiança
            aggregate_subwords: Se deve agregar sub-tokens
            
        Returns:
            Dicionário com tokens e tags POS
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")
        
        start_time = time.time()
        
        try:
            # Aplica POS tagging
            results = self.pipeline(
                text,
                aggregation_strategy="simple" if aggregate_subwords else "none"
            )
            
            # Processa resultados
            tokens = self._process_results(
                results, 
                text,
                return_confidence,
                aggregate_subwords
            )
            
            processing_time = (time.time() - start_time) * 1000  # ms
            
            return {
                "tokens": tokens,
                "model_name": self.model_name,
                "processing_time_ms": processing_time,
                "input_text": text,
                "success": True,
                "total_tokens": len(tokens),
            }
            
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            raise RuntimeError(f"Erro no POS tagging: {str(e)}")
    
    def _process_results(
        self, 
        results: List[Dict], 
        original_text: str,
        return_confidence: bool,
        aggregate_subwords: bool
    ) -> List[Dict[str, Any]]:
        """Processa resultados brutos do pipeline."""
        tokens = []
        
        for result in results:
            # Extrai token
            if 'word' in result:
                token = result['word']
            elif 'entity' in result:
                token = original_text[result['start']:result['end']]
            else:
                continue
            
            # Limpa token (remove prefixos de subwords)
            clean_token = token.replace('##', '').strip()
            if not clean_token:
                continue
            
            # Extrai tag POS
            pos_tag = result.get('entity', 'UNKNOWN')
            
            # Mapeia tag para português se disponível
            readable_tag = self.pos_tag_mapping.get(pos_tag, pos_tag)
            
            # Monta resultado
            token_info = {
                "token": clean_token,
                "pos_tag": readable_tag,
                "pos_tag_raw": pos_tag,
            }
            
            if return_confidence:
                token_info["confidence"] = round(result.get('score', 0.0), 4)
            
            # Adiciona posição se disponível
            if 'start' in result and 'end' in result:
                token_info["start"] = result['start']
                token_info["end"] = result['end']
            
            tokens.append(token_info)
        
        return tokens
    
    def analyze_sentence_structure(self, text: str) -> Dict[str, Any]:
        """
        Analisa estrutura sintática básica da sentença.
        
        Args:
            text: Texto para analisar
            
        Returns:
            Análise estrutural da sentença
        """
        tag_result = self.tag_text(text, return_confidence=True)
        tokens = tag_result["tokens"]
        
        # Conta tags por tipo
        tag_counts = {}
        for token in tokens:
            tag = token["pos_tag"]
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        # Identifica componentes principais
        has_subject = any(tag in ["substantivo", "pronome", "nome_próprio"] for tag in tag_counts)
        has_verb = "verbo" in tag_counts
        has_object = tag_counts.get("substantivo", 0) > 1
        
        # Calcula complexidade básica
        complexity_score = len(set(tag_counts.keys())) / len(tokens) if tokens else 0
        
        return {
            "tokens": tokens,
            "tag_distribution": tag_counts,
            "sentence_analysis": {
                "has_subject": has_subject,
                "has_verb": has_verb,
                "has_object": has_object,
                "is_complete": has_subject and has_verb,
                "complexity_score": round(complexity_score, 3),
                "total_words": len(tokens),
                "unique_tags": len(tag_counts),
            },
            "model_name": self.model_name,
            "processing_time_ms": tag_result["processing_time_ms"],
            "success": True,
        }
    
    def batch_tag(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Aplica POS tagging em múltiplos textos.
        
        Args:
            texts: Lista de textos para processar
            
        Returns:
            Lista de resultados de POS tagging
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")
        
        results = []
        start_time = time.time()
        
        for text in texts:
            try:
                result = self.tag_text(text)
                results.append(result)
            except Exception as e:
                results.append({
                    "tokens": [],
                    "model_name": self.model_name,
                    "processing_time_ms": 0,
                    "input_text": text,
                    "success": False,
                    "error": str(e),
                })
        
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
            
            print(f"🗑️  Modelo de POS tagging {self.model_name} descarregado")
    
    def get_supported_tags(self) -> Dict[str, str]:
        """Retorna mapeamento de tags POS suportadas."""
        return self.pos_tag_mapping.copy()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Retorna informações sobre o modelo."""
        return {
            "name": self.model_name,
            "type": "pos_tagging",
            "loaded": self._is_loaded,
            "device": DEVICE,
            "supported_tags": len(self.pos_tag_mapping),
            "language": "pt",
            "max_sequence_length": getattr(
                self.tokenizer, 
                "model_max_length", 
                512
            ) if self.tokenizer else 512,
        }


def create_pos_tag_provider(model_name: Optional[str] = None) -> HuggingFacePosTagProvider:
    """
    Factory function para criar provider de POS tagging.
    
    Args:
        model_name: Nome específico do modelo (opcional)
        
    Returns:
        Instância configurada do provider
    """
    return HuggingFacePosTagProvider(model_name)


# Cache global de providers
_provider_cache: Dict[str, HuggingFacePosTagProvider] = {}


def get_cached_provider(model_name: Optional[str] = None) -> HuggingFacePosTagProvider:
    """
    Retorna provider cacheado ou cria novo se necessário.
    
    Args:
        model_name: Nome do modelo
        
    Returns:
        Provider cacheado
    """
    model_key = model_name or DEFAULT_MODELS["pos_tag"]
    
    if model_key not in _provider_cache:
        _provider_cache[model_key] = create_pos_tag_provider(model_name)
    
    return _provider_cache[model_key]


def clear_provider_cache() -> None:
    """Limpa cache de providers."""
    global _provider_cache
    
    for provider in _provider_cache.values():
        provider.unload_model()
    
    _provider_cache.clear()
    print("🧹 Cache de providers de POS tagging limpo")
