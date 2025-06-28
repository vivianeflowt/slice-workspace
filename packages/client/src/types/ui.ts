// Tipos globais para componentes UI

import { z } from 'zod';

export type DropdownChangeHandler = (value: string) => void;

export enum ComponentSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ComponentVariant {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum ComponentBorder {
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

// Font size
export const themeFontSizes = ['sm', 'md', 'lg'] as const;

export const fontSizeSchema = z.union([
  z.enum(themeFontSizes),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);

export type FontSizeProp = z.infer<typeof fontSizeSchema>;

// Padding
export const themeSpacing = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export const paddingSchema = z.union([
  z.enum(themeSpacing),
  z.string().regex(/^[0-9]+(px|rem|em|%)$/),
]);

export type PaddingProp = z.infer<typeof paddingSchema>;

// Width/Height
export const sizeSchema = z.string().regex(/^[0-9]+(px|rem|em|%)$/);

export type SizeProp = z.infer<typeof sizeSchema>;

// Reexports dos tipos globais do design system
export * from './border';
export * from './spacing';
export * from './font';
export * from './radius';
export * from './shadow';
export * from './zindex';
export * from './opacity';
export * from './transition';
export * from './icon';
export * from './event';
export * from './theme';
