import { z } from 'zod';

// Tipos e enums para eventos globais e handlers do design system

export type UIEventHandler<T = any> = (event: T) => void;

export enum UIEventType {
  CLICK = 'click',
  CHANGE = 'change',
  FOCUS = 'focus',
  BLUR = 'blur',
  SUBMIT = 'submit',
  KEYDOWN = 'keydown',
  KEYUP = 'keyup',
  MOUSEENTER = 'mouseenter',
  MOUSELEAVE = 'mouseleave',
  MOUSEMOVE = 'mousemove',
  MOUSEDOWN = 'mousedown',
  MOUSEUP = 'mouseup',
  CONTEXTMENU = 'contextmenu',
  COPY = 'copy',
  PASTE = 'paste',
  CUT = 'cut',
  DRAG = 'drag',
  DROP = 'drop',
}

export const uiEventTypeSchema = z.enum(Object.values(UIEventType) as [string, ...string[]]);
export type UIEventTypeProp = z.infer<typeof uiEventTypeSchema>;
