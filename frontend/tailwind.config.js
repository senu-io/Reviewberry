/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#07050A',
          900: '#0C0814',
          850: '#120D1C',
          800: '#191325',
          750: '#211A31',
          700: '#2B223F',
          600: '#3D3156',
          500: '#544572',
          400: '#756399',
        },
        berry: {
          50: '#fff0f5',
          100: '#ffe3ee',
          200: '#ffc8dd',
          300: '#ff9ec1',
          400: '#ff629c',
          500: '#ff1e70', // Electric cyber-berry
          600: '#e60058',
          700: '#bf0045',
          800: '#9e023b',
          900: '#850734',
        },
        neon: {
          cyan: '#00F5D4',
          purple: '#9B5DE5',
          amber: '#F15BB5',
          gold: '#FEE440',
          mint: '#05D5B3',
        },
        amd: {
          red: '#ED1C24',
          dark: '#141414',
          glow: 'rgba(237, 28, 36, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-berry': '0 0 25px -5px rgba(255, 30, 112, 0.35)',
        'glow-amd': '0 0 25px -5px rgba(237, 28, 36, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 245, 212, 0.3)',
      }
    },
  },
  plugins: [],
}
