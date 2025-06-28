# Requisitos para Visualização do Heatmap de Relevância

## 1. Visual compacto
- O heatmap HTML deve ser compacto, evitando scroll excessivo, mesmo para arquivos grandes.
- Justificativa: facilitar análise humana, já que a IA pode analisar o CSV diretamente.

## 2. Relatório visual de amostragem de frases relevantes
- Após o heatmap visual estar sólido, criar um relatório HTML que permita visualizar amostras de frases extraídas do texto bruto, classificadas por grau de relevância.
- A amostragem deve ser inteligente: nem mostrar tudo (ruído), nem mostrar pouco (viés).
- Escala de relevância:
  1. MUITO RELEVANTE
  2. RELEVANTE
  3. POUCO RELEVANTE
  4. IRRELEVANTE
- A cada execução, a amostragem pode variar (aleatória, estratificada, ou baseada em seed).
- Permite rodar múltiplas vezes para ver diferentes exemplos, sem poluir a visualização.
- Objetivo: facilitar análise humana, identificar interpretações incorretas e propor ajustes no processo.

## 3. Minimalismo e simplicidade
- O visualizador deve ser minimalista, sem foco em visual elaborado ou enterprise.
- O script pode ser feito em Python, priorizando simplicidade, poucas linhas e facilidade de visualização.
- Ajustes visuais só para facilitar leitura, não para estética.
- Futuras versões enterprise podem ser feitas em React no client do módulo de agentes.
