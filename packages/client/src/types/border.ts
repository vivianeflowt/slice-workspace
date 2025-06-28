import { z } from 'zod';

// Tipos e validação para bordas (estilo, largura, radius) do design system

export enum BorderStyle {
  NONE = 'none',
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
  GROOVE = 'groove',
  RIDGE = 'ridge',
  INSET = 'inset',
  OUTSET = 'outset',
}

export const borderStyleSchema = z.enum(Object.values(BorderStyle) as [string, ...string[]]);
export type BorderStyleProp = z.infer<typeof borderStyleSchema>;

export const borderWidthValues = ['none', 'thin', 'medium', 'thick'] as const;
export const borderWidthSchema = z.union([
  z.enum(borderWidthValues),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);
export type BorderWidthProp = z.infer<typeof borderWidthSchema>;

export const borderRadiusValues = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;
export const borderRadiusSchema = z.union([
  z.enum(borderRadiusValues),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);
export type BorderRadiusProp = z.infer<typeof borderRadiusSchema>;
