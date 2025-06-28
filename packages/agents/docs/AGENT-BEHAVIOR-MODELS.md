# Guia de Termos e Sufixos em Modelos de IA

Este guia explica os principais termos, sufixos e convenções encontrados em nomes de modelos de IA, especialmente úteis para agentes autônomos, workflows multimodais e automação Slice/ALIVE.

cd /caminho/para/user_data/models
# Exemplo para Hugging Face
wget https://huggingface.co/namespace/model1/resolve/main/model1.safetensors
wget https://huggingface.co/namespace/model2/resolve/main/model2.safetensors

---

## **1. instruct**
- **Significado:** Modelo ajustado (fine-tuned) para seguir instruções humanas de forma clara, útil e segura.
- **Uso:** Ideal para agentes, automação, chatbots, workflows, tarefas orientadas a comandos.
- **Exemplo:** `Llama-3.1-8B-Instruct`, `Qwen2.5-Omni-7B-Instruct`
- **Dica:** Prompts diretos funcionam melhor: "Resuma o texto abaixo", "Traduza para inglês", etc.

---

## **2. base**
- **Significado:** Modelo "cru", sem ajuste específico para instruções. Gera texto de forma livre, sem foco em seguir comandos.
- **Uso:** Pesquisa, geração criativa, experimentação, fine-tuning customizado.
- **Exemplo:** `Llama-2-7B-Base`, `bert-base-portuguese-cased`
- **Dica:** Pode ser menos confiável para tarefas que exigem obediência a comandos.

---

## **3. chat**
- **Significado:** Modelo ajustado para conversação, diálogo e interação natural com humanos.
- **Uso:** Chatbots, assistentes virtuais, interfaces conversacionais.
- **Exemplo:** `Llama-2-7B-Chat`, `OpenChat-3.5`
- **Dica:** Responde de forma mais natural, mantém contexto de diálogo.

---

## **4. vision**
- **Significado:** Modelo multimodal capaz de processar, analisar e entender imagens (além de texto).
- **Uso:** Análise de imagens, OCR, perguntas sobre fotos, automação visual.
- **Exemplo:** `Llama-3-Vision`, `Qwen-Vision`, `Llama-Guard-3-11B-Vision`
- **Dica:** Permite prompts que combinam texto e imagem.

---

## **5. code**
- **Significado:** Modelo ajustado para tarefas de programação: geração, explicação, refatoração de código.
- **Uso:** Assistentes de código, automação de refatoração, explicação de trechos.
- **Exemplo:** `CodeLlama-34B`, `StarCoder`, `DeepSeek-Coder`
- **Dica:** Nem todo modelo code faz code completion puro; alguns são melhores para explicação e análise.

---

## **6. scout**
- **Significado:** Termo menos padronizado, mas geralmente indica modelo/agente especializado em busca, exploração, coleta de informações ou varredura de dados.
- **Uso:** Agentes de pesquisa, coleta de dados, crawling, análise exploratória.
- **Exemplo:** `ScoutLM`, `DataScout` (nomes hipotéticos ou experimentais)
- **Dica:** Verifique sempre a documentação do modelo para entender o foco real.

---

## **7. omni**
- **Significado:** Indica modelo "universal" ou multimodal, capaz de lidar com múltiplos tipos de entrada (texto, imagem, áudio, etc.).
- **Uso:** Agentes generalistas, automação multimodal.
- **Exemplo:** `Qwen2.5-Omni-7B`

---

## **8. paraphrase**
- **Significado:** Modelo treinado para reescrever frases mantendo o significado (paráfrase).
- **Uso:** Deduplicação, reescrita, simplificação de texto.
- **Exemplo:** `paraphrase-multilingual-MiniLM-L12-v2`

---

## **9. multilingual / multi**
- **Significado:** Modelo treinado para múltiplos idiomas.
- **Uso:** Agentes globais, tradução, análise de texto em diferentes línguas.
- **Exemplo:** `intfloat/multilingual-e5-large-instruct`

---

## **10. large / xl / xxl / 7B / 70B / 104B**
- **Significado:** Indica o tamanho do modelo (quantidade de parâmetros). Quanto maior, mais "inteligente" e caro de rodar.
- **Uso:** Escolha conforme recursos disponíveis e necessidade de performance.
- **Exemplo:** `Llama-2-70B`, `command-r-plus-104B`, `MiniLM-L12-v2`

---

## **11. mini / small / tiny**
- **Significado:** Modelos compactos, rápidos, ideais para edge, prototipação ou ambientes com poucos recursos.
- **Exemplo:** `MiniLM`, `TinyLlama`

---

## **12. instruct-v1, v2, etc.**
- **Significado:** Versão do ajuste instruct. Versões mais altas geralmente trazem melhorias de alinhamento e performance.
- **Exemplo:** `OpenHermes-2.5-Mistral-instruct-v2`

