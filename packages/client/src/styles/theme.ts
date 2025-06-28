// Tokens globais do design system: cores, radius, spacing, fonte, sombra, zindex, opacidade, transição

// export const COLORS = {
//   primary: '#4af', // Azul destaque
//   text: '#f3f3f3',
//   textSecondary: '#bbb',
//   background: '#181a20',
//   surface: '#23272f',
//   surfaceActive: '#222e',
//   border: '#222',
// };

export const Theme = {
  // Paleta de cores
  colors: {
    primary: '#4af', // Azul destaque
    secondary: '#f3f3f3',
    accent: '#ffb300',
    success: '#22c55e',
    warning: '#f59e42',
    error: '#ef4444',
    info: '#38bdf8',
    text: '#f3f3f3',
    textSecondary: '#bbb',
    background: '#181a20',
    backgroundAlt: '#23272f',
    surface: '#23272f',
    surfaceActive: '#222e',
    border: '#222',
    borderLight: '#333',
    borderDark: '#111',
    overlay: 'rgba(24,26,32,0.8)',
    highlight: '#4af2',
    muted: '#444',
    white: '#fff',
    black: '#000',
    transparent: 'transparent',
  },

  // Radius (raio de borda)
  radius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
    full: '9999px',
  },

  // Espaçamentos
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

  // Tipografia
  font: {
    family: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, Times, serif',
      mono: 'Fira Mono, Menlo, monospace',
      system: 'system-ui',
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
    style: {
      normal: 'normal',
      italic: 'italic',
      oblique: 'oblique',
    },
    size: {
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '28px',
    },
  },

  // Sombra
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

  // Z-Index
  zindex: {
    auto: 'auto',
    base: 0,
    dropdown: 100,
    sticky: 200,
    banner: 300,
    overlay: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    toast: 800,
    max: 9999,
  },

  // Opacidade
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },

  // Transições
  transition: {
    none: 'none',
    all: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    colors: 'color 0.2s cubic-bezier(0.4,0,0.2,1)',
    opacity: 'opacity 0.2s cubic-bezier(0.4,0,0.2,1)',
    shadow: 'box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)',
    transform: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
    blur: 'filter 0.3s cubic-bezier(0.4,0,0.2,1)',
    fade: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1)',
    scale: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    slide: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
  },
};
