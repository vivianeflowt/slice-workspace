import { z } from 'zod';

// Tipos e validação para opacidade do design system
export const opacityValues = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100] as const;
export const opacitySchema = z.union([
  z.enum(opacityValues.map(String) as [string, ...string[]]),
  z.number().min(0).max(100),
]);
export type OpacityProp = z.infer<typeof opacitySchema>;
