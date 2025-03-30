const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#1D4ED8", // blue-700
          dark: "#3B82F6", // blue-500
        },
        background: {
          light: "#F4F4F5", // zinc-100
          dark: "#111827", // gray-900
        },
        zinc: {
          350: '#BABAC1',
        },
        gray: {
          850: '#18202F',
          950: '#0C1220',
          1000: '#080C13'
        }
      },
    },
    fontFamily: {
      sans: ['"Source Sans Pro"', 'sans-serif']
    },
  },
  safelist: [
    {
      pattern: /bg-(orange|green|)-(4|7)00/,
    },
  ],
  plugins: [],
}
