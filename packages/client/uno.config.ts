import { defineConfig, presetWebFonts } from 'unocss';

import presetWind4 from '@unocss/preset-wind4';

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      themeKey: 'font',
      fonts: {
        sans: 'Inter:400,500,700',
        mono: 'JetBrains Mono:400,700',
      },
    }),
  ],
  theme: {
    colors: {
      brand: {
        primary: '#0ea5e9',
        secondary: '#f3f3f3',
      },
      accent: '#ffb300',
      success: '#22c55e',
      warning: '#f59e42',
      error: '#ef4444',
      info: '#38bdf8',
      surface: '#23272f',
      background: '#181a20',
      border: '#222',
      white: '#fff',
      black: '#000',
    },
    radius: {
      none: '0px',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '32px',
      full: '9999px',
    },
    spacing: {
      none: '0px',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
    },
    shadow: {
      none: 'none',
      xs: '0 1px 2px 0 rgba(0,0,0,0.04)',
      sm: '0 1.5px 4px 0 rgba(0,0,0,0.08)',
      md: '0 4px 12px 0 rgba(0,0,0,0.12)',
      lg: '0 8px 24px 0 rgba(0,0,0,0.16)',
      xl: '0 16px 48px 0 rgba(0,0,0,0.20)',
      '2xl': '0 24px 64px 0 rgba(0,0,0,0.24)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    },
    font: {
      family: {
        sans: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Menlo, monospace',
      },
      weight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      size: {
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
      },
    },
    breakpoint: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
});
