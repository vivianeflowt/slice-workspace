// Modelos oficiais DeepSeek (2025) — https://api-docs.deepseek.com/api/list-models
export const DEEPSEEK_MODELS = [
  'deepseek-chat', // DeepSeek Chat: modelo principal
  'deepseek-reasoner', // DeepSeek Reasoner: reasoning avançado
  'deepseek-coder', // DeepSeek Coder: code LLM
  'deepseek-math', // DeepSeek Math: matemática avançada
  'deepseek-vl', // DeepSeek Vision-Language: multimodal
] as const;

export type DeepseekModel = (typeof DEEPSEEK_MODELS)[number];