---

## **13. stt / tts**
- **Significado:**
  - **stt:** Speech-to-Text (transcrição de áudio para texto)
  - **tts:** Text-to-Speech (síntese de voz)
- **Exemplo:** `whisper_stt`, `silero_tts`

---

## **14. ner**
- **Significado:** Named Entity Recognition (Reconhecimento de Entidades Nomeadas)
- **Uso:** Extração de nomes, datas, locais, etc. de textos.
- **Exemplo:** `bertimbau-base-lener_br`

---

## **15. base64 / quantized / int4 / int8**
- **Significado:** Indica formato de compressão ou quantização do modelo para rodar em hardware limitado.
- **Exemplo:** `Llama-2-7B-int4`

---

## **16. instruct, chat, base, vision, code, scout — Resumo Rápido**
| Sufixo   | Foco Principal                | Ideal para...                |
|----------|------------------------------|------------------------------|
| instruct | Seguir comandos/instruções   | Agentes, automação, assistente|
| chat     | Conversação natural          | Chatbots, diálogos           |
| base     | Geração livre, pesquisa      | Pesquisa, fine-tuning        |
| vision   | Imagem + texto (multimodal)  | OCR, análise visual          |
| code     | Programação                  | Geração/explicação de código |
| scout    | Busca/exploração             | Pesquisa, crawling           |

---

## **17. embedding**
- **Significado:** Representação vetorial densa de um texto, imagem ou outro dado, criada para capturar o significado semântico e permitir comparação eficiente.
- **Uso:** Busca semântica, memória vetorial, RAG (Retrieval Augmented Generation), deduplicação, clustering, recomendação.
- **Exemplo de modelos:** `intfloat/multilingual-e5-large-instruct`, `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, `jinaai/jina-embeddings-v3`
- **Como funciona:** O modelo converte textos (ou imagens) em vetores numéricos de alta dimensão. Vetores próximos indicam conteúdos semanticamente similares.
- **Para agentes:** Essencial para memória contextual, busca inteligente, sumarização baseada em contexto e integração de múltiplas fontes de informação.

---

## **18. guard**
- **Significado:** Modelos ou mecanismos projetados para filtrar, moderar, validar ou proteger a entrada/saída de outros modelos de IA, prevenindo respostas inadequadas, inseguras ou fora de política.
- **Uso:** Moderação de conteúdo, segurança, compliance, validação de prompts e respostas, proteção contra alucinações ou vazamento de dados sensíveis.
- **Exemplo de modelos:** `Llama-Guard-3-11B-Vision`, `Llama-Guard-7B`, sistemas de "prompt guard" ou "output guard".
- **Como funciona:** O guard atua como um "porteiro" — recebe o texto (ou imagem) antes ou depois do modelo principal, avalia riscos, bloqueia ou ajusta conforme regras de segurança e políticas definidas.
- **Para agentes:** Essencial em ambientes empresariais, aplicações sensíveis, automação com exposição pública ou integração com usuários finais.

---

## **19. token classification**
- **Significado:** Tarefa de IA/NLP onde cada token (palavra, subpalavra ou caractere) de um texto é classificado individualmente, geralmente para identificar entidades, categorias ou funções gramaticais.
- **Uso:** Reconhecimento de Entidades Nomeadas (NER), análise gramatical, extração de informações, segmentação de texto.
- **Exemplo de modelos:** `bert-base-cased` (usado para NER), `Luciano/bertimbau-base-lener_br`, modelos BERT, RoBERTa, etc. com cabeçote de classificação de token.
- **Como funciona:** O modelo processa o texto e atribui um rótulo a cada token, como "B-PESSOA", "I-LOCAL", "O" (fora de entidade), etc.
- **Para agentes:** Fundamental para extração estruturada de dados, automação de compliance, análise de documentos e integração com sistemas de informação.

---

## **20. Zero-Shot Image Classification**
- **Significado:** Classificação de imagens em categorias nunca vistas durante o treinamento, usando apenas descrições textuais das classes.
- **Uso:** Classificação flexível, adaptação a novos domínios sem re-treinar o modelo.
- **Exemplo de modelos:** `CLIP`, `BLIP`, `OpenCLIP`, `Florence`
- **Como funciona:** O modelo compara a imagem com descrições textuais das classes e escolhe a mais similar.
- **Para agentes:** Permite classificar imagens em tempo real para categorias dinâmicas, útil em automação e análise visual.

---

## **21. Fill-Mask**
- **Significado:** Tarefa de prever a(s) palavra(s) que preenchem uma lacuna (máscara) em uma frase.
- **Uso:** Autocompletar, correção, análise de contexto, geração de texto.
- **Exemplo de modelos:** `bert-base-cased`, `roberta-base`, `distilbert-base-uncased`
- **Como funciona:** O modelo recebe um texto com um token especial (ex: [MASK]) e sugere as melhores opções para preencher.
- **Para agentes:** Útil para análise de contexto, sugestões inteligentes e automação de preenchimento de dados.

---

## **22. Text Ranking**
- **Significado:** Ordenação de textos (documentos, respostas, sentenças) por relevância em relação a uma consulta.
- **Uso:** Busca semântica, RAG, sistemas de recomendação, FAQ bots.
- **Exemplo de modelos:** `colbert`, `ANCE`, `sentence-transformers/ms-marco-TinyBERT-L-2-v2`
- **Como funciona:** O modelo avalia a similaridade entre a consulta e cada texto, retornando um ranking.
- **Para agentes:** Essencial para busca inteligente, priorização de respostas e integração com bases de conhecimento.

---

## **23. sentence-similarity**
- **Significado:** Medida de quão semanticamente próximas são duas sentenças/textos.
- **Uso:** Deduplicação, busca, recomendação, clustering, análise de plágio.
- **Exemplo de modelos:** `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, `intfloat/multilingual-e5-large-instruct`
- **Como funciona:** O modelo gera embeddings para cada sentença e calcula a similaridade (ex: cosseno) entre os vetores.
- **Para agentes:** Permite comparar respostas, identificar redundâncias e sugerir conteúdos relacionados.

