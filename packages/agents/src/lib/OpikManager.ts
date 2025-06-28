import { Opik } from 'opik';

interface IExperimentConfig {
  model: string;
  temperature: number;
}

interface IExperimentResult {
  id: string;
  success: boolean;
  error?: Error;
}

export class OpikManager {
  private client: Opik;

  constructor(apiUrl: string = 'http://localhost:8000/api') {
    this.client = new Opik({
      apiKey: '', // Local não precisa
      apiUrl,
      projectName: 'Default Project',
      workspaceName: 'Personal',
    });
  }

  async registrarExperimento(
    nomeExperimento: string,
    nomeDataset: string,
    config: IExperimentConfig
  ): Promise<IExperimentResult> {
    try {
      const experimentResult = await this.client.createExperiment({
        name: nomeExperimento,
        datasetName: nomeDataset,
        experimentConfig: config as unknown as Record<string, unknown>,
      });

      // Validação de tipo em tempo de execução
      if (!experimentResult || typeof experimentResult !== 'object' || !('id' in experimentResult)) {
        throw new Error('Resposta inválida ao criar experimento');
      }

      // Registro de métricas e artefatos removido pois não existe na OpikClient

      console.log('Experimento registrado com sucesso!');

      return {
        id: experimentResult.id,
        success: true
      };
    } catch (error) {
      console.error('Erro ao registrar experimento:', error);
      return {
        id: '',
        success: false,
        error: error instanceof Error ? error : new Error('Erro desconhecido')
      };
    }
  }
}

// Exemplo de uso
const gerenciadorOpik = new OpikManager();
gerenciadorOpik
  .registrarExperimento(
    'Teste Slice/ALIVE',
    'slice_alive',
    {
      model: 'ollama/llama3',
      temperature: 0.7
    }
  )
  .catch(console.error);
