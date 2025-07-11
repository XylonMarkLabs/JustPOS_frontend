/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {  
    extend: {
      colors:{
        primary: "#292929",
        secondary: "#FBF8EF",
        surface:"#e0dac5",
        surface2:"#b0a892",
        background: "#eceff1"
      },
    },
  },
  plugins: [],
}

