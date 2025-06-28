# Etapa 1: Passive Interpreter / Parser

## 🎯 Objetivo
Interpretar uma descrição textual ou `Project.md` e extrair:
- Objetivo geral
- Restrições
- Critérios de sucesso
- Regras implícitas

## 📦 Modelo Recomendado
**DeepSeek-R1-Zero**  
🔗 https://huggingface.co/deepseek-ai/DeepSeek-V2  
✅ Excelente interpretação contextual, aceita entradas longas.

## 🧠 System Prompt
```plaintext
Você é um agente interpretador. Dado o conteúdo abaixo, extraia:

1. Objetivo geral do projeto
2. Restrições importantes
3. Critérios de sucesso
4. Regras implícitas percebidas
```

## 🧪 Instruções de Validação
1. Copie um `Project.md` ou descrição textual.
2. Use o prompt acima com o modelo DeepSeek-R1-Zero.
3. O output deve conter os 4 elementos descritos acima de forma clara e bem formatada.