---

## **24. Automatic Speech Recognition (ASR)**
- **Significado:** Conversão automática de fala (áudio) em texto.
- **Uso:** Transcrição, legendas, automação de atendimento, acessibilidade.
- **Exemplo de modelos:** `whisper`, `wav2vec2`, `silero_stt`
- **Para agentes:** Permite entrada de voz, automação de transcrições e integração com sistemas de voz.

---

## **25. Text-to-Speech (TTS)**
- **Significado:** Conversão de texto em fala (áudio).
- **Uso:** Leitura automática, acessibilidade, assistentes virtuais, robôs.
- **Exemplo de modelos:** `silero_tts`, `coqui-ai/TTS`, `google-tts`
- **Para agentes:** Permite saída de voz, automação de respostas faladas e integração com sistemas de áudio.

---

## **26. Text-to-Audio**
- **Significado:** Geração de áudio a partir de texto, podendo incluir música, efeitos sonoros ou fala.
- **Uso:** Criação de conteúdo, automação multimídia, geração de sons personalizados.
- **Exemplo de modelos:** `bark`, `audioldm`, `musicgen`
- **Para agentes:** Expande as capacidades multimodais, permitindo geração de sons além da fala.

---

## **27. Audio Classification**
- **Significado:** Classificação de áudios em categorias (ex: música, fala, ruído, emoção, comando).
- **Uso:** Detecção de eventos, automação de monitoramento, análise de sentimentos em áudio.
- **Exemplo de modelos:** `yamnet`, `panns`, `audioset`
- **Como funciona:** O modelo processa o áudio e atribui um rótulo ou probabilidade para cada classe.
- **Para agentes:** Permite automação de triagem, monitoramento ambiental e análise de interações por áudio.

---

## **28. Tabular Classification**
- **Significado:** Classificação de registros (linhas) em tabelas de dados estruturados (ex: CSV, SQL) em categorias pré-definidas.
- **Uso:** Diagnóstico médico, detecção de fraude, classificação de clientes, análise de crédito.
- **Exemplo de modelos:** `RandomForestClassifier`, `XGBoost`, `CatBoost`, `mljs/DecisionTreeClassifier`, modelos scikit-learn, AutoML.
- **Como funciona:** O modelo aprende padrões em colunas (features) para prever a classe de cada linha.
- **Para agentes:** Permite automação de decisões baseadas em dados tabulares, integração com sistemas empresariais e análise de grandes volumes de dados estruturados.

---

## **29. Tabular Regression**
- **Significado:** Predição de valores numéricos contínuos a partir de dados tabulares estruturados.
- **Uso:** Previsão de preços, estimativa de demanda, análise de risco, previsão de vendas.
- **Exemplo de modelos:** `RandomForestRegressor`, `XGBoostRegressor`, `mljs/DecisionTreeRegression`, modelos scikit-learn, AutoML.
- **Como funciona:** O modelo aprende relações entre features e o valor alvo, prevendo números em vez de classes.
- **Para agentes:** Essencial para automação de previsões, análise financeira, planejamento e otimização de recursos.

---

