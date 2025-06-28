// Modelos OpenAI disponíveis para Chat Completions (2024/2025)
// Fonte: https://platform.openai.com/docs/models
export const OPENAI_MODELS = [
  // Modelos GPT-4.1, 4.0, 4o (2025, contexto 1M tokens, reasoning avançado)
  'gpt-4.1', // Novo flagship, 1M tokens, reasoning, multimodal
  'gpt-4.1-mini', // Versão compacta, 1M tokens
  'gpt-4.1-nano', // Versão ultra-compacta, 1M tokens
  'gpt-4o', // Multimodal, texto, imagem, áudio, contexto 128K
  'gpt-4', // Standard
  'gpt-4-turbo', // Turbo, contexto ampliado
  'gpt-3.5-turbo', // Standard
  // Modelos legacy e utilitários (apenas se ainda disponíveis na sua conta)
  'gpt-3.5-turbo-instruct', // Successor of text-davinci-003 for completions
  // Modelos multimodais/áudio/imagem
  'whisper-1', // Áudio (transcrição)
  'dall-e-3', // Imagem (geração)
  'dall-e-2', // Imagem (geração)
  'tts-1', // Text-to-speech
  'tts-1-hd', // Text-to-speech HD
] as const;

export type OpenaiModel = (typeof OPENAI_MODELS)[number];
