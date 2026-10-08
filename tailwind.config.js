/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#222222',
          panel: '#282828',
          border: '#333333',
          borderHover: '#444444',
          subtle: '#2e2e2e',
        },
        lc: {
          accent: '#ffa116',
          accentHover: '#ffb33e',
          easy: '#00b8a3',
          medium: '#ffc01e',
          hard: '#ff375f',
          text: '#eff1f6',
          muted: '#8a8a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
