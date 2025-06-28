#!/usr/bin/env ts-node
/**
 * Incremental Relevance Pipeline - Optimized Core Engine (TypeScript)
 * Melhorias: tipagem explícita, paralelismo controlado, funções puras, validação com zod, evita reprocessamento desnecessário.
 */

// --- IMPORTS E FUNÇÕES PURAS ---
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import f from 'lodash/fp';
import fg from 'fast-glob';
import Bluebird from 'bluebird';
import { z } from 'zod';

// --- TIPOS E SCHEMAS ---
const ConfigSchema = z.object({
  chunksDir: z.string(),
  originalFile: z.string(),
  brainstormResultsFile: z.string(),
  chunkSize: z.number().int().positive(),
  relevanceMarker: z.string(),
  maxShifts: z.number().int(),
  shiftStep: z.number().int(),
  minShift: z.number().int(),
  maxShift: z.number().int(),
  resultsDir: z.string(),
  finalReportFile: z.string(),
  hashFile: z.string(),
  convergenceTolerance: z.number(),
  convergenceWindow: z.number().int(),
  initialStride: z.number().int(),
  fineStride: z.number().int(),
  refineThreshold: z.number(),
});

type IConfig = z.infer<typeof ConfigSchema>;

// Novo tipo para múltiplos trechos por chunk
interface IChunkRelevance {
  score: number;
  text: string;
}
// Agora cada chunk pode ter múltiplos trechos relevantes
// type IChunkMark = Record<string, number>;
type IChunkMark = Record<string, IChunkRelevance[]>;

interface ISaveChunksOptions {
  getFileName: (chunk: string[], idx: number, total: number) => string;
  serializeChunk: (chunk: string[]) => string;
  concurrency?: number;
}

// --- CONSTANTES ---
const TMP_DIR = path.resolve('tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

/** Constante global para o arquivo de texto bruto */
const RAW_TEXT_FILE = 'CHATS_TEXTO_PURO_RECUPERADOS.md';
/** Constante global para o tamanho dos chunks */
const CHUNK_SIZE = 10;

/** Função pura: split e chunking funcional */
const splitAndChunkMarkdown = (content: string, chunkSize: number): string[][] => {
  const blocks = f.flow(
    (c: string) => c.split(/\n\n+/),
    f.map((b: string) => b.trim()),
    f.filter(Boolean)
  )(content) as string[];
  return f.chunk(chunkSize, blocks);
};

/** Função pura: obtém lista de arquivos de chunk usando fast-glob */
const getChunkFiles = async (chunksDir: string): Promise<string[]> => {
  const files = await fg('*.md', { cwd: chunksDir, onlyFiles: true, absolute: false });
  return files.sort();
};

/** Função pura: valida se chunk está vazio */
const isChunkEmpty = (chunkContent: string): boolean => !chunkContent.trim();

/** Função pura: valida se chunk é válido */
const isChunkValid = (chunkContent: string): boolean => {
  const lines = chunkContent.split(/\n+/).map(l => l.trim()).filter(Boolean);
  return lines.length >= 3 && !isChunkEmpty(chunkContent);
};

/** OUTPUT FILE CONSTANTS (English, configurable) */
const PIPELINE_OUTPUTS_DIR = path.join(TMP_DIR, 'pipeline_outputs');
const CHUNKS_DIR = path.join(TMP_DIR, 'chunks');
const BRAINSTORM_RESULTS_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'BRAINSTORM-RESULTS.md');
const SHIFT_CACHE_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'shift_cache.json');
const FINAL_REPORT_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'relevance_cyclic_report.json');
const HASH_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'original_file_hash.txt');
const BRAINSTORM_MARKS_JSON = path.join(PIPELINE_OUTPUTS_DIR, 'brainstorm_marks.json');
const PIPELINE_LOG_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'pipeline_log.txt');
const HEATMAP_CSV_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'relevance_heatmap.csv');
const ADHERENCE_REPORT_FILE = path.join(PIPELINE_OUTPUTS_DIR, 'brainstorm_adherence_report.json');

