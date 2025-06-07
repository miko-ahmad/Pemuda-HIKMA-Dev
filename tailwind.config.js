/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#650257",
        secondary: "#1e3a8a",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem", // 16px
          sm: "1.5rem",
          lg: "2rem",
          xl: "4rem",
          "2xl": "5rem",
        },
        screens: {
          sm: "600px",
          md: "728px",
          lg: "984px",
          xl: "1240px",
          "2xl": "1440px",
        },
      },
    },
  },
  plugins:[daisyui],
};
