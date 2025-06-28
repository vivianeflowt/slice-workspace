import axios, { AxiosInstance } from 'axios';
import Bluebird from 'bluebird';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import path from 'path';
import { getMaxResponseTokens } from './utils/tokens';
import { estimateTokenCount } from './utils/tokens';
import { sanitizeCodeString } from './utils/sanitizers';
import fg from 'fast-glob';

// === CONSTANTS ===
export const SYSTEM_PROMPT_TECNICO = `
## Diretriz Inicial

Você é uma IA especialista em análise semântica, curadoria e extração de relevância em textos complexos.
Sua missão é identificar, com precisão e discernimento, informações de alto valor em grandes volumes de dados, atuando como um agente de busca, filtro e classificação de conteúdos relevantes para o contexto de negócio.
Utilize sua capacidade de compreensão contextual, julgamento crítico e atenção a detalhes para entregar respostas claras, objetivas e confiáveis, sempre seguindo as melhores práticas de curadoria textual e análise semântica.

## Diretrizes de Comportamento

1. Você é um agente de curadoria responsável por analisar textos conforme instruções específicas.
2. Responda sempre de forma objetiva, sem explicações extras.
3. Utilize o formato de resposta especificado abaixo.
4. Use marcação markdown para estruturar sua resposta, conforme exemplos.
5. Sempre inclua o grau de confiança na resposta, no formato: (confiança: X.XX)

## Sobre o grau de confiança

- O valor de confiança deve refletir o quanto a evidência no texto é clara, direta e inequívoca.
- Use a escala de 0.0 (nenhuma certeza) a 1.0 (certeza absoluta).
- Em casos ambíguos, parciais ou de baixa evidência, use valores intermediários ou baixos (ex: 0.3, 0.5, 0.6).
- Só use valores altos (ex: 0.9+) quando a informação for explícita, direta e sem margem para dúvida.
- Em caso de dúvida, seja conservador e reduza a confiança.
- Mesmo que a resposta seja CONTEM, se a evidência for fraca, a confiança deve ser baixa.

## Formato de Resposta

- Se o texto CONTÉM o contexto solicitado, responda:
  CONTEM (confiança: X.XX):
  "Trecho 1"
  "Trecho 2"
- Se o texto NÃO CONTÉM, responda:
  NAO CONTEM (confiança: X.XX)

## Exemplos

- CONTEM (confiança: 0.35):
  "Trecho com menção vaga ou indireta ao contexto solicitado."
- CONTEM (confiança: 0.65):
  "Trecho que aborda parcialmente o contexto, mas com alguma incerteza."
- CONTEM (confiança: 0.95):
  "Trecho explícito, direto e inequívoco sobre o contexto solicitado."
- NAO CONTEM (confiança: 0.5)
`;

