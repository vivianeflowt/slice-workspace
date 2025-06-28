// ======================
// OllamaManager: Responsável por sincronizar, instalar e remover modelos do Ollama conforme a lista principal (OLLAMA_MODELS).
// - Prioriza modelos menores na instalação (ver OLLAMA_MODEL_SIZES)
// - Mantém o ambiente limpo, removendo modelos não desejados
// - Evita poluição de logs: só loga início/fim de download e remoção, e falhas reais
// - Robusta e tolerante a falhas: nunca quebra o servidor, sempre tenta continuar
// ======================

import axios, { AxiosInstance } from 'axios';
import { OLLAMA_MODELS, sortModelsBySize, OllamaModel } from './OllamaModels';
import logger from '../../../lib/logger/logger';
import { OLLAMA_BASE_URL } from '../../../constants/constants';
import { flow, map, filter, includes, difference, uniq, toLower, trim } from 'lodash/fp';
import ms from 'ms';
import { execSync } from 'child_process';

const DELAY_SYNC_MODELS = ms('5s');
const RETRY_DELAY = ms('3s');
const RETRY_TIMEOUT = ms('2m');
const TRICKLE_LIMIT_KBPS = 100; // Limite padrão de banda em KB/s
const USE_TRICKLE = true; // Defina como false para não limitar a banda

