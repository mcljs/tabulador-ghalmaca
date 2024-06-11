
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        designer: ["Designer"],
        primary: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: "#091C50",
        secondary: "#E4B336",
      },
      gridTemplateRows: {
        'max-content': 'max-content',
      },
      spacing: {
        '5vw': '5vw', // pull featured sections and navbar in the margin
        '8vw': '8vw', // positions hero img inside the margin
        '10vw': '10vw', // page margin
      },
      height: {
        hero: 'min(60rem, calc(100vh - 10rem))', // screen - navbar height (lg: only)
      },
      maxWidth: {
        '8xl': '96rem',
      },
      maxHeight: {
        '50vh': '50vh', // max height for medium size hero images
        '75vh': '75vh', // max height for giant size hero images
      },
      rotate: {
        '-135': '-135deg',
        135: '135deg',
      },
      animation: {
        "background-shine": "background-shine 2s linear infinite"
      },
      "keyframes": {
        "background-shine": {
          "from": {
            "backgroundPosition": "0 0"
          },
          "to": {
            "backgroundPosition": "-200% 0"
          }
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
