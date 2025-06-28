import { z } from 'zod';

// Tipos e validação para fontes (família, peso, estilo) do design system

export const fontFamilyValues = ['sans', 'serif', 'mono', 'system'] as const;
export const fontFamilySchema = z.enum(fontFamilyValues);
export type FontFamilyProp = z.infer<typeof fontFamilySchema>;

export const fontWeightValues = [
  'thin',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
] as const;
export const fontWeightSchema = z.enum(fontWeightValues);
export type FontWeightProp = z.infer<typeof fontWeightSchema>;

export const fontStyleValues = ['normal', 'italic', 'oblique'] as const;
export const fontStyleSchema = z.enum(fontStyleValues);
export type FontStyleProp = z.infer<typeof fontStyleSchema>;
