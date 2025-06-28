# === Definição dos Campos do Header ===

provider:
  # Nome do provedor da IA (ex: openai, deepseek, perplexity, ollama)
  # Deve ser interpretado em conjunto com o modelo e os critérios de balanceamento.
model:
  # Nome do modelo utilizado (ex: gpt-4, deepseek-coder, codellama:7b)
  # O modelo define o foco, pontos fortes e limitações da sugestão.
files:
  # Lista de arquivos analisados pelo modelo.
  # Pode ser um único arquivo (ex: Dockerfile) ou múltiplos arquivos (ex: Dockerfile, docker-compose.yml, start.sh).
  # Quanto menor o número de arquivos, mais focada e específica é a resposta.
  # Quanto maior o número de arquivos, mais abrangente e sistêmica tende a ser a análise, considerando integrações e dependências.
  # O contexto e o tipo dos arquivos influenciam diretamente a qualidade e o foco das sugestões.
  # Exemplos:
  #   files: .docker/workstation/Dockerfile
  #   files: .docker/workstation/Dockerfile, .docker/workstation/docker-compose.yml
temperature:
  # Controla o grau de criatividade/variação das respostas do modelo.
  # O efeito do temperature depende do provider, do model e do(s) arquivo(s) analisado(s).
  # Exemplos de relação:
  # - Modelos diferentes podem responder de forma distinta ao mesmo valor de temperature.
  # - Para arquivos técnicos (ex: Dockerfile), recomenda-se temperature baixo para precisão.
  # - Para múltiplos arquivos ou contexto amplo, pode-se testar temperature mais alto para sugestões criativas.
  # Recomendações gerais:
  #   - temperature: 0.2–0.4  # Análise técnica, precisa, reprodutível
  #   - temperature: 0.7–1.0  # Brainstorming, sugestões criativas, exploração

# === Mapeamento de Providers e Models ===

