/** @type {import('tailwindcss').Config} */

const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hawkins: {
          void: v('--c-void'),
          surface: v('--c-surface'),
          card: v('--c-card'),
          border: v('--c-border'),
          'border-light': v('--c-border-light'),
          text: v('--c-text'),
          'text-muted': v('--c-text-muted'),
          'text-dim': v('--c-text-dim'),
          red: v('--c-red'),
          amber: v('--c-amber'),
          orange: v('--c-orange'),
          olive: v('--c-olive'),
          navy: v('--c-navy'),
          crt: v('--c-crt'),
        }
      },
      fontFamily: {
        title: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'hawkins-glow': '0 0 24px rgba(224, 46, 46, 0.35)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'crt-glow': '0 0 15px rgba(51, 255, 102, 0.25)',
        'upside-glow': '0 0 28px rgba(194, 20, 38, 0.45)',
        'case-file': '3px 3px 0px rgba(58, 50, 42, 0.8)',
      },
      backgroundImage: {
        'analog-grid': "linear-gradient(to right, rgba(90, 75, 60, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(90, 75, 60, 0.1) 1px, transparent 1px)",
        'vignette': "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
      },
      animation: {
        'flicker': 'flicker 4s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'rift-glow': 'riftGlow 5s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(0.995)' },
        },
        riftGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(224, 46, 46, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
