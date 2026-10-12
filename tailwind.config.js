/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rojo institucional principal del logo y la identidad (#D71920)
        brand: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#D71920', // Rojo primario oficial
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        // Mapeo de forest a Carbón / Negro / Gris (cero verde)
        forest: {
          50: '#F9FAFB',
          100: '#F3F4F6', // Gris claro
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF', // Gris medio
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#262626', // Carbón
          900: '#171717', // Negro carbón (#171717)
          950: '#0A0A0A', // Negro profundo
        },
        // Mapeo de cream a Blanco y Gris claro
        cream: {
          50: '#FFFFFF',  // Blanco puro
          100: '#F9FAFB',
          200: '#F3F4F6', // Gris claro (#F3F4F6)
          300: '#E5E7EB',
          400: '#D1D5DB',
          500: '#9CA3AF',
          DEFAULT: '#FFFFFF',
          paper: '#F9FAFB',
          card: '#FFFFFF',
          dark: '#E5E7EB',
        },
        // Mapeo de terracotta al Rojo institucional
        terracotta: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#D71920', // Rojo
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Acentos dorados o ámbar de la cruz
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D71920', // Rojo para botones destacados
          600: '#B91C1C',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
