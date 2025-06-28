import { yellow } from 'colorette';
import { Server } from 'http';
import app from './app';
import { OllamaManager } from './providers/ai/ollama/OllamaManager';
import { icons } from './utils/icons';
import { isDevelopment } from './utils/enviroments';
import { exportEndpoints } from './utils/endpoints';
import path from 'path';

const server = new Server(app);

const SERVER_PORT = app.get('port') || 4000;

const startHttpServer = async () => {
  server.listen(SERVER_PORT, () => {
    if (isDevelopment()) {
      console.clear();
    }
    console.log(`\n${icons.server}  Server running on port ${yellow(app.get('port'))}\n`);

    // OllamaManager.getInstance()
    //   .syncModels()
    //   .catch((err) => {
    //     // Apenas logar erro se houver falha geral no sync
    //     console.error('[Ollama][ERROR] Erro no sync de modelos:', err);
    //   });
    //  exportEndpoints(path.join(__dirname, '../../alive/endpoints.json'), app);
  });
};

startHttpServer();

function shutdownServer(signal: string, error?: Error) {
  console.debug(`${signal} recebido: encerrando servidor HTTP`);
  if (error) console.error(error);
  server.close(() => {
    console.debug('Servidor HTTP encerrado');
    process.exit(error ? 1 : 0);
  });
}

['SIGTERM', 'SIGINT'].forEach((signal) => process.on(signal, () => shutdownServer(signal)));

process.on('uncaughtException', (err) => shutdownServer('uncaughtException', err));
process.on('unhandledRejection', (err) => shutdownServer('unhandledRejection', err as Error));