function isTrickleInstalled(): boolean {
  try {
    execSync('command -v trickle', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function retryUntilSuccess<T>(fn: () => Promise<T>, label: string): Promise<T | undefined> {
  const start = Date.now();
  let lastError: any = null;
  while (Date.now() - start < RETRY_TIMEOUT) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
    }
  }
  logger.error(
    `[Ollama][ERROR] Timeout ao tentar ${label} após ${RETRY_TIMEOUT / 1000}s. Último erro: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
  return undefined;
}

export class OllamaManager {
  private static instance: OllamaManager;
  private isDownloading = false;
  private httpClient: AxiosInstance;

  private constructor() {
    this.httpClient = axios.create({
      baseURL: OLLAMA_BASE_URL,
      timeout: ms('10s'), // Timeout para requisições individuais à API do Ollama
    });
  }

  /**
   * Converte um nome de modelo para sua forma canônica.
   * Normaliza (lowercase, trim) e adiciona ':latest' se nenhuma tag estiver presente.
   * Exemplos: "mistral" -> "mistral:latest"; "Llama2:7B" -> "llama2:7b"
   */
  private static getCanonicalName(name: string | undefined | null): string {
    const normalized = typeof name === 'string' ? toLower(trim(name)) : '';
    if (normalized && !normalized.includes(':')) {
      return `${normalized}:latest`;
    }
    return normalized;
  }

  /** Remove modelos instalados que não estão na lista desejada */
  async syncRemovals(): Promise<void> {
    try {
      const installedCanonicalNames = await this.safeListModels();
      if (!installedCanonicalNames) return;

      const desiredCanonicalNames = OLLAMA_MODELS.map(OllamaManager.getCanonicalName);
      const toRemoveCanonical = difference(installedCanonicalNames, desiredCanonicalNames);

      for (const canonicalName of toRemoveCanonical) {
        try {
          // Verifica se o modelo ainda existe antes de tentar deletar (pode ter sido removido externamente)
          const currentInstalled = await this.safeListModels();
          if (currentInstalled && currentInstalled.includes(canonicalName)) {
            const deleted = await this.deleteModel(canonicalName); // Passa o nome canônico
            if (deleted) {
              logger.info(`[Ollama] Modelo removido: ${canonicalName}`);
            }
          }
        } catch (err) {
          logger.warn(
            `[Ollama] Falha ao remover ${canonicalName}: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    } catch (err) {
      logger.error(
        `[Ollama][ERROR] Falha geral na remoção de modelos: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** Instala modelos ausentes da lista desejada, priorizando menores */
  async syncInstalls(): Promise<void> {
    try {
      const installedCanonicalNames = await this.safeListModels();
      if (!installedCanonicalNames) return;

      // Ordena os modelos do menor para o maior antes de instalar
      const modelsToConsiderInstall = sortModelsBySize(
        OLLAMA_MODELS.filter(
          (origName) => !installedCanonicalNames.includes(OllamaManager.getCanonicalName(origName)),
        ),
      );

      for (const nameFromOllamaModels of modelsToConsiderInstall) {
        if (this.isDownloading) {
          logger.warn(
            `[Ollama] Download em andamento, pulando instalação de ${nameFromOllamaModels} por agora.`,
          );
          continue;
        }
        try {
          const downloadStarted = await this.pullModel(nameFromOllamaModels);
          if (downloadStarted) {
            logger.info(`[Ollama] Modelo pronto/verificado: ${nameFromOllamaModels}`);
          }
        } catch (err) {
          logger.warn(
            `[Ollama] Falha ao instalar/puxar ${nameFromOllamaModels}: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    } catch (err) {
      logger.error(
        `[Ollama][ERROR] Falha geral na instalação de modelos: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** Sincroniza modelos: sempre remove antes de instalar, nunca quebra o servidor */
  async syncModels(): Promise<void> {
    setTimeout(async () => {
      logger.info('[Ollama] Iniciando sincronização de modelos...');
      try {
        const ok = await retryUntilSuccess(() => this.safeListModels(), 'listar modelos para sync');
        if (ok === undefined) {
          // safeListModels retorna undefined em caso de erro irrecuperável
          logger.error(
            '[Ollama][ERROR] Não foi possível listar modelos após retentativas, abortando sincronização.',
          );
          return;
        }
        await this.syncRemovals();
        await this.syncInstalls();
        logger.info('[Ollama] Sincronização de modelos concluída.');
      } catch (err) {
        logger.error(
          `[Ollama][ERROR] Falha crítica na sincronização de modelos: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }, DELAY_SYNC_MODELS);
  }

  /** Lista modelos instalados (nomes canônicos), nunca lança erro diretamente */
  async safeListModels(): Promise<string[] | undefined> {
    try {
      return await this.listModels();
    } catch (err) {
      // O retryUntilSuccess lida com o log de erro final se listModels falhar persistentemente.
      // Não logamos aqui para evitar duplicidade se retryUntilSuccess estiver ativo.
      // Se for chamado diretamente, e falhar, o erro será propagado.
      return undefined; // Indica falha após tentativas (se dentro de retryUntilSuccess) ou falha imediata
    }
  }

  /** Lista os modelos atualmente instalados no Ollama via CLI. */
  async listModels(): Promise<string[]> {
    try {
      const output = execSync('ollama list', { encoding: 'utf-8' });
      // Cada linha: nome:tag	id	tamanho	ex: "mistral:latest\tsha256:...\t4.1GB"
      return output
        .split('\n')
        .map((line) => line.split('\t')[0])
        .filter(Boolean)
        .map(OllamaManager.getCanonicalName);
    } catch (err) {
      logger.error(
        '[Ollama][CLI] Erro ao listar modelos via CLI:',
        err instanceof Error ? err.message : String(err),
      );
      return [];
    }
  }

  /** Deleta um modelo do Ollama usando CLI. */
  async deleteModel(canonicalName: string): Promise<boolean> {
    if (!canonicalName) {
      logger.warn('[Ollama][CLI] Tentativa de deletar modelo com nome canônico inválido.');
      return false;
    }
    try {
      execSync(`ollama rm ${canonicalName}`, { stdio: 'ignore' });
      return true;
    } catch (err) {
      logger.warn(
        `[Ollama][CLI] Erro ao deletar ${canonicalName}: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }

  /** Baixa um modelo usando CLI se ainda não estiver instalado, com controle de banda via trickle. */
  async pullModel(nameFromOllamaModels: string): Promise<boolean> {
    if (this.isDownloading) return false;
    const canonicalNameToCheck = OllamaManager.getCanonicalName(nameFromOllamaModels);
    const installedCanonicalNames = await this.safeListModels();
    if (installedCanonicalNames && installedCanonicalNames.includes(canonicalNameToCheck))
      return false;
    if (USE_TRICKLE && !isTrickleInstalled()) {
      logger.error(
        '[Ollama][CLI] O utilitário trickle não está instalado. Instale com: sudo apt install trickle',
      );
      throw new Error('trickle não instalado');
    }
    this.isDownloading = true;
    try {
      logger.info(`[Ollama][CLI] Iniciando download do modelo: ${nameFromOllamaModels}`);
      const tricklePrefix = USE_TRICKLE ? `trickle -d ${TRICKLE_LIMIT_KBPS}` : '';
      execSync(`${tricklePrefix} ollama pull ${nameFromOllamaModels}`.trim(), {
        stdio: 'inherit',
        shell: '/bin/zsh',
      });
      return true;
    } catch (err) {
      throw new Error(
        `Falha ao puxar modelo ${nameFromOllamaModels} via CLI: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      this.isDownloading = false;
    }
  }

  // normalize foi removido pois sua lógica foi incorporada em getCanonicalName
  // isValidModel foi removido pois sua lógica foi incorporada nos fluxos de sync

  public static getInstance(): OllamaManager {
    if (!OllamaManager.instance) {
      OllamaManager.instance = new OllamaManager();
    }
    return OllamaManager.instance;
  }
}

// Type guard para resposta da API (mantido caso seja útil externamente, mas OllamaManager não depende mais dele diretamente)
export const isOllamaModelList = (models: any): models is { name: string }[] =>
  Array.isArray(models) && models.every((m) => typeof m.name === 'string');
