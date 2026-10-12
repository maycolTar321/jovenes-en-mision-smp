/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede5',
          200: '#c5dccf',
          300: '#9cc3b0',
          400: '#6fa58d',
          500: '#4b886f',
          600: '#386d57',
          700: '#2d5746',
          800: '#1b4332', // Verde bosque principal
          900: '#143326',
          950: '#0b1d16',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ede0',
          300: '#ede0cc',
          400: '#dfcbb0',
          500: '#d1b593',
          DEFAULT: '#fdfbf7',
          paper: '#f7f4ed',
          card: '#ffffff',
          dark: '#e9e1d2',
        },
        terracotta: {
          50: '#fdf4f0',
          100: '#fbe6de',
          200: '#f7cfc0',
          300: '#f1ad97',
          400: '#e88267',
          500: '#db5e3d',
          600: '#c85a32', // Terracota principal
          700: '#a73e1c',
          800: '#87341b',
          900: '#6f2e1a',
        },
        gold: {
          50: '#fefbf1',
          100: '#fcf5dc',
          200: '#f8e9b4',
          300: '#f3d882',
          400: '#ecc555',
          500: '#d4af37', // Dorado suave principal
          600: '#ba9427',
          700: '#946f20',
          800: '#7a5720',
          900: '#664720',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.08)',
        'elevated': '0 10px 30px -5px rgba(27, 67, 50, 0.15)',
      }
    },
  },
  plugins: [],
}
