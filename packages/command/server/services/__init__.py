"""Serviço especializado para o modelo Command-R (CPU-optimized)."""

import time
import uuid
import os
from typing import List, Dict, Any, Optional, AsyncGenerator
from ..models import ChatMessage, ChatCompletionRequest, ChatCompletionResponse
from ..constants import (
    MODEL_NAME, 
    MAX_TOKENS_DEFAULT, 
    TEMPERATURE_DEFAULT,
    TORCH_DEVICE,
    TORCH_THREADS,
    FORCE_CPU_ONLY
)


class CommandRService:
    """Serviço para integração com o modelo Command-R (otimizado para CPU)."""
    
    def __init__(self):
        """Inicializa o serviço Command-R com configurações CPU-only."""
        self.model_name = MODEL_NAME
        self.is_loaded = False
        self._model = None
        
        # Forçar uso de CPU apenas
        if FORCE_CPU_ONLY:
            os.environ["CUDA_VISIBLE_DEVICES"] = ""
            os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "max_split_size_mb:0"
            
        # Configurar threads para CPU
        import torch
        torch.set_num_threads(TORCH_THREADS)
        
    async def load_model(self) -> bool:
        """Carrega o modelo Command-R otimizado para CPU."""
        try:
            # Garantir que torch está usando CPU
            import torch
            if torch.cuda.is_available() and FORCE_CPU_ONLY:
                print("GPU disponível mas forçando uso de CPU conforme configuração")
            
            # TODO: Carregar Command-R real aqui
            # Exemplo: self._model = AutoModelForCausalLM.from_pretrained(
            #     "CohereForAI/c4ai-command-r-v01",
            #     torch_dtype=torch.float32,  # CPU prefere float32
            #     device_map="cpu",
            #     low_cpu_mem_usage=True
            # )
            
            print(f"Modelo Command-R carregado em CPU com {TORCH_THREADS} threads")
            self.is_loaded = True
            return True
        except Exception as e:
            self.is_loaded = False
            raise RuntimeError(f"Falha ao carregar modelo Command-R: {e}")
    
    def is_model_loaded(self) -> bool:
        """Verifica se o modelo está carregado."""
        return self.is_loaded
    
    async def chat_completion(self, request: ChatCompletionRequest) -> ChatCompletionResponse:
        """Gera uma resposta de chat usando Command-R (CPU-optimized)."""
        if not self.is_loaded:
            raise RuntimeError("Modelo Command-R não está carregado")
        
        # Preparar mensagens para o modelo
        formatted_messages = self._format_messages(request.messages)
        
        # Gerar resposta com otimizações para CPU
        response_text = await self._generate_response_cpu_optimized(
            messages=formatted_messages,
            max_tokens=request.max_tokens or MAX_TOKENS_DEFAULT,
            temperature=request.temperature or TEMPERATURE_DEFAULT,
            top_p=request.top_p or 1.0
        )
        
        # Construir resposta no formato OpenAI
        response_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
        timestamp = int(time.time())
        
        return ChatCompletionResponse(
            id=response_id,
            created=timestamp,
            model=self.model_name,
            choices=[{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_text
                },
                "finish_reason": "stop"
            }],
            usage={
                "prompt_tokens": self._count_tokens(formatted_messages),
                "completion_tokens": self._count_tokens(response_text),
                "total_tokens": self._count_tokens(formatted_messages) + self._count_tokens(response_text)
            }
        )
    
    async def stream_chat_completion(self, request: ChatCompletionRequest) -> AsyncGenerator[str, None]:
        """Gera resposta de chat em streaming (CPU-optimized)."""
        if not self.is_loaded:
            raise RuntimeError("Modelo Command-R não está carregado")
        
        # TODO: Implementar streaming real otimizado para CPU
        # Command-R funciona muito bem com streaming em CPU
        response_text = "Esta é uma resposta simulada do Command-R otimizada para CPU."
        words = response_text.split()
        
        for i, word in enumerate(words):
            chunk_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
            chunk = {
                "id": chunk_id,
                "object": "chat.completion.chunk",
                "created": int(time.time()),
                "model": self.model_name,
                "choices": [{
                    "index": 0,
                    "delta": {"content": word + " "},
                    "finish_reason": None if i < len(words) - 1 else "stop"
                }]
            }
            yield f"data: {chunk}\n\n"
        
        yield "data: [DONE]\n\n"
    
    def _format_messages(self, messages: List[ChatMessage]) -> str:
        """Formata mensagens para o formato esperado pelo Command-R."""
        formatted = []
        for message in messages:
            role_prefix = {
                "system": "System:",
                "user": "Human:",
                "assistant": "Assistant:"
            }.get(message.role, "Unknown:")
            
            formatted.append(f"{role_prefix} {message.content}")
        
        return "\n".join(formatted)
    
    async def _generate_response_cpu_optimized(self, messages: str, max_tokens: int, 
                                             temperature: float, top_p: float) -> str:
        """Gera resposta usando Command-R otimizado para CPU."""
        # TODO: Implementar geração real com Command-R
        # Command-R é eficiente em CPU, especialmente com:
        # - Batch size pequeno (1-4)
        # - Precision float32
        # - Threading otimizado
        # - Memory mapping para modelos grandes
        
        return f"Resposta do Command-R (CPU-optimized) para: {messages[:100]}..."
    
    def _count_tokens(self, text: str) -> int:
        """Conta tokens aproximadamente (simulado)."""
        # TODO: Implementar contagem real de tokens
        return len(text.split())
    
    async def unload_model(self) -> None:
        """Descarrega o modelo da memória."""
        self._model = None
        self.is_loaded = False
        print("Modelo Command-R descarregado da CPU")
