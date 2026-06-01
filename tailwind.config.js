
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
          subtle: 'var(--color-ink-subtle)',
        },
        hairline: 'var(--color-hairline)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
        },
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        full: '9999px', // Strictly for avatars/circles
      },
      boxShadow: {
        none: 'none',
        hairline: '0 0 0 1px var(--color-hairline)',
        raised: '0 1px 2px rgba(26,26,23,0.04), 0 0 0 1px var(--color-hairline)',
        modal: '0 8px 32px rgba(26,26,23,0.12)',
      }
    },
  },
  plugins: [],
}
