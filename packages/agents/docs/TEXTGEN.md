# Guia Prático: Como Usar Modelos no text-generation-webui

Este guia é para humanos (e IAs colaborativas) que querem rodar, testar e experimentar modelos de linguagem localmente usando o text-generation-webui. Tudo explicado de forma didática, com dicas para não esquecer nada!

---

## 1. O que é o text-generation-webui?
Interface web (Gradio) para rodar modelos de linguagem (LLMs) localmente, com suporte a múltiplos formatos (Transformers, GGUF, quantizados, etc). Permite baixar, carregar, testar e automatizar modelos de IA generativa.

## 2. Como rodar (Docker recomendado)
```bash
docker run -d \
  -p 7860:7860 -p 5000:5000 \
  -v $PWD/models:/app/models \
  -e CLI_ARGS="--listen --api --chat --trust-remote-code" \
  --name textgen \
  ghcr.io/oobabooga/text-generation-webui:latest
```
- `-v $PWD/models:/app/models`: Garante que os modelos baixados não sumam ao reiniciar o container!

## 3. Baixando modelos
- Pela interface web: use o campo "Download model or LoRA" e insira o nome do modelo HuggingFace (ex: `TheBloke/Llama-2-7B-Chat-GGUF`).
- Manualmente: coloque o modelo na pasta `user_data/models` (GGUF direto, Transformers em subpasta).
- Linha de comando:
  ```bash
  python download-model.py organization/model
  ```

## 4. Carregando modelos
- Selecione o modelo na lista suspensa.
- Ajuste as opções conforme seu hardware (veja abaixo).
- Clique em **Load** e aguarde.

## 5. Opções importantes explicadas
- **Model loader:** Geralmente "Transformers" para modelos HuggingFace.
- **gpu-split:** Divide VRAM entre GPUs (deixe vazio se não souber).
- **load-in-8bit/4bit:** Usa quantização para economizar VRAM (útil em GPUs pequenas).
- **torch-compile:** Otimiza o modelo para performance.
- **use_flash_attention_2:** Ativa FlashAttention v2 (veja explicação abaixo).
- **trust-remote-code:** Permite rodar código customizado do modelo (essencial para muitos modelos HuggingFace, marque e rode o servidor com o flag correspondente).

### O que é FlashAttention?
- Algoritmo otimizado para acelerar e economizar memória na atenção dos Transformers.
- Muito útil em GPUs NVIDIA modernas (Ampere ou mais novas).
- Se der erro, desative e tente novamente.
- [Mais sobre FlashAttention](https://github.com/HazyResearch/flash-attention)

## 5.1. Explicação de opções avançadas

### Maximum CPU memory in GiB (CPU offloading)
- Define o máximo de RAM (em GB) que pode ser usada para mover partes do modelo da GPU para a CPU.
- Útil se sua GPU não tem VRAM suficiente para o modelo inteiro.
- Exemplo prático: Se sua GPU tem 8GB e o modelo precisa de 10GB, 2GB podem ser "offloaded" para a RAM.
- Deixe em 0 para não limitar (usa o quanto precisar). Com 62GB de RAM, pode usar valores altos (16, 32, etc) se necessário.

### alpha_value
- Fator de ajuste para embeddings posicionais (NTK RoPE scaling).
- Valores típicos: 1.75 para 1.5x contexto, 2.5 para 2x contexto.
- Só altere se o modelo/documentação recomendar. Caso contrário, mantenha o padrão (1).

### compute_dtype
- Tipo de dado usado nos cálculos internos do modelo.
- Opções: float16 (recomendado para RTX 4060), bfloat16, float32.
- float16 = mais rápido e econômico em VRAM, ideal para sua GPU.
- Só mude se der erro ou se o modelo pedir.

### quant_type
- Tipo de quantização para modelos 4bit.
- Opção recomendada: nf4 (NormalFloat4), melhor equilíbrio entre compressão e qualidade.
- Só mude se o modelo/documentação pedir.

---

**Configuração recomendada para sua máquina (RTX 4060, 62GB RAM):**
- compute_dtype: float16
- quant_type: nf4
- use_flash_attention_2: Ativado
- load-in-4bit: Ative para modelos grandes
- Maximum CPU memory: 0 ou 16–32 (se usar offloading)
- trust-remote-code: Ative se necessário

Essas opções garantem performance, compatibilidade e aproveitamento máximo do seu hardware!

## 6. Persistência dos modelos (Docker)
- Sempre use volumes para não perder modelos ao reiniciar:
  ```yaml
  volumes:
    - ./models:/app/models
  ```
- Se sumiu, baixe de novo e ajuste o volume!

## 7. Troubleshooting (erros comuns)
- **Erro de dependência:** Instale pacotes dentro do container com `docker exec -it <container> pip install pacote`.
- **Modelo sumiu:** Faltou volume Docker.
- **Erro ao carregar modelo:** Marque "trust-remote-code" e confira logs.
- **GPU não reconhecida:** Verifique drivers e suporte CUDA.

## 8. Links úteis
- [Repositório oficial](https://github.com/oobabooga/text-generation-webui)
- [Wiki: Downloading models](https://github.com/oobabooga/text-generation-webui/wiki/Downloading-models)
- [FlashAttention](https://github.com/HazyResearch/flash-attention)

---

**Dica final:**
Sempre documente o que funcionou para você aqui! Se esquecer, volte neste arquivo. Se aprender algo novo, adicione!


