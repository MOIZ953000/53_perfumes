/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FAF9F6',
        sand: '#F4F2EC',
        obsidian: '#141416',
        charcoal: '#1E1E22',
        onyx: {
          950: '#141416',
          900: '#1A1A1E',
          850: '#222227',
          800: '#2C2C33',
          700: '#3A3A42',
          600: '#52525C',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E6',
          200: '#F3E5C4',
          300: '#DFC27D',
          400: '#C5A059',
          500: '#BFA15F',
          600: '#A6843A',
          700: '#87692A',
          800: '#644D1B',
        },
        ruby: {
          950: '#38060C',
          900: '#520912',
          850: '#6A0D18',
          800: '#7F101E',
          700: '#9C1727',
          600: '#BA2234',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Cormorant Garamond', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 25px rgba(197, 160, 89, 0.18)',
        'gold-glow-lg': '0 8px 35px rgba(197, 160, 89, 0.28)',
        'ruby-glow': '0 4px 25px rgba(106, 13, 24, 0.25)',
        'editorial': '0 10px 40px -10px rgba(20, 20, 22, 0.08)',
        'pedestal': '0 20px 50px -15px rgba(197, 160, 89, 0.12), 0 10px 30px -10px rgba(20, 20, 22, 0.06)',
      },
      backgroundImage: {
        'water-caustics': "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.08) 0%, transparent 60%)",
      }
    },
  },
  plugins: [],
}