## **30. Time Series Forecasting**
- **Significado:** Previsão de valores futuros em séries temporais (dados ordenados no tempo), considerando padrões, tendências e sazonalidade.
- **Uso:** Previsão de demanda, estoque, clima, vendas, consumo de energia.
- **Exemplo de modelos:** `ARIMA`, `Prophet`, `LSTM`, `mljs/TimeSeries`, `scikit-learn`, `gluonts`, `DeepAR`.
- **Como funciona:** O modelo analisa o histórico temporal para prever próximos valores, podendo incorporar múltiplas variáveis e ciclos.
- **Para agentes:** Fundamental para automação de planejamento, detecção de anomalias, ajuste dinâmico de recursos e tomada de decisão baseada em tempo.

---

## **31. OCR (Reconhecimento Óptico de Caracteres)**
- **Categoria:** Computer Vision > Image-to-Text
- **Contexto:** OCR converte imagens (fotos, documentos escaneados, PDFs) em texto digital. É fundamental para digitalização de documentos, automação de entrada de dados e acessibilidade. Em frameworks modernos, pode aparecer como "Image-to-Text" ou "Document Question Answering" quando aplicado a documentos estruturados.
- **Aplicações típicas:** Leitura automática de notas fiscais, digitalização de livros, extração de texto de placas, automação de formulários.

---

## **32. Reconhecimento de Conexões (em diagramas, fluxogramas, etc.)**
- **Categoria:** Computer Vision > Image Feature Extraction / Object Detection / Keypoint Detection
- **Contexto:** O reconhecimento de conexões envolve identificar relações visuais entre elementos em uma imagem, como setas, linhas, conectores em diagramas ou fluxogramas. Pode envolver detecção de objetos (setas/linhas), extração de características (features) ou pontos-chave (keypoints). Em contextos avançados, pode ser chamado de "Graph Extraction".
- **Aplicações típicas:** Digitalização de fluxogramas, reconstrução de diagramas, análise de mapas mentais, automação de engenharia e arquitetura.

---

## **33. Opções de Carregamento e Otimização de Modelos (textgen-webui)**

### Flags de Otimização
- **load-in-8bit:** Carrega o modelo usando quantização de 8 bits. Reduz uso de RAM/VRAM, com pequena perda de precisão. Ideal para placas com pouca memória.
- **load-in-4bit:** Quantização ainda mais agressiva (4 bits). Usa menos memória, mas pode perder mais precisão. Útil para modelos grandes em hardware limitado.
- **torch-compile:** Usa `torch.compile` (PyTorch 2.0+) para tentar acelerar a inferência. Pode melhorar performance em algumas GPUs/CPUs.
- **use_flash_attention_2:** Ativa uma implementação otimizada de atenção (se suportado pelo modelo/hardware). Pode acelerar modelos Llama e similares.
- **use_double_quant:** Otimização extra para quantização 4bit. Usado junto com `load-in-4bit` para reduzir ainda mais o uso de memória.
- **trust-remote-code:** Permite rodar código customizado do repositório do modelo (necessário para alguns modelos do Hugging Face). Use apenas se confiar na fonte.

**Como usar:**
- Pela interface web: selecione as opções ao carregar o modelo.
- Pela linha de comando ou `CMD_FLAGS.txt`:
  ```
  --load-in-8bit --use_flash_attention_2 --torch-compile
  ```

---

## **34. Model Loader (textgen-webui)**

O **Model Loader** é o mecanismo que o textgen-webui usa para carregar diferentes formatos de modelo. A escolha correta garante compatibilidade e performance.

### Loaders disponíveis:
- **transformers:** Para modelos Hugging Face (`.bin`, `.safetensors`). Suporta ampla variedade de arquiteturas.
- **exllama / exllama2:** Otimizados para modelos Llama em `.safetensors`. Mais rápido e eficiente para Llama-family.
- **llama.cpp:** Para modelos `.gguf` (quantizados, ideais para CPU/edge ou uso leve de GPU).
- **ggml:** Para modelos `.ggml` (formato antigo, menos usado atualmente).
- **Auto:** O webui tenta escolher automaticamente o loader mais adequado (funciona na maioria dos casos).

### Como escolher o loader:
- Se o modelo é `.gguf` → **llama.cpp**
- Se é `.safetensors` de Llama → **exllama** ou **exllama2**
- Se é `.bin` ou `.safetensors` Hugging Face (não-Llama) → **transformers**
- Se não sabe, tente **Auto** primeiro

**Como definir:**
- Na interface web: selecione o loader ao carregar o modelo.
- No `CMD_FLAGS.txt` ou linha de comando:
  ```
  --loader exllama
  --loader transformers
  --loader llama.cpp
  ```

**Dica:**
- Modelos Llama grandes rodam melhor com exllama/exllama2.
- Modelos quantizados para CPU (gguf) rodam melhor com llama.cpp.
- Modelos Hugging Face genéricos use transformers.

---

## **35. Orquestração de Modelos em Ambientes Distribuídos (Slice/ALIVE)**

