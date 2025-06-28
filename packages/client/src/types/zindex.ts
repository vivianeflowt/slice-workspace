import { z } from 'zod';

// Tipos e validação para z-index (níveis de sobreposição) do design system

export const zIndexValues = [
  'auto',
  'base',
  'dropdown',
  'sticky',
  'banner',
  'overlay',
  'modal',
  'popover',
  'tooltip',
  'toast',
  'max',
] as const;
export const zIndexSchema = z.union([z.enum(zIndexValues), z.number()]);
export type ZIndexProp = z.infer<typeof zIndexSchema>;
