/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Dark mode palette
        ink: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a24',
          700: '#242432',
          600: '#2e2e40',
        },
        acid: {
          DEFAULT: '#c8f135',
          dark: '#a8cc1a',
          muted: '#c8f13520',
        },
        // Light mode palette
        cream: {
          50:  '#fdf8f0',
          100: '#f5ede0',
          200: '#e8d9c4',
          300: '#d4b896',
        },
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2d5a8e',
          muted: '#1e3a5f20',
        },
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
        'fade-in': 'fade-in 0.3s ease both',
        pulse2:    'pulse2 1.5s ease infinite',
      },
    },
  },
  plugins: [],
}
