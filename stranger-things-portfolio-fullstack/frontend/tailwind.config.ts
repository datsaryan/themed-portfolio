import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hawkins: {
          void:    '#0a0a0f',
          surface: '#0f0f1a',
          card:    '#141424',
          border:  '#2a1f3a',
          text:    '#c8b8d8',
          muted:   '#6b5a7a',
          red:     '#e53e3e',
          crimson: '#c53030',
          amber:   '#f6ad55',
          orange:  '#ed8936',
          olive:   '#68d391',
          navy:    '#2d3748',
          crt:     'rgba(0,255,0,0.03)',
          glow:    '#9f7aea',
        },
        upside: {
          void:    '#0f0505',
          surface: '#1a0808',
          card:    '#240f0f',
          border:  '#3a1515',
          text:    '#e8c8c8',
          red:     '#fc4040',
          orange:  '#ff6b00',
          amber:   '#ff9900',
          glow:    '#ff3300',
        }
      },
      fontFamily: {
        stranger: ['"Cinzel Decorative"', 'serif'],
        cinzel:   ['"Cinzel"', 'serif'],
        mono:     ['"IBM Plex Mono"', 'monospace'],
        sans:     ['"Inter"', 'sans-serif'],
      },
      animation: {
        flicker:    'flicker 0.15s infinite',
        scanlines:  'scanlines 8s linear infinite',
        spore:      'spore 6s ease-in-out infinite',
        glitch:     'glitch 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both',
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        pulse:      'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.85' },
        },
        scanlines: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        spore: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%':      { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
        },
        glitch: {
          '0%':   { transform: 'translate(0)' },
          '20%':  { transform: 'translate(-2px, 2px)' },
          '40%':  { transform: 'translate(-2px, -2px)' },
          '60%':  { transform: 'translate(2px, 2px)' },
          '80%':  { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'hawkins-glow':  '0 0 20px rgba(159,122,234,0.3), 0 0 40px rgba(159,122,234,0.1)',
        'red-glow':      '0 0 20px rgba(229,62,62,0.4), 0 0 40px rgba(229,62,62,0.2)',
        'amber-glow':    '0 0 15px rgba(246,173,85,0.3)',
        'card':          '0 4px 24px rgba(0,0,0,0.6)',
        'upside-glow':   '0 0 30px rgba(255,51,0,0.4), 0 0 60px rgba(255,51,0,0.2)',
      },
      backgroundImage: {
        'gradient-hawkins': 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #141424 100%)',
        'gradient-upside':  'linear-gradient(135deg, #0f0505 0%, #1a0808 50%, #240f0f 100%)',
      },
    },
  },
  plugins: [],
}

export default config