providers_models:
  deepseek:
    deepseek-chat:
      foco: "Generalista, bom para tarefas amplas, conversação e análise de contexto variado. Forte em volume de dados."
      pontos_fortes: "Lida bem com grandes quantidades de informação, útil para brainstorming e análises amplas."
      limitacoes: "Menos especializado em código e reasoning profundo."
      usos_recomendados: "Análise geral, integração de múltiplos arquivos, brainstorming."
    deepseek-coder:
      foco: "Especializado em código, ideal para análise, geração e otimização de scripts e automações."
      pontos_fortes: "Ótimo para tarefas técnicas, revisão de código, automação."
      limitacoes: "Menos eficiente para reasoning geral ou explicações amplas."
      usos_recomendados: "Geração e refatoração de código, análise técnica."
    deepseek-reasoner:
      foco: "Reasoning avançado, excelente para tarefas que exigem raciocínio profundo."
      pontos_fortes: "Estruturação de soluções, análise lógica, resolução de problemas complexos."
      limitacoes: "Menos focado em código puro."
      usos_recomendados: "Problemas de lógica, análise de arquitetura, raciocínio contextual."
  openai:
    gpt-4:
      foco: "Reasoning geral, equilíbrio entre análise técnica e contextual."
      pontos_fortes: "Compreensão, criatividade, precisão, síntese de informações."
      limitacoes: "Pode ser mais caro e sujeito a limites de uso."
      usos_recomendados: "Tarefas que exigem equilíbrio entre código e reasoning, explicações, síntese."
    gpt-4-turbo:
      foco: "Versão otimizada do GPT-4, mais rápida e eficiente."
      pontos_fortes: "Performance, custo-benefício, reasoning geral."
      limitacoes: "Pode ter pequenas diferenças de output em relação ao GPT-4 padrão."
      usos_recomendados: "Mesmos usos do GPT-4, com foco em agilidade."
  perplexity:
    sonar-deep-research:
      foco: "Busca avançada na web, integração de informações externas."
      pontos_fortes: "Traz dados atualizados, referências e insights da web."
      limitacoes: "Pode gerar respostas extensas, com excesso de detalhes ou over-engenharia. Menos refinamento."
      usos_recomendados: "Quando é necessário contexto externo, atualização ou comparação de fontes."
    sonar-reasoning-pro:
      foco: "Reasoning com apoio de busca, análise de múltiplas fontes."
      pontos_fortes: "Verificação de fatos, síntese de informações externas."
      limitacoes: "Pode ser menos objetivo, respostas mais abertas."
      usos_recomendados: "Tarefas que exigem checagem de informações e múltiplas perspectivas."
  ollama:
    codellama:7b:
      foco: "Programação/código, modelo leve."
      pontos_fortes: "Análise, geração e refatoração de código, rápido e eficiente."
      limitacoes: "Menos reasoning geral."
      usos_recomendados: "Automação, scripts, revisão técnica."
    llama3.1:8b:
      foco: "Generalista, linguagem natural."
      pontos_fortes: "Compreensão de texto, explicações, análise geral."
      limitacoes: "Não é especializado em código."
      usos_recomendados: "Prompts mistos, análise geral."
    deepseek-r1:8b:
      foco: "Código e reasoning técnico."
      pontos_fortes: "Debugging, sugestões de arquitetura, análise de lógica."
      limitacoes: "Menos reasoning geral que modelos premium."
      usos_recomendados: "Tarefas técnicas, análise de código."
    codestral:22b:
      foco: "Programação/código, modelo grande."
      pontos_fortes: "Geração e análise de código em grande escala, contexto amplo."
      limitacoes: "Exige mais recursos, pode ser overkill para tarefas simples."
      usos_recomendados: "Grandes projetos, múltiplos arquivos, refatoração profunda."
    devstral:24b:
      foco: "Programação/código, modelo muito grande."
      pontos_fortes: "Análise de múltiplos arquivos, sugestões sofisticadas, refatoração profunda."
      limitacoes: "Muito pesado, uso recomendado apenas quando necessário."
      usos_recomendados: "Projetos grandes, análise sistêmica, refatoração avançada."

# === Lógica de Balanceamento para Interpretação de Resultados ===

balanceamento:
  provider_model:
    # O peso e a confiabilidade da sugestão dependem do provider/model, conforme o mapeamento acima.
    # Exemplos:
    #   - openai/gpt-4: reasoning geral, balanceado, alta confiabilidade.
    #   - deepseek-coder: código, alta precisão técnica.
    #   - perplexity: busca externa, pode trazer excesso de detalhes ou over-engenharia.
    #   - ollama/codellama: rápido e eficiente para código, menos reasoning geral.
  arquivos:
    # Menos arquivos: resposta mais focada e específica.
    # Mais arquivos: resposta mais abrangente, análise sistêmica.
    # O tipo dos arquivos influencia o tipo de sugestão esperada.
  temperature:
    # Temperatura baixa: respostas mais conservadoras e precisas.
    # Temperatura alta: respostas mais criativas, mas potencialmente menos objetivas.
    # O impacto do temperature varia conforme o modelo/provider.
  tendencias:
    # perplexity: tende a "viajar" e trazer excesso de dados, mesmo com temperature baixa.
    # deepseek-reasoner: reasoning profundo, mas menos focado em código.
    # openai: balanceado, bom para síntese e explicação.
    # ollama: modelos open-source podem ser superiores em tarefas específicas.
  objetivo:
    # O objetivo da análise (foco, abrangência, criatividade, precisão) deve guiar o peso de cada aspecto.
    # Exemplo: para refatoração de código, priorizar modelos técnicos; para brainstorming, priorizar criatividade e diversidade.

# A IA deve cruzar esses fatores para gerar um score ou ranking de relevância para cada sugestão, facilitando a extração do máximo valor do conteúdo gerado.