export const SYSTEM_PROMPT_NEGOCIO = `
## Critérios para Identificação de Informações de Negócio

Considere que o texto CONTÉM informações de negócio apenas se houver menção explícita a:
- Cliente
- Valor monetário
- Lucro
- Receita
- Investimento
- Proposta de valor
- Modelo de negócio
- Monetização
- Vendas
- Contratos
- Impacto financeiro direto
- Funcionamento do ecossistema Slice/ALIVE enquanto negócio

## Exemplos Positivos (CONTEM)

- "Após a integração do Slice/ALIVE, o cliente X conseguiu automatizar fluxos e reportou aumento de receita no trimestre."
- "O contrato firmado com a empresa Y prevê suporte dedicado e pagamento mensal recorrente pelo uso do ecossistema."
- "A proposta de valor do Slice/ALIVE é acelerar a entrega de resultados financeiros para nossos clientes por meio de automação inteligente."
- "A adoção do pipeline de IA local permitiu ao cliente Z economizar R$ 15 mil mensais em custos operacionais."
- "O investimento realizado na infraestrutura de IA foi recuperado em seis meses devido ao aumento de vendas e redução de despesas."
- "Nosso modelo de negócio prevê monetização por assinatura, com planos diferenciados para pequenas e grandes empresas."
- "A automação de experimentos proporcionou ao cliente ganhos de produtividade e impacto financeiro direto no resultado do negócio."
- "A venda do módulo de análise semântica gerou lucro líquido de R$ 8 mil no primeiro mês de operação."
- "O funcionamento do ecossistema Slice/ALIVE permite integração rápida com clientes corporativos, acelerando o ciclo de vendas."
- "A receita do último trimestre cresceu 15% após a implementação do novo fluxo de automação para clientes estratégicos."

## Exemplos Negativos (NAO CONTEM)

- "A instalação dos modelos Ollama foi concluída com sucesso no ambiente local."
- "O sistema utiliza arquitetura de microserviços para garantir escalabilidade e modularidade."
- "Implementamos um novo algoritmo de tokenização baseado em SentencePiece para otimizar o processamento."
- "O diretório lib concentra utilitários centrais para o funcionamento interno do sistema."
- "A documentação foi atualizada para incluir exemplos de uso da API e instruções de deploy."
- "O fluxo experimental do projeto ERD é iterativo, rastreável e otimizado continuamente."
- "A automação de experimentos permite registrar logs estruturados e analisar resultados técnicos."
- "O MCP permite gerenciar, rodar e alternar entre múltiplos modelos de IA localmente."
- "A configuração do ambiente MCP cobre automação, análise e produtividade de desenvolvimento."
- "O conceito do diretório providers é centralizar integrações com serviços externos, como bancos de dados e APIs."

## Exemplos de Falsos Positivos Frequentes (NAO CONTEM)

- "A economia de recursos computacionais foi possível ao rodar modelos localmente." (economia técnica, não valor de negócio)
- "O contrato da função define os tipos de entrada e saída no código." (contrato técnico, não contrato de negócio)
- "A receita do comando é executar o script build.sh antes do deploy." (receita técnica, não financeira)
- "O modelo de dados foi atualizado para suportar múltiplos clientes simultâneos." (cliente como entidade técnica, não cliente de negócio)
- "O investimento de tempo em testes automatizados reduziu bugs em produção." (investimento de esforço, não capital financeiro)
- "Sugestão de instalação do Ollama para já deixar pronto o ambiente de IA." (instalação técnica, não decisão de negócio)
- "LangChain pode ser avaliado e integrado depois caso o projeto evolua para fluxos de IA mais complexos." (planejamento técnico, não decisão de negócio)
- "Você está com um ecossistema extremamente completo e pronto para automação, análise e produtividade de desenvolvimento." (elogio técnico, não resultado de negócio)
- "Função permite gerenciar, rodar, listar, deletar e interagir com modelos Ollama via MCP." (descrição técnica de ferramenta, não informação de negócio)
- "O fluxo do projeto prevê logs detalhados para cada experimento realizado." (organização experimental, não informação de negócio)
`;

export const SYSTEM_PROMPT = SYSTEM_PROMPT_TECNICO + '\n' + SYSTEM_PROMPT_NEGOCIO;

export const BASE_USER_PROMPT = `
O texto CONTEM ou NAO CONTEM informações de negócio/cliente/valor/lucro/ecossistema? Se CONTEM, mostre o(s) trecho(s) exato(s).
`;

export const RESULT_FILE_PATH = path.join(__dirname, '..', 'tmp', 'BRAINSTORM-RESULTS.md'); // Nunca sobrescrever, só append!

export const API_BASE_URL = 'http://localhost:4000/api';
export const IA_CHAT_COMPLETIONS_ENDPOINT = '/chat/completions';
export const DEFAULT_TIMEOUT = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_RETRY = 3;
export const IA_TEMPERATURE = 0.3;
export const ID_MAX_TOKENS_PER_CHUNK = 8000;
export const IA_MIN_TOKEN = 1024;
export const IA_CONTEXT_RATIO = 2.5;

export const providerModelOptions: { provider: string; model: string }[] = [
  { provider: 'ollama', model: 'llama3.1:8b' },
//   { provider: 'ollama', model: 'mistral:7b-instruct' },
//   { provider: 'ollama', model: 'qwen3:8b' },
//   { provider: 'ollama', model: 'deepseek-r1:8b' },
//   { provider: 'ollama', model: 'phi4:14b' },
  // { provider: 'ollama', model: 'neural-chat:7b' },
  // { provider: 'ollama', model: 'dolphin-mistral:7b' },
  // { provider: 'ollama', model: 'llama3:8b' },
];

// Arquivos do stack textgen-webui para brainstorm incremental
export const textgenStackFileList: string[] = [
  //   path.join('.docker', 'workstation', 'Dockerfile'),
  //   path.join('.docker', 'workstation', 'docker-compose.yml'),
  //   path.join('.docker', 'workstation', 'start.sh'),
  //   path.join('.docker', 'workstation', 'settings.yaml'),
  //   path.join('BRAINSTORM-RESULTS-PROCESSED.md'), // descomente se quiser incluir
  // --- SPLIT: partes para processamento incremental manual ---
  //   path.join('data', 'ArquivoSIM.md'),
  //   path.join('data', 'ArquivoNAO.md'),
];

// Diretório dos chunks para processamento incremental
export const CHUNKS_DIR_PATH = path.join(__dirname, '..', 'tmp', 'chunks');