### Onde o modelo roda: máquina do modelo ou máquina da execução?
- O modelo **sempre roda na máquina onde o servidor (ex: textgen-webui, Ollama, LiteLLM) está em execução**.
- O processamento (CPU/GPU, RAM) ocorre na máquina que executa o serviço, independentemente de onde o arquivo do modelo está armazenado.
- Exemplo: Se o textgen-webui está rodando na localcloud, todo o processamento é feito lá, mesmo que você acesse da workstation.

### Comportamento com NFS/mount points
- Se você monta `/media/data/models` da localcloud na workstation via NFS, os arquivos de modelo ficam fisicamente na localcloud, mas aparecem como locais na workstation.
- Se rodar o servidor na workstation, ele lê os arquivos via NFS, mas o processamento é feito na workstation.
- O acesso ao modelo pode ser mais lento (latência de rede, I/O), mas o uso de hardware é sempre da máquina que executa o serviço.

### Carregamento, limpeza e escalabilidade de modelos no textgen-webui
- **Baixar modelo:** Baixe modelos via interface web, script ou manualmente para a pasta de modelos.
- **Carregar modelo:** Só é carregado na RAM/VRAM quando selecionado e carregado via interface ou API.
- **Limpar modelo:** Ao "unload" (descarrregar) um modelo, libera RAM/VRAM. Você pode deletar arquivos do disco a qualquer momento (desde que não estejam carregados).
- **Vários modelos:** O textgen-webui permite vários modelos no disco, mas **só carrega um por vez na memória** (igual ao Ollama).
- **Escalar:** Para múltiplos modelos ativos, rode múltiplas instâncias do webui, cada uma em uma porta diferente, cada uma com um modelo carregado.

### Comparativo: textgen-webui vs Ollama
- **Ollama:** Só 1 modelo carregado por vez por instância. Troca de modelo = descarrega um, carrega outro.
- **textgen-webui:** Também só 1 modelo carregado por instância. Permite múltiplos modelos no disco, mas só 1 ativo. Para múltiplos modelos ativos, rode múltiplas instâncias.

### Dicas práticas para ambientes Slice/ALIVE
- **/media/data** é o storage de produção e compartilhamento.
- Cada máquina pode rodar seu próprio webui, usando modelos locais ou via NFS.
- O processamento é sempre na máquina que executa o serviço, não onde o arquivo está fisicamente.
- Para liberar espaço: delete modelos não usados do disco, use scripts para mover modelos entre máquinas conforme demanda.
- Para escalar: rode múltiplas instâncias do webui, cada uma com um modelo diferente, ou distribua a carga entre localcloud e workstation.
- Prefira rodar modelos grandes na localcloud (mais threads, sem interface gráfica, menos disputa de RAM).
- Use a workstation para prototipação, testes rápidos, ou modelos que exigem GPU NVIDIA.
- Use NFS para compartilhar modelos, mas lembre-se que o I/O pode ser gargalo para modelos muito grandes.
- Automatize scripts para mover/carregar/limpar modelos conforme o ciclo de uso.

### Resumo prático
- O modelo roda na máquina que executa o servidor, não onde está armazenado.
- NFS permite compartilhar modelos, mas processamento é sempre local ao serviço.
- textgen-webui e Ollama só carregam 1 modelo por instância; para múltiplos, rode múltiplas instâncias.
- Gerencie espaço e escalabilidade com scripts e automação.

---

## **36. Compatibilidade de Modelos com Hardware e Frameworks**

### Resumo Visual de Compatibilidade

| Formato/Framework      | CPU | GPU NVIDIA | GPU AMD | Observação                        |
|------------------------|-----|------------|---------|-----------------------------------|
| .gguf / llama.cpp      | 👍  | 👍         | 👍*     | *AMD/Apple: suporte parcial       |
| .safetensors / .bin    | 👍* | 👍         | 👎*     | *CPU lento, AMD só com ROCm       |
| Diffusion/StableDiff.  | 👎  | 👍         | 👎*     | *AMD só ROCm, instável            |
| transformers (HF)      | 👍* | 👍         | 👎*     | *CPU lento, AMD só ROCm           |

### Checklist para Análise de Compatibilidade (Hugging Face)

1. **Verifique a seção "Hardware requirements" ou "Usage"**
   - Procure por menções a CUDA, NVIDIA, ROCm, CPU, etc.
2. **Formato do modelo**
   - `.gguf`/`.ggml` → CPU/edge, multiplataforma
   - `.safetensors`/`.bin` → geralmente GPU NVIDIA
3. **Tags e Metadados**
   - Veja tags como `cuda`, `nvidia`, `rocm`, `llama.cpp`, `gguf`, etc.
