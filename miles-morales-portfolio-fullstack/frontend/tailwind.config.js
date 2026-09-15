/** @type {import('tailwindcss').Config} */

// Every colour resolves through a CSS variable holding an "R G B" triplet, so
// the light/dark web-shooter toggle only has to swap variables on <html> —
// no component classes change between themes.
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: v('--c-void'),
        ink: v('--c-ink'),
        surface: v('--c-surface'),
        concrete: v('--c-concrete'),
        borderDark: v('--c-border'),
        // Primary heading/body colour. Was a hardcoded `text-white` before the
        // light theme existed — flips to near-black on light.
        headline: v('--c-headline'),
        spider: {
          DEFAULT: v('--c-spider'),
          bright: v('--c-spider-bright'),
          dark: v('--c-spider-dark'),
          glow: 'rgba(230, 36, 41, 0.35)',
        },
        venom: {
          purple: v('--c-venom'),
          electric: v('--c-venom-electric'),
          dark: v('--c-venom-dark'),
          glow: 'rgba(168, 85, 247, 0.35)',
        },
        graffiti: {
          yellow: v('--c-yellow'),
          cyan: v('--c-cyan'),
        },
        web: v('--c-web'),
        paper: v('--c-paper'),
        subtext: v('--c-subtext'),
      },
      fontFamily: {
        display: ['Impact', 'Oswald', 'Bebas Neue', 'sans-serif'],
        comic: ['Bangers', 'Impact', 'sans-serif'],
        sans: ['Space Grotesk', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'spider-glow': '0 0 25px rgba(230, 36, 41, 0.25)',
        'venom-glow': '0 0 25px rgba(168, 85, 247, 0.25)',
        'comic-hard': '4px 4px 0px rgb(var(--c-spider))',
        'comic-purple': '4px 4px 0px rgb(var(--c-venom))',
        'comic-black': '5px 5px 0px rgb(var(--c-hard-shadow))',
      },
      backgroundImage: {
        'halftone': "radial-gradient(rgb(var(--c-border)) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
