// Porta padrão do servidor backend (não usar números mágicos no código)

import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Server
export const DEFAULT_SERVER_PORT = 4000;
export const GLOBAL_API_PREFIX = '/v1';
export const DEFAULT_CONNECTION_TIMEOUT = 60000 * 10; // 10 minutos
export const MAX_REQUEST_SIZE = 1000 * 1024 * 1024; // 1GB
export const DUCKDB_DATA_PATH = path.join(__dirname, '../data');

// Models
export const MODEL_DICTIONARY_PATH = path.join(__dirname, '../data/models');

export const DEFAULT_MODEL_TEMPERATURE = 0.7;
export const DEFAULT_MODEL_MIN_TOKENS = 512;
export const DEFAULT_MODEL_MAX_TOKENS = 100000;

// Ollama: use variável de ambiente para flexibilidade em Docker/local
// export const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

// workstation
export const OLLAMA_BASE_URL = 'http://localhost:11434';

// localcloud
// export const OLLAMA_BASE_URL = 'http://192.168.100.10:11434';

export const SPEECH_API_BASE_URL =
  process.env.SPEECH_API_BASE_URL || 'http://localhost:11480/speech';

export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
export const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const HEADER_DISABLE_CACHE = 'x-disable-cache';
export const ENV_DISABLE_CACHE = 'NO_CACHE';
