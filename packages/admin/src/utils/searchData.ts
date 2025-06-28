import fs from "fs";
import path from "path";

// Função de fuzzy match
function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  return t.includes(q) || q.split(" ").every((word) => t.includes(word));
}

export interface SearchResult {
  file: string;
  content: string;
  score: number;
  params?: Record<string, string>;
}

export interface SearchParams {
  [key: string]: string | undefined;
}

export interface SearchOptions {
  mode?: "AND" | "OR"; // Combinação dos parâmetros
  fieldsPriority?: string[]; // Prioridade dos campos na pontuação
  partial?: boolean; // Permite match parcial
}

function extractParams(content: string): Record<string, string> {
  const params: Record<string, string> = {};
  const regex = /^(\w+):\s*(.+)$/gm;
  let match;
  while ((match = regex.exec(content))) {
    params[match[1].toLowerCase()] = match[2].trim();
  }
  return params;
}

export function searchDataFlexible(
  params: SearchParams,
  baseDir: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { mode = "AND", fieldsPriority = [], partial = true } = options;
  const results: SearchResult[] = [];
  function searchDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        searchDir(filePath);
      } else if (
        file.endsWith(".md") ||
        file.endsWith(".yaml") ||
        file.endsWith(".json")
      ) {
        const content = fs.readFileSync(filePath, "utf-8");
        const extracted = extractParams(content);
        // Combinação dos parâmetros
        const matches = Object.entries(params).map(([key, value]) => {
          if (!value) return false;
          const fieldValue = extracted[key] || "";
          return partial ? fuzzyMatch(value, fieldValue) : fieldValue === value;
        });
        const isMatch =
          mode === "AND" ? matches.every(Boolean) : matches.some(Boolean);
        if (isMatch) {
          // Score: prioriza campos definidos em fieldsPriority
          let score = 0;
          for (const [key, value] of Object.entries(params)) {
            if (value && fuzzyMatch(value, extracted[key] || "")) {
              score += fieldsPriority.includes(key) ? 3 : 1;
            }
          }
          // Bônus se nome do arquivo bate
          if (params.filename && fuzzyMatch(params.filename, file)) score += 2;
          results.push({ file: filePath, content, score, params: extracted });
        }
      }
    }
  }
  searchDir(baseDir);
  return results.sort((a, b) => b.score - a.score);
}