const CONFIG: IConfig = ConfigSchema.parse({
  chunksDir: CHUNKS_DIR,
  originalFile: RAW_TEXT_FILE,
  brainstormResultsFile: BRAINSTORM_RESULTS_FILE,
  chunkSize: CHUNK_SIZE,
  relevanceMarker: 'CONTAINS:',
  maxShifts: 10,
  shiftStep: 2,
  minShift: -10,
  maxShift: 10,
  resultsDir: path.join(PIPELINE_OUTPUTS_DIR, 'cyclic_analysis'),
  finalReportFile: FINAL_REPORT_FILE,
  hashFile: HASH_FILE,
  convergenceTolerance: 0.005,
  convergenceWindow: 3,
  initialStride: 5,
  fineStride: 1,
  refineThreshold: 0.1,
});

// Função para salvar brainstorm_marks em JSON
const saveBrainstormMarksJson = async (marks: IChunkMark) => {
  await fs.writeFile(BRAINSTORM_MARKS_JSON, JSON.stringify(marks, null, 2), 'utf-8');
};

// Função para gerar CSV de "mapa de calor" de relevância
const saveHeatmapCsv = async (marks: IChunkMark, chunksDir: string) => {
  const chunkFiles = await getChunkFiles(chunksDir);
  const rows = [['chunk_file', 'start_line', 'end_line', 'relevancia']];
  let lineCounter = 1;
  for (const chunkFile of chunkFiles) {
    const chunkPath = path.join(chunksDir, chunkFile);
    const content = await fs.readFile(chunkPath, 'utf-8');
    const numLines = content.split('\n').length;
    const startLine = lineCounter;
    const endLine = lineCounter + numLines - 1;
    const relevancia = marks[chunkFile] ?? [];
    relevancia.forEach((r, idx) => {
      rows.push([chunkFile, String(startLine + idx), String(endLine), String(r.score)]);
    });
    lineCounter = endLine + 1;
  }
  const csv = rows.map(r => r.join(',')).join('\n');
  await fs.writeFile(HEATMAP_CSV_FILE, csv, 'utf-8');
};

// Função para log incremental
const appendPipelineLog = async (msg: string) => {
  const timestamp = new Date().toISOString();
  await fs.appendFile(PIPELINE_LOG_FILE, `[${timestamp}] ${msg}\n`, 'utf-8');
};

// Função de IO: detecta mudança no arquivo original para invalidar cache
/**
 * Verifica se o arquivo original mudou desde o último processamento batch.
 * Atualiza o hash salvo para o próximo ciclo.
 * Retorna true se o lote precisa ser reprocessado.
 */
const checkAndUpdateBatchFileHash = async (): Promise<boolean> => {
  const filePath = CONFIG.originalFile;
  const hashFile = CONFIG.hashFile;
  if (!(await fs.pathExists(filePath))) return false;
  const data = await fs.readFile(filePath);
  const currentHash = crypto.createHash('md5').update(data).digest('hex');
  let previousHash = '';
  if (await fs.pathExists(hashFile)) {
    previousHash = (await fs.readFile(hashFile, 'utf-8')).trim();
    if (currentHash === previousHash) return false;
  }
  await fs.writeFile(hashFile, currentHash, 'utf-8');
  return true;
};

// --- CACHE DE DESLOCAMENTO CENTRALIZADO ---
type IShiftCache = Record<string, any>; // { [deslocamento]: resultado }

/** Lê o cache centralizado de deslocamentos */
const readShiftCache = async (): Promise<IShiftCache> => {
  if (!(await fs.pathExists(SHIFT_CACHE_FILE))) return {};
  try {
    const raw = await fs.readFile(SHIFT_CACHE_FILE, 'utf-8');
    return JSON.parse(raw) as IShiftCache;
  } catch {
    return {};
  }
};