// Custom Axios instance
export function createIAInstance({
  baseURL = API_BASE_URL,
  timeout = DEFAULT_TIMEOUT,
} = {}): AxiosInstance {
  const instance = axios.create({ baseURL, timeout });
  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const requestConfig = error.config as AxiosRequestConfig & { __retryCount?: number };
    if (!requestConfig || (requestConfig.__retryCount ?? 0) >= DEFAULT_RETRY) throw error;
    requestConfig.__retryCount = (requestConfig.__retryCount ?? 0) + 1;
    return instance(requestConfig);
  });
  return instance;
}

export const iaAxios = createIAInstance();

// Log incremental de resultado
export const appendBrainstormResult = ({
  provider,
  model,
  file,
  result,
  temperature = IA_TEMPERATURE,
  files = [],
  maxTokens,
  promptTokens,
  resultLength,
}: {
  provider: string;
  model: string;
  file: string;
  result: string;
  temperature?: number;
  files?: string[];
  maxTokens?: number;
  promptTokens?: number;
  resultLength?: number;
}): void => {
  const fileList = files.length > 0 ? files.join(', ') : file;
  const log = `\n---\nprovider: ${provider}\nmodel: ${model}\ntemperature: ${temperature}\npromptTokens: ${promptTokens ?? ''}\nmaxTokens: ${maxTokens ?? ''}\nresultLength: ${resultLength ?? ''}\nfiles: ${fileList}\n\n${result}\n\n---\n`;
  fs.appendFileSync(RESULT_FILE_PATH, log);
  console.log(log);
};

// Utilitário para dividir conteúdo em partes de até 8k tokens
const splitFileForPromptChunks = (
  name: string,
  content: string,
  maxTokensPerPart = ID_MAX_TOKENS_PER_CHUNK
): { role: 'user'; content: string }[] => {
  const sanitized = sanitizeCodeString(content);
  const parts: { role: 'user'; content: string }[] = [];
  let start = 0;
  const approxChunkSize = Math.ceil(maxTokensPerPart / 0.24);
  while (start < sanitized.length) {
    let end = Math.min(start + approxChunkSize, sanitized.length);
    if (end < sanitized.length) {
      const nextNewline = sanitized.indexOf('\n', end);
      if (nextNewline !== -1 && nextNewline - end < 200) {
        end = nextNewline + 1;
      }
    }
    const chunk = sanitized.slice(start, end);
    const tokens: number = (estimateTokenCount as (input: string) => number)(chunk);
    if (tokens > maxTokensPerPart) {
      end = start + Math.floor(chunk.length * (maxTokensPerPart / tokens));
    }
    const finalChunk = sanitized.slice(start, end);
    parts.push({
      role: 'user',
      content: `File: ${name} (part ${parts.length + 1})\n\n${BASE_USER_PROMPT}\n\n${finalChunk}`,
    });
    start = end;
  }
  return parts;
};

export const brainstormFileList: { name: string; content: string }[] = [];

// Função utilitária para calcular o maxTokens ajustado
function calculateMaxTokens(baseTokens: number): number {
  let maxTokens = Math.ceil(baseTokens * IA_CONTEXT_RATIO);
  maxTokens = Math.max(IA_MIN_TOKEN, maxTokens);
  maxTokens = Math.ceil(maxTokens / 8) * 8;
  return maxTokens;
}

// Cria payload IA
export function createBrainstormPayload({
  files = brainstormFileList,
  systemPrompt = SYSTEM_PROMPT,
  provider,
  model,
  temperature = IA_TEMPERATURE,
}: {
  files?: { name: string; content: string }[];
  systemPrompt?: string;
  provider: string;
  model: string;
  temperature?: number;
}) {
  interface IAMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  interface IAPayload {
    provider: string;
    model: string;
    messages: IAMessage[];
    temperature?: number;
    maxTokens?: number;
    _promptTokens?: number;
  }
  const messages: IAMessage[] = [{ role: 'system', content: systemPrompt }];
  for (const file of files) {
    messages.push(...splitFileForPromptChunks(file.name, file.content, ID_MAX_TOKENS_PER_CHUNK));
  }
  const promptText: string = messages.map((message: IAMessage) => message.content).join('\n');

  let maxTokens: number = getMaxResponseTokens(promptText, '', undefined);
  // Limite máximo do modelo (ex: 128k tokens)

  maxTokens = calculateMaxTokens(maxTokens);

  const payload: IAPayload = {
    provider,
    model,
    messages,
    temperature,
    maxTokens,
  };
  return payload;
}

