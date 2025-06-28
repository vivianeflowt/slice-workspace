export const CUSTOM_MODELS = [
  'deepseek-r1-qwen-7b', // LLM distilado focado em reasoning (DeepSeek)
  'am-thinking-v1', // LLM 32B reasoning (AM Team)
  'classify', // Classificação de texto (BERT, Roberta, etc.)
  'embed', // Geração de embeddings (sentence-transformers, BERT, etc.)
  'pos_tag', // POS tagging (análise morfossintática)
] as const;

export type CustomModel = (typeof CUSTOM_MODELS)[number];