4. **Framework usado**
   - PyTorch: NVIDIA (CUDA), ROCm (AMD, experimental)
   - llama.cpp: CPU, suporte parcial a AMD/Apple
5. **Exemplos de código**
   - `.to('cuda')` → espera GPU NVIDIA
   - `.to('cpu')` → pode rodar em CPU (lento para modelos grandes)
6. **Tamanho do modelo**
   - Modelos grandes (>7B) sem quantização: só viáveis em GPU potente
   - Modelos quantizados: viáveis em CPU, mais lentos

### Diagrama Visual de Decisão (Mermaid)

```mermaid
graph TD
    A[Modelo no Hugging Face] --> B{Formato do modelo}
    B -- .gguf/.ggml --> C[Use llama.cpp<br>CPU/edge, multiplataforma]
    B -- .safetensors/.bin --> D{Framework}
    D -- transformers/PyTorch --> E{Hardware}
    E -- NVIDIA disponível --> F[Use GPU NVIDIA]
    E -- AMD disponível --> G{ROCm suportado?}
    G -- Sim --> H[Use ROCm (experimental)]
    G -- Não --> I[Use CPU (lento)]
    E -- Só CPU --> I[Use CPU (lento)]
    D -- llama.cpp --> C
    B -- Outro formato --> J[Verifique documentação]
```

### Dicas rápidas
- Prefira NVIDIA para máxima performance.
- Use .gguf/llama.cpp para portabilidade e baixo recurso.
- AMD só é viável com ROCm (experimental) ou via llama.cpp.
- Sempre consulte exemplos e tags do modelo.

---

## **Dicas Gerais**
- Sempre consulte a documentação oficial do modelo para detalhes e limitações.
- Sufixos e nomes podem variar entre projetos, mas os conceitos acima são amplamente adotados.
- Para agentes Slice/ALIVE, prefira modelos instruct/chat para automação e orquestração, vision para multimodalidade, e embeddings multilingual para memória vetorial.

---

## **37. Comparativo Prático de Famílias de Modelos LLM para Código**

### Llama (Meta)
- **O que é:** Modelo base, generalista, multilingue, open source.
- **Pontos fortes:** Geração de texto, instrução, chat, RAG, boa base para fine-tuning.
- **Para código:** Não é especializado, mas responde bem a prompts simples de código.
- **Limitações:** Pode confundir sintaxes, não é "code first", não entende contexto de projetos complexos.
- **Quando usar:** Chatbots, agentes generalistas, prototipação, automação leve.

---

### CodeLlama (Meta)
- **O que é:** Variante do Llama treinada especificamente para programação.
- **Pontos fortes:** Geração de código, explicação, refatoração, suporte a múltiplas linguagens (Python, C, C++, JavaScript, TypeScript, Bash, etc.).
- **Para código:** Muito melhor que Llama puro. Tem variantes para "Instruct" (segue comandos), "Python" (foco em Python), "Code" (geral), "Code Instruct" (segue instruções de código).
- **Limitações:** Pode misturar sintaxes se o prompt for ambíguo, nem sempre entende contexto de frameworks modernos.
- **Quando usar:** Assistentes de código, automação de refatoração, geração de snippets, explicação de código.

---

### Mixtral (Mistral/Mixtral)
- **O que é:** Modelo MoE (Mixture of Experts), open source, multilingue, variantes 8x7B, 8x22B, etc.
- **Pontos fortes:** Muito bom em instrução, reasoning, chat, RAG, e razoável para código (mas não é "code first").
- **Para código:** Gera código, mas não é tão preciso quanto CodeLlama ou modelos dedicados. Melhor para prompts mistos (texto + código).
- **Limitações:** Pode errar sintaxe, não é especialista em nenhuma linguagem.
- **Quando usar:** Agentes generalistas, chatbots que precisam misturar texto e código, automação com reasoning.

---

### WizardLM / WizardCoder / WizardLM2
- **O que é:** Modelos baseados em Llama/Mistral, ajustados com dados de instrução e código (WizardCoder é o "code first").
- **Pontos fortes:** Muito bons em seguir instruções, explicação de código, geração de código em múltiplas linguagens.
- **Para código:** WizardCoder é excelente para Python, razoável para JS/TS, bom para explicação e refatoração.
- **Limitações:** Pode "alucinar" sintaxe, especialmente em linguagens menos populares. Alguns modelos tendem a preferir Python.
- **Quando usar:** Assistentes de código, bots de explicação, automação de tarefas técnicas.

---

