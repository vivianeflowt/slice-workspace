import { z } from 'zod';

// Tipos e validação para transições/animacoes do design system

export const transitionValues = [
  'none',
  'all',
  'colors',
  'opacity',
  'shadow',
  'transform',
  'blur',
  'fade',
  'scale',
  'slide',
] as const;
export const transitionSchema = z.enum(transitionValues);
export type TransitionProp = z.infer<typeof transitionSchema>;
