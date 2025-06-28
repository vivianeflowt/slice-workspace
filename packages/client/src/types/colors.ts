import { z } from 'zod';
import { Theme } from '~/styles/theme';

export const colorPropSchema = z.union([
  z.enum(Object.values(Theme.colors) as [string, ...string[]]),
  z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
]);

export type ColorProp = z.infer<typeof colorPropSchema>;