### Qwen/Qwen2/Qwen3 (Alibaba)
- **O que é:** Modelos multilingues, variantes "Code" e "Instruct", open weights, muito bons em reasoning e tasks complexas.
- **Pontos fortes:** Ótimos em instrução, reasoning, geração de código, multilinguismo, variantes "Code" são especializadas em programação.
- **Para código:** Qwen2/Qwen3-Code são muito bons para Python, JS, Java, C, etc. Costumam ser mais "assertivos" em Node.js do que Llama/CodeLlama.
- **Limitações:** Documentação menos extensa, comunidade menor que Llama, pode ter viés para Python em prompts genéricos.
- **Quando usar:** Agentes técnicos, automação de código, tasks multilingues, integração com sistemas asiáticos.

---

### Outros modelos relevantes para código

#### DeepSeek-Coder
- Foco total em programação, excelente para múltiplas linguagens, muito bom em completude e explicação.

#### StarCoder / StarCoder2
- Foco em código, especialmente bom para Python, JS, Java, C, SQL. Ótimo para completude e explicação.

#### Phind-CodeLlama
- Variante do CodeLlama ajustada para busca e explicação, excelente para "search + code".

---

### Dicas práticas para escolher modelo de código
- **Quer assertividade em Node.js/JS/TS?** Qwen2-Code, DeepSeek-Coder, StarCoder2 são mais "assertivos" que CodeLlama puro.
- **Quer explicação/refatoração?** WizardCoder, CodeLlama-Instruct, StarCoder2.
- **Quer completude e snippets?** DeepSeek-Coder, StarCoder2, CodeLlama.
- **Quer multilinguismo?** Qwen3, Mixtral, DeepSeek-Coder.
- **Quer reasoning + código?** Mixtral, Qwen3, WizardLM2.

---

### Atenção!
- Modelos "code first" tendem a preferir Python se o prompt for ambíguo ("escreva uma função que..."). Sempre especifique a linguagem: "em JavaScript", "em TypeScript", etc.
- Alguns modelos podem misturar sintaxes se o contexto não estiver claro.
- Teste sempre com exemplos reais do seu stack.

---

### Tabela-Resumo para Consulta Rápida

| Modelo/Família      | Code First | Melhor em...         | Limitações                | Linguagens fortes      |
|---------------------|------------|----------------------|---------------------------|-----------------------|
| Llama               | Não        | Texto, instrução     | Não é especialista        | Multilingue           |
| CodeLlama           | Sim        | Geração, explicação  | Pode misturar sintaxes    | Python, JS, Bash      |
| Mixtral             | Parcial    | Reasoning, instrução | Não é code first          | Multilingue           |
| WizardCoder         | Sim        | Explicação, refator  | Viés para Python          | Python, JS, C         |
| Qwen2/Qwen3-Code    | Sim        | Assertividade, multi | Documentação menor        | Python, JS, Java      |
| DeepSeek-Coder      | Sim        | Completude, multi    | Comunidade menor          | Python, JS, C, Java   |
| StarCoder2          | Sim        | Completude, explic.  | Viés para Python/JS       | Python, JS, SQL, C    |

---

> Atualize este guia conforme surgirem novos termos ou modelos relevantes para o ecossistema.
>
## 2024-06-XX — Modelos LLM que Afinam Melhor com Node.js (e menos "pythonzeira")

- [x] Observação prática: Muitos modelos LLM open source (e até closed) têm viés forte para Python, especialmente quando o prompt é ambíguo ou pede "escreva uma função" sem especificar linguagem.
- [x] Dica: Sempre especifique  JavaScript" ou "em TypeScript" no prompt para evitar que o modelo gere código Python por padrão.
- [x] Modelos que afinam melhor com Node.js/JS/TS:
  - **Qwen2-Code, Qwen3-Code:** Costumam ser mais assertivos em JS/TS, menos viés Python, bons para automação Node.js.
  - **DeepSeek-Coder:** Muito bom para múltiplas linguagens, assertivo em Node.js, gera código moderno e idiomático.
  - **StarCoder2:** Ótimo para JS/TS, SQL, Python, mas responde bem a prompts claros para Node.js.
  - **CodeLlama-Instruct:** Bom para JS/TS, mas pode "pythonizar" se o prompt for vago.
  - **Phind-CodeLlama:** Foco em busca + código, responde bem a prompts de automação, mas ainda pode preferir Python se não for explícito.
- [x] Modelos que "pythonizam" tudo:
  - **WizardCoder, WizardLM2:** Excelentes para Python, mas tendem a gerar Python até quando o prompt pede JS, se não for muito claro.
  - **Llama base:** Não é code first, mas se pedir código, geralmente gera Python.
- [x] Dica de ouro: Para automação Node.js, sempre inclua exemplos, contexto de uso ("em um projeto Node.js", "usando fs/promises", "com async/await", etc.) e peça testes em JS/TS.
- [x] Moral: Aqui é Node.js raiz, mas a IA sempre tenta "pythonizar" se der brecha. Prompt claro = código certo!

