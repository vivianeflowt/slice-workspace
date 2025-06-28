import { z } from 'zod';

import type { ColorProp } from './colors';
import type { BorderRadiusProp } from './border';
import type { SpacingProp } from './spacing';
import type { FontFamilyProp, FontWeightProp, FontStyleProp } from './font';
import type { RadiusProp } from './radius';
import type { ShadowProp } from './shadow';
import type { ZIndexProp } from './zindex';
import type { OpacityProp } from './opacity';
import type { TransitionProp } from './transition';

// Schema central do tema, agregando todos os tokens do design system
export const themeSchema = z.object({
  color: z.custom<ColorProp>(),
  borderRadius: z.custom<BorderRadiusProp>(),
  spacing: z.custom<SpacingProp>(),
  fontFamily: z.custom<FontFamilyProp>(),
  fontWeight: z.custom<FontWeightProp>(),
  fontStyle: z.custom<FontStyleProp>(),
  radius: z.custom<RadiusProp>(),
  shadow: z.custom<ShadowProp>(),
  zIndex: z.custom<ZIndexProp>(),
  opacity: z.custom<OpacityProp>(),
  transition: z.custom<TransitionProp>(),
});

export type Theme = z.infer<typeof themeSchema>;