/** Escreve o cache centralizado de deslocamentos */
const writeShiftCache = async (cache: IShiftCache): Promise<void> => {
  await fs.writeFile(SHIFT_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
};

/** Salva resultado de deslocamento no cache centralizado */
const saveShiftResult = async (shift: number, result: any): Promise<void> => {
  const cache = await readShiftCache();
  cache[String(shift)] = result;
  await writeShiftCache(cache);
};

/** Lê resultado de deslocamento do cache centralizado */
const getShiftResult = async (shift: number): Promise<any | undefined> => {
  const cache = await readShiftCache();
  return cache[String(shift)];
};

// --- FUNÇÕES DE IO E CLASSES (mantém apenas orquestração) ---
const ensureDir = async (dir: string) => {
  if (!(await fs.pathExists(dir))) await fs.mkdirp(dir);
};

const saveChunksToFiles = async (
  chunks: string[][],
  chunksDir: string,
  options: ISaveChunksOptions
) => {
  const total = chunks.length;
  await Bluebird.map(
    chunks,
    async (chunk: string[], idx: number) => {
      const name = options.getFileName(chunk, idx, total);
      const filePath = path.join(chunksDir, name);
      const newContent = options.serializeChunk(chunk);
      if (await fs.pathExists(filePath)) {
        const oldContent = await fs.readFile(filePath, 'utf-8');
        if (oldContent === newContent) return;
      }
      await fs.writeFile(filePath, newContent, 'utf-8');
    },
    { concurrency: options.concurrency ?? 3 }
  );
};

// Generalized and robust parser for brainstorm marks
const parseBrainstormMarks = (text: string, chunkFilesList?: string[], options?: {
  chunkPattern?: RegExp,
  containsPattern?: RegExp,
  notContainsPattern?: RegExp,
  scorePattern?: RegExp,
  acceptedMarks?: string[],
}) => {
  const marks: IChunkMark = {};
  const logs: string[] = [];
  const adherence: any = {
    processedChunks: [],
    unmarkedChunks: [],
    ignoredSections: [],
    stats: {},
    warnings: [],
  };
  const chunkFilesSet = chunkFilesList ? new Set(chunkFilesList) : undefined;
  const chunkPattern = options?.chunkPattern || /^CHUNK_\d+\.(md|txt)$/i;
  const containsPattern = options?.containsPattern || /^CONTEM|CONTAINS/i;
  const notContainsPattern = options?.notContainsPattern || /^NAO CONTEM|NOT CONTAINS/i;
  const scorePattern = options?.scorePattern || /confian[çc]a[:=]?\s*([0-9.,]+)/i;
  const acceptedMarks = options?.acceptedMarks || ['CONTEM', 'CONTAINS', 'NAO CONTEM', 'NOT CONTAINS', 'RELEVANTE', 'IRRELEVANTE'];

  const sections = text.split('---');
  sections.forEach((section: string, idx: number) => {
    const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return; // ignore empty
    if (lines.length < 2) {
      const msg = `[brainstorm-parse] WARNING: Section ${idx + 1} has less than 2 lines: ${JSON.stringify(lines)}`;
      logs.push(msg);
      adherence.ignoredSections.push({ section: idx + 1, lines });
      return;
    }
    const chunkFile = lines[0];
    const markLine = lines[1] || '';
    if (!chunkPattern.test(chunkFile)) {
      const msg = `[brainstorm-parse] WARNING: Section ${idx + 1} line 1 is not a valid chunk name: '${chunkFile}'`;
      logs.push(msg);
      adherence.ignoredSections.push({ section: idx + 1, lines });
      return;
    }
    if (chunkFilesSet && !chunkFilesSet.has(chunkFile)) {
      const msg = `[brainstorm-parse] WARNING: Chunk '${chunkFile}' does not exist in chunk files.`;
      logs.push(msg);
      adherence.warnings.push(msg);
    }
    // Novo: extrair múltiplos trechos CONTEM
    let relevanceList: IChunkRelevance[] = [];
    if (containsPattern.test(markLine)) {
      // Pode haver múltiplos trechos entre aspas
      const matches = Array.from(section.matchAll(/"([^"]+)"/g));
      const scoreMatch = markLine.match(scorePattern);
      let score = 1.0;
      if (scoreMatch) {
        score = parseFloat(scoreMatch[1].replace(',', '.')) || 1.0;
      }
      if (matches.length > 0) {
        relevanceList = matches.map(m => ({ score, text: m[1] }));
      } else {
        // Se não houver trechos, registra CONTEM genérico
        relevanceList = [{ score, text: '' }];
      }
    } else if (notContainsPattern.test(markLine)) {
      // NAO CONTEM: score 0, sem trecho
      relevanceList = [{ score: 0.0, text: '' }];
    } else if (acceptedMarks.some(m => markLine.toUpperCase().includes(m))) {
      // Alternativas
      const isRelevant = /RELEVANTE|RELEVANT/i.test(markLine);
      const scoreMatch = markLine.match(scorePattern);
      let score = 1.0;
      if (scoreMatch) {
        score = parseFloat(scoreMatch[1].replace(',', '.')) || 1.0;
      }
      relevanceList = [{ score: isRelevant ? score : 0.0, text: '' }];
    } else {
      const msg = `[brainstorm-parse] WARNING: Section ${idx + 1} line 2 is not a valid mark: '${markLine}'`;
      logs.push(msg);
      adherence.ignoredSections.push({ section: idx + 1, lines });
      return;
    }
    marks[chunkFile] = relevanceList;
    adherence.processedChunks.push({ chunk: chunkFile, relevance: relevanceList });
  });
  // Log unmarked chunks
  if (chunkFilesSet) {
    for (const chunkFile of chunkFilesSet) {
      if (!(chunkFile in marks)) {
        const msg = `[brainstorm-parse] WARNING: Chunk '${chunkFile}' was not marked in brainstorm.`;
        logs.push(msg);
        adherence.unmarkedChunks.push(chunkFile);
      }
    }
  }
  // Stats
  const allScores = Object.values(marks).flat().map(r => r.score);
  adherence.stats = {
    totalChunks: chunkFilesSet ? chunkFilesSet.size : undefined,
    markedChunks: Object.keys(marks).length,
    unmarkedChunks: adherence.unmarkedChunks.length,
    meanScore: allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0,
    stdScore: allScores.length ? Math.sqrt(allScores.reduce((a, b) => a + Math.pow(b - (allScores.reduce((a, b) => a + b, 0) / allScores.length), 2), 0) / allScores.length) : 0,
  };
  adherence.warnings = logs;
  return { marks, adherence };
};

// Classe: Responsável por dividir o markdown em chunks (apenas orquestra)
class ChunkSplitter {
  constructor(private config: IConfig) {}

  async split(): Promise<void> {
    await ensureDir(this.config.chunksDir);
    let sourceFile = this.config.originalFile;
    // Se o arquivo processado não existir, usa o arquivo bruto
    if (!(await fs.pathExists(this.config.originalFile))) {
      const fallback = RAW_TEXT_FILE;
      if (await fs.pathExists(fallback)) {
        sourceFile = fallback;
        console.log(`[INFO] Arquivo processado não encontrado. Usando arquivo bruto '${fallback}' para split inicial.`);
      } else {
        throw new Error(`Nenhum arquivo de entrada encontrado: '${this.config.originalFile}' ou '${fallback}'`);
      }
    }
    const content = await fs.readFile(sourceFile, 'utf-8');
    const chunkArrays = splitAndChunkMarkdown(content, this.config.chunkSize);
    await saveChunksToFiles(
      chunkArrays,
      this.config.chunksDir,
      {
        getFileName: (_chunk, idx, total) => {
          const padding = Math.max(3, String(total).length);
          return `CHUNK_${String(idx + 1).padStart(padding, '0')}.md`;
        },
        serializeChunk: (chunk) => chunk.join('\n\n') + '\n',
        concurrency: 8,
      }
    );
  }
}

// Classe: Responsável por validar dados de entrada (apenas orquestra)
class DataValidator {
  constructor(private config: IConfig) {}

  async validate(): Promise<string | null> {
    // Checagem de existência de arquivos/diretórios (I/O)
    if (!(await fs.pathExists(this.config.originalFile)))
      return `Arquivo original ausente: ${this.config.originalFile}`;
    if (!(await fs.pathExists(this.config.chunksDir)))
      return `Diretório chunks ausente: ${this.config.chunksDir}`;
    // Checagem de conteúdo dos chunks (funções puras)
    const chunkFiles = await getChunkFiles(this.config.chunksDir);
    if (chunkFiles.length < 2) return `Dados insuficientes: apenas ${chunkFiles.length} chunks`;
    const sampleChunk = await fs.readFile(path.join(this.config.chunksDir, chunkFiles[0]), 'utf-8');
    if (isChunkEmpty(sampleChunk)) return 'Chunks parecem estar vazios';
    if (!isChunkValid(sampleChunk)) return 'Chunk inválido: não atende critérios mínimos de conteúdo';
    return null;
  }
}

// Classe: Responsável por limpar caches e resultados antigos (apenas orquestra)
class CacheCleaner {
  constructor(private config: IConfig) {}

  async clear(): Promise<void> {
    const files = await fs.readdir(TMP_DIR);
    const cacheFiles = files.filter(isCacheFileName);
    await Bluebird.map(
      cacheFiles,
      async (fName: string) => {
        await fs.unlink(path.join(TMP_DIR, fName));
      },
      { concurrency: 8 }
    );
    if (await fs.pathExists(this.config.resultsDir)) {
      await fs.remove(this.config.resultsDir);
    }
  }
}

// Classe: Responsável por extrair marcações do brainstorm (apenas orquestra)
class BrainstormParser {
  constructor(private config: IConfig) {}

  async extractMarks(): Promise<{ marks: IChunkMark, adherence: any }> {
    if (!(await fs.pathExists(this.config.brainstormResultsFile))) {
      console.warn('[WARN] BRAINSTORM-RESULTS.md not found.');
      return { marks: {}, adherence: {} };
    }
    const content = await fs.readFile(this.config.brainstormResultsFile, 'utf-8');
    const chunkFiles = await getChunkFiles(this.config.chunksDir);
    return parseBrainstormMarks(content, chunkFiles);
  }
}

// Função utilitária para identificar se o nome do arquivo é de cache (mantida para evitar erro)
const isCacheFileName = (fileName: string): boolean => /^cache_deslocamento_.*\.json$/.test(fileName);

// Garante criação do diretório centralizado de outputs
function ensurePipelineOutputsDir() {
  return fs.pathExists(PIPELINE_OUTPUTS_DIR).then(exists => {
    if (!exists) return fs.mkdirp(PIPELINE_OUTPUTS_DIR);
  });
}

// === Main ===
const main = async () => {
  await ensurePipelineOutputsDir();
  const splitter = new ChunkSplitter(CONFIG);
  const validator = new DataValidator(CONFIG);
  const cleaner = new CacheCleaner(CONFIG);
  const parser = new BrainstormParser(CONFIG);

  const needsClean = await checkAndUpdateBatchFileHash();
  if (needsClean) {
    console.log('[pipeline] Change detected in original file. Cleaning caches and temp directories...');
    await appendPipelineLog('Change detected in original file. Cleaning caches and temp directories...');
    await cleaner.clear();
  }

  await splitter.split();
  await appendPipelineLog('Chunks split and saved.');
  const error = await validator.validate();
  if (error) {
    await appendPipelineLog(`ERROR: ${error}`);
    console.error('[pipeline] ERROR:', error);
    process.exit(1);
  }
  const { marks, adherence } = await parser.extractMarks();
  await appendPipelineLog('Marks extracted from brainstorm.');
  await saveBrainstormMarksJson(marks);
  await appendPipelineLog('Marks saved in brainstorm_marks.json.');
  await saveHeatmapCsv(marks, CONFIG.chunksDir);
  await appendPipelineLog('Heatmap saved in relevance_heatmap.csv.');
  await fs.writeFile(ADHERENCE_REPORT_FILE, JSON.stringify(adherence, null, 2), 'utf-8');
  await appendPipelineLog('Adherence report saved in brainstorm_adherence_report.json.');
  console.log('[pipeline] Marks extracted:', marks);
};

main().catch((err) => {
  console.error('Erro inesperado no pipeline:', err);
  process.exit(1);
});