## 38. Hiperparâmetros em Fine-Tuning de LLMs: Conceitos, Exemplos e Estratégias

### O que são hiperparâmetros?
- Hiperparâmetros são "configurações de controle" do processo de treinamento de um modelo. Eles determinam **como** o modelo aprende, mas não são aprendidos pelo modelo — você define antes de treinar.
- Ajustar hiperparâmetros é essencial para garantir que o modelo aprenda de forma eficiente, sem overfitting (decorar o dataset) ou underfitting (não aprender nada útil).

---

### Exemplos de hiperparâmetros comuns em fine-tuning de LLMs

- **learning_rate (taxa de aprendizado):**
  - Controla o tamanho dos passos que o modelo dá ao ajustar seus pesos.
  - **Baixo:** Aprendizado mais lento, menos risco de instabilidade, pode exigir mais epochs.
  - **Alto:** Aprendizado rápido, mas pode "pular" ótimas soluções ou ficar instável.
  - **Dica:** Comece com valores entre 1e-5 e 5e-5 para LLMs, ajuste conforme o comportamento.

- **batch_size (tamanho do lote):**
  - Quantos exemplos o modelo processa antes de atualizar os pesos.
  - **Pequeno:** Menos memória, mais ruído, pode ajudar a generalizar.
  - **Grande:** Mais estável, mais rápido, mas exige mais RAM/VRAM.
  - **Dica:** Use o maior batch_size que seu hardware permitir sem travar.

- **num_epochs (número de épocas):**
  - Quantas vezes o modelo passa por todo o dataset.
  - **Poucas epochs:** Menos risco de overfitting, pode não aprender tudo.
  - **Muitas epochs:** Aprende mais, mas pode "decorar" o dataset.
  - **Dica:** Para datasets pequenos, use mais epochs; para grandes, menos.

- **weight_decay (decaimento de peso):**
  - Penaliza pesos grandes para evitar overfitting.
  - **Alto:** Mais regularização, menos overfitting, mas pode limitar aprendizado.
  - **Baixo/zero:** Modelo pode "decorar" exemplos.
  - **Dica:** Valores típicos: 0.01 a 0.1.

- **warmup_steps:**
  - Número de passos iniciais em que o learning_rate sobe gradualmente até o valor final.
  - Ajuda a estabilizar o início do treinamento.
  - **Dica:** 5% a 10% do total de steps é comum.

- **max_seq_length (comprimento máximo da sequência):**
  - Quantos tokens o modelo processa de uma vez.
  - **Curto:** Menos memória, pode truncar exemplos longos.
  - **Longo:** Mais contexto, mais memória.
  - **Dica:** Ajuste conforme o tamanho típico dos seus exemplos.

- **gradient_accumulation_steps:**
  - Acumula gradientes de vários batches antes de atualizar os pesos.
  - Permite simular batch_size maior em hardware limitado.
  - **Dica:** Útil quando batch_size é pequeno por limitação de RAM/VRAM.

---

### Por que ajustar hiperparâmetros? Estratégias e Resultados

- **Cada dataset e objetivo é único:**
  - Datasets pequenos exigem cuidado extra para não "decorar" exemplos (overfitting). Use learning_rate menor, mais epochs, weight_decay maior.
  - Datasets grandes permitem learning_rate maior, menos epochs, batch_size maior.

- **Hardware limita escolhas:**
  - Pouca RAM/VRAM? Use batch_size menor, gradient_accumulation_steps maior.
  - Hardware robusto? Experimente batch_size maior para acelerar.

- **Resultados esperados ao ajustar:**
  - **Learning_rate muito alto:** Modelo oscila, não converge, outputs ruins.
  - **Learning_rate muito baixo:** Treinamento lento, pode não sair do lugar.
  - **Batch_size muito pequeno:** Treinamento instável, outputs variam muito.
  - **Batch_size muito grande:** Treinamento estável, mas pode "perder" nuances do dataset.
  - **Epochs demais:** Modelo começa a "decorar" exemplos, perde capacidade de generalizar.
  - **Weight_decay baixo:** Overfitting, modelo repete exemplos do dataset.

- **Estratégias práticas:**
  - Comece com hiperparâmetros padrão (ex: learning_rate=2e-5, batch_size=8, epochs=3).
  - Monitore métricas de validação (loss, accuracy, perplexity, etc.).
  - Se o modelo não melhora, ajuste learning_rate ou batch_size.
  - Se o modelo "decora" exemplos, aumente weight_decay ou reduza epochs.
  - Use early stopping (parar o treino se não melhorar após X passos).

- **Dica de ouro:**
  - Documente cada experimento, compare resultados e ajuste de forma incremental.
  - Não existe "receita mágica" — ajuste é sempre empírico e depende do seu contexto.

---
