import { z } from 'zod';

// Tipos e validação para sombras do design system
export const shadowValues = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'] as const;
export const shadowSchema = z.enum(shadowValues);
export type ShadowProp = z.infer<typeof shadowSchema>;
