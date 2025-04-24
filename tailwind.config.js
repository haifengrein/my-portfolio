/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./layouts/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}