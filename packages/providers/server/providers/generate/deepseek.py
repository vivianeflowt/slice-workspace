"""
Provider para geração de texto com DeepSeek-R1-Distill-Qwen-7B (LLM).
"""

import time
from typing import Any, Dict, List, Optional

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

from server.constants import (
    DEFAULT_MODELS,
    DEVICE,
    FORCE_CPU_ONLY,
    MODEL_CACHE_DIR,
)

class DeepSeekProvider:
    """
    Provider para geração de texto usando DeepSeek-R1-Distill-Qwen-7B.
    """
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or DEFAULT_MODELS["deepseek-r1-qwen-7b"]
        self.tokenizer = None
        self.model = None
        self._is_loaded = False

    def _ensure_cpu_only(self) -> None:
        if FORCE_CPU_ONLY:
            torch.set_default_tensor_type("torch.FloatTensor")
            if torch.cuda.is_available():
                torch.cuda.set_device(-1)

    def load_model(self) -> bool:
        if self._is_loaded:
            return True
        try:
            self._ensure_cpu_only()
            print(f"🔄 Carregando modelo DeepSeek: {self.model_name}")
            start_time = time.time()
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=MODEL_CACHE_DIR,
                local_files_only=True,
            )
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                cache_dir=MODEL_CACHE_DIR,
                torch_dtype=torch.float32,
                device_map=None,
                local_files_only=True,
            )
            if FORCE_CPU_ONLY:
                self.model = self.model.to("cpu")
            load_time = time.time() - start_time
            self._is_loaded = True
            print(f"✅ Modelo DeepSeek carregado em {load_time:.2f}s")
            return True
        except Exception as e:
            print(f"❌ Erro ao carregar modelo DeepSeek: {str(e)}")
            return False

    def generate(self, messages: List[Dict[str, str]], max_tokens: int = 512, temperature: float = 0.7, top_p: float = 0.95) -> Dict[str, Any]:
        """
        Gera texto a partir de uma lista de mensagens (estilo OpenAI Chat).
        """
        if not self._is_loaded:
            if not self.load_model():
                raise RuntimeError(f"Falha ao carregar modelo {self.model_name}")
        prompt = self._build_prompt(messages)
        input_ids = self.tokenizer.encode(prompt, return_tensors="pt")
        if FORCE_CPU_ONLY:
            input_ids = input_ids.to("cpu")
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                max_new_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
            )
        generated = self.tokenizer.decode(output[0][input_ids.shape[1]:], skip_special_tokens=True)
        return {
            "message": {"content": generated},
            "model_name": self.model_name,
        }

    def _build_prompt(self, messages: List[Dict[str, str]]) -> str:
        """
        Concatena as mensagens no formato esperado pelo modelo (estilo OpenAI Chat).
        """
        prompt = ""
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                prompt += f"[SYSTEM]\n{content}\n"
            elif role == "user":
                prompt += f"[USER]\n{content}\n"
            elif role == "assistant":
                prompt += f"[ASSISTANT]\n{content}\n"
        prompt += "[ASSISTANT]\n"
        return prompt

    def is_loaded(self) -> bool:
        return self._is_loaded

    def unload_model(self) -> None:
        if self._is_loaded:
            del self.model
            del self.tokenizer
            self.model = None
            self.tokenizer = None
            self._is_loaded = False
            import gc
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            print(f"🗑️  Modelo DeepSeek descarregado da memória")

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "name": self.model_name,
            "type": "llm",
            "loaded": self._is_loaded,
            "device": DEVICE,
            "max_sequence_length": (
                getattr(self.tokenizer, "model_max_length", 2048)
                if self.tokenizer else 2048
            ),
        }
