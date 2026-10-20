/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBg: '#F7F9FC',
        cardBg: '#FFFFFF',
        cardBorder: '#E5EAF1',
        borderMuted: '#DCE3EC',
        surfaceMuted: '#F1F5F9',
        textPrimary: '#172B4D',
        textSecondary: '#64748B',
        vyNavy: {
          50: '#f0f4f9',
          100: '#d9e2ef',
          200: '#b3c6df',
          500: '#2b5f9e',
          700: '#1F497D',
          800: '#172B4D',
          900: '#0e233d',
          950: '#081424'
        },
        vyBlue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563EB',
          600: '#1d4ed8',
          700: '#1e40af'
        },
        vyAmber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#B45309',
          600: '#92400e'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