// Tornar brainstormFilesMulti robusto: sempre continua mesmo com erro em algum modelo
async function brainstormFilesMulti({
  files,
  providersModels,
  systemPrompt,
  temperature,
}: {
  files: { name: string; content: string }[];
  providersModels: { provider: string; model: string }[];
  systemPrompt: string;
  temperature: number;
}): Promise<void> {
  for (const { provider, model } of providersModels) {
    const payload = createBrainstormPayload({
      files,
      systemPrompt,
      provider,
      model,
      temperature,
    });

    const response = await iaAxios.post<{
      choices?: { message?: { content?: string } }[];
      result?: string;
    }>(IA_CHAT_COMPLETIONS_ENDPOINT, payload);
    const data = response.data;
    let brainstormResult: string;
    if (Array.isArray(data?.choices) && data.choices[0]?.message?.content) {
      brainstormResult = data.choices[0].message.content;
    } else if (typeof data?.result === 'string') {
      brainstormResult = data.result;
    } else {
      brainstormResult = JSON.stringify(data);
    }
    // Validação bruta dos campos YAML obrigatórios
    // Log de rastreabilidade: tamanho do campo result recebido do servidor
    if (typeof data?.result === 'string') {
      console.log(`[DEBUG] Tamanho do campo result recebido do servidor:`, data.result.length);
    }
    // Log de rastreabilidade: tamanho do campo registrado no arquivo
    console.log(`[DEBUG] Tamanho do campo registrado no arquivo:`, brainstormResult.length);
    appendBrainstormResult({
      provider,
      model,
      file: files.map((f) => f.name).join(', '),
      result: brainstormResult, // Passa o resultado integral, sem cortes
      temperature,
      files: files.map((f) => f.name),
      maxTokens: payload.maxTokens,
      promptTokens: payload._promptTokens,
      resultLength: brainstormResult.length,
    });
  }
}

// === CONTENT CLEANING STEPS ===

function removeTabsStep(linha: string): string {
  return linha.replace(/\t/g, '');
}

function removeNewLinesStep(linha: string): string {
  return linha.replace(/\n/g, '');
}

function normalizeSpacesStep(linha: string): string {
  return linha.replace(/\s+/g, ' ');
}

function trimStep(linha: string): string {
  return linha.trim();
}

function removeEmojisStep(linha: string): string {
  return linha.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
}

function removeSpecialCharsStep(linha: string): string {
  return linha.replace(/[^\w\s\u00C0-\u017F]/g, '');
}

function isValidLineStep(linha: string): boolean {
  // Permite letras, números, espaços e acentos
  const hasContent = linha.length > 3;
  const hasValidChars = /^[\w\s\u00C0-\u017F]+$/.test(linha);
  return hasContent && hasValidChars;
}

function processContentLines(conteudo: string): string[] {
  return conteudo
    .split('\n')
    .map(removeTabsStep)
    .map(removeNewLinesStep)
    .map(normalizeSpacesStep)
    .map(trimStep)
    .map(removeEmojisStep)
    .map(removeSpecialCharsStep)
    .filter(isValidLineStep);
}

async function loadChunks() {
  const files = await fg(['*.md'], {
    onlyFiles: true,
    cwd: CHUNKS_DIR_PATH,
    absolute: true,
    suppressErrors: true,
  });

  const sortedFiles = files.sort((a, b) => a.localeCompare(b));

  return Bluebird.map(sortedFiles, async (file) => {
    const rawContent = await fs.promises.readFile(file, 'utf8');
    const cleanedLines = processContentLines(rawContent);

    // const businessMarks = [
    //   'investiu R$ 1,2 milhão',
    //   'cliente prefere solucoes plug and play',
    //   'último trimestre, dobrando o lucro bruto',
    //   'Compel investiu R$ 1,2 milhão',
    //   'valor de mercado',
    //   'lucro bruto cresceu 10%',
    //   'com essa margem de receita poremos evoluir nosso hardware a exponencial',
    //   'nosso ecositema garante que entregamos a solucao em 2 semanas',
    // ];

    // const shouldAddBusinessMark = Math.random() < 0.5;
    // if (shouldAddBusinessMark) {
    //   const randomMark = businessMarks[Math.floor(Math.random() * businessMarks.length)];
    //   cleanedLines.push(randomMark);
    // }

    // const fileExtension = shouldAddBusinessMark ? '.sim.md' : '.nao.md';
    const fileExtension = '.md';

    const newFileName = path.join(
      CHUNKS_DIR_PATH,
      path.basename(file).replace('.md', fileExtension)
    );
    const finalContent = cleanedLines.join('\n');

    await fs.promises.writeFile(newFileName, finalContent);

    return newFileName;
  });
}

