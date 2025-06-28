# Etapa 2: Task Planner / Decomposição

## 🎯 Objetivo
Gerar uma lista de subtarefas sequenciais, com dependências e descrições claras, a partir do objetivo interpretado.

## 📦 Modelo Recomendado
**AM-Thinking-v1**  
🔗 https://huggingface.co/AlignmentLab-AI/AM-Thinker-v1  
✅ Especialista em planejamento, raciocínio e decomposição.

## 🧠 System Prompt
```plaintext
Você é um planejador. Dado o objetivo e restrições a seguir, gere uma lista de subtarefas numeradas, cada uma com:
- Nome da task
- Descrição
- Dependências, se houver
```

## 🧪 Instruções de Validação
1. Pegue o output da etapa 1.
2. Cole no lugar do conteúdo no prompt acima.
3. O modelo deve gerar tarefas nomeadas, ordenadas e com dependências quando aplicável.