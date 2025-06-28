import { z } from 'zod';

export enum CursorType {
  DEFAULT = 'default',
  POINTER = 'pointer',
  TEXT = 'text',
  WAIT = 'wait',
  HELP = 'help',
  MOVE = 'move',
  NE_RESIZE = 'ne-resize',
  NW_RESIZE = 'nw-resize',
  SE_RESIZE = 'se-resize',
  SW_RESIZE = 'sw-resize',
  EW_RESIZE = 'ew-resize',
  NS_RESIZE = 'ns-resize',
  NESW_RESIZE = 'nesw-resize',
  NWSE_RESIZE = 'nwse-resize',
  COL_RESIZE = 'col-resize',
  ROW_RESIZE = 'row-resize',
  ALL_RESIZE = 'all-resize',
}

export const CursorTypeSchema = z
  .enum(Object.values(CursorType) as [string, ...string[]])
  .refine((value) => Object.values(CursorType).includes(value as CursorType), {
    message: 'Invalid cursor type',
  });

export type Cursor = z.infer<typeof CursorTypeSchema>;
