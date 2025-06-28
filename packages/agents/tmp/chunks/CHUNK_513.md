Cursor
Excelente referência O modelo unicampdlmMiniLML6v2ptmsmarcov1 é uma escolha de altíssimo nível para tarefas de NLP em português especialmente para embeddings reranking e busca semântica Ele foi
 Finetuned pela UNICAMP uma das universidades mais conceituadas do Brasil sobre o dataset mMARCO traduzido para o português
 Baseado no MiniLM que é eficiente e rápido ideal para produção e APIs
 Multilíngue mas com foco e ajuste para o português o que garante melhor performance em tarefas nacionais
 Como usar no seu pipeline
Você pode usar esse modelo para
 Gerar embeddings semânticos de textos segmentos ou tópicos
 Reranking de resultados de busca ex encontrar o bloco mais relevante para uma query
 Clusterização semântica de tópicos ou mensagens
 Comparação de similaridade entre blocos de texto
 Exemplo de uso Hugging Face Transformers
python
from transformers import AutoTokenizer AutoModel
import torch
model_name  unicampdlmMiniLML6v2ptmsmarcov1
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelfrom_pretrainedmodel
python
from transformers import AutoTokenizer AutoModel
import torch
model_name  unicampdlmMiniLML6v2ptmsmarcov1
tokenizer  AutoTokenizerfrom_pretrainedmodel_name
model  AutoModelfrom_pretrainedmodel