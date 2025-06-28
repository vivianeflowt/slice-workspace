// # Sever - Principal
// http://localhost:4000/api/chat/completions
// {
//   "provider": "ollama",
//   "model": "wizardlm2:7b",
//   "prompt": "Resuma o texto a seguir...",
//   "systemPrompt": "Você é um assistente IA...", // SYSTEM PROMPT
//   "temperature": 0.7,
//   "maxTokens": 1024,                            // OPCIONAL (tem como calcular automatico)
// }

// # Agent - Genérico para Teste de Configuração de Endpoints
// Este agente lê a configuração de endpoints (YAML ou memória), monta o payload padrão e faz uma requisição ao endpoint do modelo.

import axios from 'axios';
import { ModelProviderManager } from './lib/config/ModelProviderManager';
import fs from 'fs';
import yaml from 'js-yaml';

// Carrega configuração dos endpoints (exemplo usando YAML)
const configPath = './data/model_endpoints.yaml';
const endpointsConfig = yaml.load(fs.readFileSync(configPath, 'utf8')) as any;
const manager = new ModelProviderManager(endpointsConfig.models);

// Parâmetros de teste
const modelName = 'llama3';
const endpoint = manager.getEndpoint(modelName);

if (!endpoint) {
  console.error(`[ERRO] Endpoint não encontrado para o modelo: ${modelName}`);
  process.exit(1);
}

const payload = {
  provider: 'ollama',
  model: modelName,
  prompt: 'Resuma o texto a seguir...',
  systemPrompt: 'Você é um assistente IA...', // SYSTEM PROMPT
  temperature: 0.7,
  maxTokens: 1024, // OPCIONAL
};

(async () => {
  try {
    const response = await axios.post(endpoint, payload);
    console.log('[OK] Resposta do modelo:', response.data);
  } catch (err) {
    console.error('[ERRO] Falha ao requisitar o modelo:', err);
  }
})();
