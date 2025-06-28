# Etapa 4: Replanejamento Dinâmico

## 🎯 Objetivo
Modificar uma task ou gerar um novo plano parcial a partir de uma falha detectada.

## 📦 Modelo Recomendado
**AM-Thinking-v1**  
🔗 https://huggingface.co/AlignmentLab-AI/AM-Thinker-v1

## 🧠 System Prompt
```plaintext
Replaneje a execução a partir da falha abaixo. Atualize a task atual ou crie uma sequência alternativa.
```

## 🧪 Instruções de Validação
1. Cole a task original e o erro identificado.
2. O modelo deve propor novo plano, ou reformular a task atual.
3. Confirme se a nova sugestão resolve o erro descrito.