/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens: {
        'custom-lg': '1278px',
        'custom-xl': '1656px',
      },
      colors: {
        'custom-dark': '#444CB4',
        'custom-blue': '#28DEFC',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to left, #28DEFC, #444CB4)',
        'sidebar-gradient-custom': 'linear-gradient(to left, #444CB4, #00aaff)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        pollinator: ['Pollinator', 'serif'], // Move this under `extend`
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  }
}
