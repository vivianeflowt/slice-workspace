import { z } from 'zod';

// Tipos e validação para espaçamentos (margin, padding, gap) do design system

export const spacingValues = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
export const spacingSchema = z.union([
  z.enum(spacingValues),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);
export type SpacingProp = z.infer<typeof spacingSchema>;
