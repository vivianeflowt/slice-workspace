import axios from 'axios';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { AvailableModels } from '../src/lib/models/AvailableModels';

// Garante que o dicionário de modelos seja inicializado antes de qualquer teste
beforeAll(() => {
  AvailableModels.initialize();
});

// Aumentar o timeout padrão do Vitest para testes E2E que dependem de rede
vi.setConfig({ testTimeout: 30000 });

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  validateStatus: () => true, // Aceita qualquer status code para tratarmos na asserção
});

describe('E2E - /api/chat/completions', () => {
  it('Deve retornar um erro de validação semântico para um modelo заведомо inválido', async () => {
    const payload = {
      provider: 'openai',
      model: 'modelo-que-nao-existe-12345',
      messages: [{ role: 'user', content: 'teste' }],
    };

    const response = await api.post('/chat/completions', payload);

    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Modelo não encontrado no dicionário');
  });

  const providers = AvailableModels.getProviders();

  // Para cada provider, vamos testar dinamicamente todos os seus modelos
  for (const provider of providers) {
    const models = AvailableModels.getModelsByProvider(provider);

    // Se não houver modelos para este provider, pula
    if (models.length === 0) continue;

    describe.sequential(`Provider: ${provider}`, () => {
      for (const modelInfo of models) {
        // Ignorar modelos que não são para chat
        if (
          ['whisper-1', 'dall-e-3', 'dall-e-2', 'tts-1', 'tts-1-hd', 'nomic-embed-text'].includes(
            modelInfo.model,
          )
        ) {
          continue;
        }

        it(`deve processar o modelo '${modelInfo.model}' sem erros internos`, async () => {
          const payload = {
            model: modelInfo.model,
            messages: [
              { role: 'user', content: `Teste de fumaça para o modelo ${modelInfo.model}` },
            ],
          };

          const response = await api.post('/chat/completions', payload);

          // O teste passa se:
          // 1. A resposta for 200 OK (tudo certo).
          // 2. A resposta for um erro > 400, MAS NÃO um erro de validação do nosso servidor.
          //    Isso indica que nosso servidor processou corretamente e o erro veio do provedor final
          //    (ex: API key inválida, modelo indisponível no provedor, etc.), o que é o comportamento esperado.

          if (response.status === 400) {
            // Se for 400, garantimos que não é um erro de validação do nosso lado
            expect(response.data.error).not.toContain('Modelo não encontrado no dicionário');
            expect(response.data.error).not.toEqual('Validation Error');
          } else {
            // Se for qualquer outro status, a requisição foi processada com sucesso pelo nosso servidor
            expect(response.status).not.toBe(500); // Nenhum erro interno inesperado
          }
        });
      }
    });
  }
});
