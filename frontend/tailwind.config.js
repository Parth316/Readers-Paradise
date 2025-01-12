/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js,ts,tsx}',
    './components/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34d399',
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
  plugins: [],
}