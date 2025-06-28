// ======================
// OLLAMA_MODELS: Modelos essenciais, úteis e populares para o ambiente Ollama.
// Agrupados por categoria, com comentários detalhados para facilitar curadoria, escolha e manutenção.
// ======================
export const OLLAMA_MODELS = [
  // === LLMs Gerais (conversação, raciocínio, tarefas amplas) ===
  'gemma:2b', // Google Gemma 2B — ultra leve, rápido, ideal para prototipagem e tasks simples
  'gemma:7b', // Google Gemma 7B — mais robusto, bom para tarefas gerais e respostas rápidas
  'llama3:8b', // Llama 3 8B (Meta) — ótimo custo-benefício, tarefas gerais, rápido
  'llama3:70b', // Llama 3 70B (Meta) — muito poderoso, contexto grande, excelente para sumarização e tasks complexas
  'phi3:mini', // Phi-3 Mini — modelo Microsoft, ultra leve, surpreende em tasks de compreensão e sumarização
  'phi3:mini-128k', // Phi-3 Mini 128k — igual ao mini, mas com contexto estendido (útil para chunks grandes)
  'phi4:14b', // Phi-4 14B — eficiente, sumarização rápida, ótimo equilíbrio entre qualidade e performance
  'mixtral:8x7b', // Mixtral 8x7B — mistura de experts, excelente para instrução, tasks amplas e uso geral
  // === LLMs para Código (Code LLMs) ===
  'openchat:7b', // OpenChat 7B — instrução, robusto para devs, bom para chat e code review
  'codellama:7b', // CodeLlama 7B — modelo de código, útil para desenvolvimento e análise de código
  'codellama:13b-instruct',
  'codellama:34b', // CodeLlama 34B — mais robusto, melhor contexto, tasks de código mais complexas
  'codellama:70b', // CodeLlama 70B — só se hardware permitir, contexto extenso, tasks avançadas
  'deepseek-coder:33b', // DeepSeek Coder 33B — avançado, útil para sumarização técnica e codebase grande
  'codestral:22b', // Codestral 22B — código, pesquisa, bom para análise de código e tasks técnicas
  // === LLMs Instruct/Instruction-tuned ===
  'mistral:7b', // Mistral 7B — leve, rápido, ótimo para tasks simples e baixo custo
  'mistral:7b-instruct', // Mistral 7B Instruct — ajustado para instrução, melhor aderência a prompts
  'dolphin-mistral:7b', // Dolphin-Mistral 7B — variante do Mistral, mais obediente a prompts, bom para extração/classificação
  'openhermes-2.5-mistral:7b', // OpenHermes 2.5 Mistral 7B — ajustado para instrução, ótimo para prompts estruturados
  'wizardlm2:7b', // WizardLM2 7B — instrução, pesquisa, sumarização avançada
  // === LLMs para SUMARIZAÇÃO e contexto EXTENSO ===
  'qwen3:8b', // Qwen3 8B — bom custo-benefício, sumarização básica, contexto razoável
  'qwen3:32b', // Qwen3 32B — contexto grande, excelente para sumarização de textos longos
  'deepseek-r1:1.5b', // DeepSeek R1 1.5B — ultra leve, sumarização básica
  'deepseek-r1:8b', // DeepSeek R1 8B — modelo geral, sumarização
  'deepseek-r1:14b', // DeepSeek R1 14B — sumarização robusta, contexto maior
  'deepseek-r1:32b', // DeepSeek R1 32B — contexto grande, sumarização robusta
  'devstral:24b', // Devstral 24B — modelo técnico, sumarização técnica
  'granite3.3:8b', // IBM Granite 3.3 8B — modelo geral, sumarização
  // === LLMs Multimodais (texto + imagem) ===
  'llava:13b', // LLaVA 13B — texto+imagem, tasks visuais, OCR, análise de imagens
  'llama3.2-vision:11b', // Llama 3.2 Vision 11B — multimodal, tarefas visuais avançadas
  'llama3-gradient:8b', // Llama 3 Gradient 8B — multimodal, tarefas visuais leves
  'llama-guard3:8b', // Llama Guard 3 8B — multimodal, tarefas visuais leves, moderação
  'granite3.2-vision:2b', // IBM Granite Vision 2B — multimodal, experimental, análise visual
  'llama4:16x17b', // Llama 4 16x17B — multimodal, contexto gigante, tasks visuais e texto
  // === LLMs para Chat/Conversação ===
  'neural-chat:7b', // Neural Chat 7B — respostas conservadoras, bom para calibrar confiança, chatbots
  // === Embeddings / Vetorização ===
  'nomic-embed-text', // Nomic — embeddings/vetorização de textos, busca semântica
  'paraphrase-multilingual:278m', // Paraphrase Multilingual — embeddings, busca semântica, multilingue
  'bge-m3:567m', // BGE M3 — embeddings, busca semântica, multilingue
  // === Modelos Experimentais / Avançados ===
  'mixtral:8x22b', // Mixtral 8x22B — robusto, ótimo para raciocínio, instrução e sumarização
  'dbrx:132b', // Databricks DBRX 132B — só para hardware de ponta, pesquisa avançada
//   'command-r7b:7b', // Command-R 7B — modelo leve, tarefas de comando, bom para hardware limitado
//   'command-r:35b', // Command-R 35B — bom para tarefas de comando, raciocínio
//   'command-r-plus:104b', // Command-R Plus 104B — importante para tasks avançadas, automação
//   'command-a:111b', // Command-A 111B — modelo avançado, tarefas complexas, automação
  'deepseek-llm:7b', // DeepSeek LLM 7B — modelo geral, sumarização, tasks amplas
  'qwen2.5-coder:7b', // Qwen2.5 Coder 7B — modelo de código, instrução, tasks técnicas
  'llama3.1:8b', // Llama 3.1 8B — variante, tasks gerais,
  'dolphin-mixtral:8x7b',
  'vicuna:13b',
] as const;

export type OllamaModel = (typeof OLLAMA_MODELS)[number];

// Função utilitária para extrair o tamanho do modelo (em bilhões de parâmetros)
function extractModelSize(modelName: string): number {
  // Procura por padrões como 2b, 7b, 34b, 70b, 104b, 132b, etc
  const match = modelName.match(/(\d+)(x\d+)?b/);
  if (match) {
    // Suporta formatos como 8x7b (Mixtral 8x7b = 56b)
    if (match[2]) {
      const [mult, base] = match[0].split('x').map((v) => parseInt(v));
      return (mult || 1) * (base || 1);
    }
    return parseInt(match[1]);
  }
  // Modelos sem tamanho explícito vão para o final
  return Number.MAX_SAFE_INTEGER;
}

// Função utilitária para ordenar os modelos do menor para o maior
function sortModelsBySize(models: string[]): string[] {
  return [...models].sort((a, b) => {
    const sizeA = extractModelSize(a);
    const sizeB = extractModelSize(b);
    if (sizeA === sizeB) return a.localeCompare(b);
    return sizeA - sizeB;
  });
}

export { sortModelsBySize };

// Observações:
// - Modelos agrupados por categoria e ordenados por capacidade dentro da família.
// - Comentários detalhados para facilitar escolha e manutenção.
// - Atualize sempre que novos modelos relevantes surgirem.