const run = async () => {
  // Remove o arquivo de output se existir antes de começar
  if (fs.existsSync(RESULT_FILE_PATH)) {
    fs.rmSync(RESULT_FILE_PATH);
  }

  if (!fs.existsSync(CHUNKS_DIR_PATH)) {
    fs.mkdirSync(CHUNKS_DIR_PATH, { recursive: true });
  }

  const chunkFiles = await loadChunks();

  chunkFiles.forEach((file) => {
    if (!textgenStackFileList.includes(file)) {
      textgenStackFileList.push(file);
    }
  });

  console.log(chunkFiles);

  try {
    console.log('🚀 Starting multi-IA brainstorm for textgen-webui stack files...');
    // Deduplica arquivos por nome
    const fileMap = new Map<string, string>();
    for (const filePath of textgenStackFileList) {
      if (!fileMap.has(filePath)) {
        fileMap.set(
          filePath,
          fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[File not found]'
        );
      }
    }
    const files = Array.from(fileMap.entries()).map(([name, content]) => ({ name, content }));

    // Processa cada arquivo individualmente com retry
    await Bluebird.mapSeries(files, async (file, fileIndex) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 2000; // 2 segundos
      let processedSuccessfully = false;

      console.log(`📋 Processando arquivo ${fileIndex + 1}/${files.length}: ${file.name}`);

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`📄 Tentativa ${attempt}/${MAX_RETRIES} para ${file.name}`);

          await brainstormFilesMulti({
            files: [file],
            providersModels: providerModelOptions,
            systemPrompt: SYSTEM_PROMPT,
            temperature: IA_TEMPERATURE,
          });

          console.log(`✅ ${file.name} processado com sucesso`);
          processedSuccessfully = true;
          break; // Sucesso, sai do loop de retry
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);

          if (attempt === MAX_RETRIES) {
            // Registra falha final apenas após esgotar todas as tentativas
            console.error(
              `❌ Falha final para ${file.name} após ${MAX_RETRIES} tentativas: ${errorMsg}`
            );
            console.warn(`⚠️ Continuando com próximo arquivo para manter ordem sequencial`);

            // Registra erro no log apenas na falha final
            appendBrainstormResult({
              provider: 'multiple',
              model: 'multiple',
              file: file.name,
              result: `Error após ${MAX_RETRIES} tentativas: ${errorMsg}`,
              temperature: IA_TEMPERATURE,
              files: [file.name],
            });
          } else {
            console.warn(`⚠️ Tentativa ${attempt} falhou para ${file.name}: ${errorMsg}`);
            console.log(`🔄 Aguardando ${RETRY_DELAY}ms antes da próxima tentativa...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }

      // Log de status do arquivo processado
      if (processedSuccessfully) {
        console.log(`✅ Arquivo ${fileIndex + 1}/${files.length} concluído: ${file.name}`);
      } else {
        console.log(`❌ Arquivo ${fileIndex + 1}/${files.length} falhou: ${file.name}`);
      }

      // Delay entre arquivos para manter estabilidade
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    console.log('✅ Multi-IA brainstorm finished! See results in', RESULT_FILE_PATH);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Error running brainstorm:', errorMsg);
  }
};

//! ORIGINAL - NÃO MODIFICAR
// const run = async () => {
//   if (fs.existsSync(path.join('BRAINSTORM-RESULTS.md'))) {
//     fs.rmSync(path.join('BRAINSTORM-RESULTS.md'));
//   }

//   try {
//     console.log('🚀 Starting multi-IA brainstorm for textgen-webui stack files...');
//     // Deduplica arquivos por nome
//     const fileMap = new Map<string, string>();
//     for (const filePath of textgenStackFileList) {
//       if (!fileMap.has(filePath)) {
//         fileMap.set(
//           filePath,
//           fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[File not found]'
//         );
//       }
//     }
//     const files = Array.from(fileMap.entries()).map(([name, content]) => ({ name, content }));
//     console.log(
//       `[DEBUG] Arquivos para brainstorm:`,
//       files.map((f) => f.name)
//     );

//     await brainstormFilesMulti({
//       files,
//       providersModels: providerModelOptions,
//       systemPrompt: SYSTEM_PROMPT,
//       temperature: IA_TEMPERATURE,
//     });
//     console.log('✅ Multi-IA brainstorm finished! See results in', RESULT_FILE_PATH);
//   } catch (err: unknown) {
//     const errorMsg = err instanceof Error ? err.message : String(err);
//     console.error('❌ Error running brainstorm:', errorMsg);
//   }
// };

run().catch(console.error);
