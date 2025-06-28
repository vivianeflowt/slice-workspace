import { z } from 'zod';

// Tipos e validação para radius (raio de borda) do design system
export const radiusValues = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
export const radiusSchema = z.union([
  z.enum(radiusValues),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);
export type RadiusProp = z.infer<typeof radiusSchema>;
