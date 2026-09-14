/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#07080b',
        ink: '#0e1017',
        surface: '#151722',
        concrete: '#222533',
        borderDark: '#2c3042',
        spider: {
          DEFAULT: '#e62429',
          bright: '#ff1f3d',
          dark: '#930b14',
          glow: 'rgba(230, 36, 41, 0.35)',
        },
        venom: {
          purple: '#a855f7',
          electric: '#c026d3',
          dark: '#581c87',
          glow: 'rgba(168, 85, 247, 0.35)',
        },
        graffiti: {
          yellow: '#ffd600',
          cyan: '#00f0ff',
        },
        web: '#f3f4f8',
        paper: '#e8e6df',
        subtext: '#9ba1b6',
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
        'comic-hard': '4px 4px 0px #e62429',
        'comic-purple': '4px 4px 0px #a855f7',
        'comic-black': '5px 5px 0px #000000',
      },
      backgroundImage: {
        'halftone': "radial-gradient(#2c3042 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
