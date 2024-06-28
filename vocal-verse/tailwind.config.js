/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '4rem'
      },
      colors: {
        swatch: {
          1: '#feecf6',
          2: '#34122a',
          3: '#c9a3b3',
          4: '#dd3166',
          5: '#794c88',
          6: '#fab22d',
          7: '#965494'
        }
      }
    },
  },
  plugins: [],
}