import { Express } from 'express';
import expressListEndpoints from 'express-list-endpoints';
import fs from 'fs';
import path from 'path';
import { writeJsonFile } from './json';
import { isDevelopment } from './enviroments';
import { DEFAULT_SERVER_PORT } from '../constants';

export function getBaseUrl(app: Express): string {
  const host = process.env['HOST'] || 'localhost';
  const port = app.get('port') || DEFAULT_SERVER_PORT;
  const protocol = isDevelopment() ? 'http' : 'https';

  return `${protocol}://${host}:${port}`;
}

export async function exportEndpoints(outputPath: string, app: Express) {
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  const baseUrl = getBaseUrl(app);

  const endpoints = expressListEndpoints(app);

  const sortedEndpoints = endpoints
    .flatMap((endpoint) => {
      const methods = endpoint.methods.map((method) => ({
        path: `${baseUrl}${endpoint.path}`,
        method,
      }));

      return methods;
    })
    .flat()
    .sort((a, b) => {
      const METHODS_ORDER = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      // sort by path and then by methods
      return (
        a.path.localeCompare(b.path) ||
        METHODS_ORDER.indexOf(a.method) - METHODS_ORDER.indexOf(b.method)
      );
    });

  await writeJsonFile(outputPath, sortedEndpoints);
}
