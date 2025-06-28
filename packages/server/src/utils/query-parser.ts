import { ZodSchema } from 'zod';
import { formatZodError } from './zod-error';
import qs from 'qs';

/**
 * Padrão de simetria: ambas funções usam qs com as mesmas opções para garantir ida e volta perfeita.
 * - Suporta objetos aninhados, arrays, tipos primitivos.
 * - Sempre use estas funções em conjunto para evitar inconsistências.
 * - Todas as queries devem ser geradas e parseadas com qs e { encode: true, arrayFormat: 'indices' }.
 */

const QS_OPTIONS = { encode: true, arrayFormat: 'indices' } as const;

// Função pura para parsear query string em Map
export function parseQueryToMap(queryString: string): Map<string, any> {
  const parsed = qs.parse(queryString, { ...QS_OPTIONS, ignoreQueryPrefix: true });
  return new Map(Object.entries(parsed));
}

// Função pura para transformar Map em query string
export function mapToQueryString(map: Map<string, any>): string {
  const obj = Object.fromEntries(map.entries());
  return qs.stringify(obj, QS_OPTIONS);
}

// Função curry para validar com Zod
export const validateQueryWithZod = (schema: ZodSchema<any>) => (query: any) => {
  const result = schema.safeParse(query);
  if (result.success) {
    return { success: true, data: result.data, error: null };
  } else {
    return { success: false, data: null, error: formatZodError(result.error) };
  }
};
