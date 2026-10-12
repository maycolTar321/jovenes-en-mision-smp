/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde bosque (#214C3B), profundo (#16382D), suave (#E4EEE8)
        forest: {
          50: '#F1F3F1',   // Gris claro (#F1F3F1)
          100: '#E4EEE8',  // Verde suave (#E4EEE8)
          200: '#C9DCD2',
          300: '#A3C4B3',
          400: '#6FA48C',
          500: '#3D7A61',
          600: '#214C3B',  // Verde bosque principal (#214C3B)
          700: '#1B4032',
          800: '#16382D',  // Verde profundo (#16382D)
          900: '#102A22',
          950: '#0A1C16',
        },
        // Mapeo institucional brand para compatibilidad
        brand: {
          50: '#F1F3F1',
          100: '#E4EEE8',
          200: '#C9DCD2',
          300: '#A3C4B3',
          400: '#6FA48C',
          500: '#3D7A61',
          600: '#214C3B',  // Verde bosque
          700: '#16382D',  // Verde profundo
          800: '#102A22',
          900: '#0A1C16',
          950: '#06130F',
        },
        // Gris carbón (#303632), Gris medio (#737B76), Gris claro (#F1F3F1)
        carbon: {
          50: '#F7F8F7',
          100: '#F1F3F1',  // Gris claro
          200: '#E1E4E2',
          300: '#C3C8C5',
          400: '#A0A7A3',
          500: '#737B76',  // Gris medio
          600: '#545B56',
          700: '#3E4440',
          800: '#303632',  // Gris carbón (#303632)
          900: '#222724',
          950: '#151917',
        },
        // Superficies limpias
        cream: {
          50: '#FFFFFF',
          100: '#F7F8F7',
          200: '#F1F3F1',
          300: '#E1E4E2',
          400: '#C3C8C5',
          500: '#737B76',
          DEFAULT: '#FFFFFF',
          paper: '#F1F3F1',
          card: '#FFFFFF',
          dark: '#E1E4E2',
        },
        terracotta: {
          50: '#F1F3F1',
          100: '#E4EEE8',
          200: '#C9DCD2',
          300: '#A3C4B3',
          400: '#6FA48C',
          500: '#3D7A61',
          600: '#214C3B',
          700: '#16382D',
          800: '#102A22',
          900: '#0A1C16',
        },
        gold: {
          50: '#F1F3F1',
          100: '#E4EEE8',
          200: '#C9DCD2',
          300: '#A3C4B3',
          400: '#6FA48C',
          500: '#214C3B',
          600: '#16382D',
          700: '#102A22',
          800: '#0A1C16',
          900: '#06130F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(33, 76, 59, 0.05)',
        'elevated': '0 10px 30px -5px rgba(22, 56, 45, 0.10)',
      }
    },
  },
  plugins: [],
}
