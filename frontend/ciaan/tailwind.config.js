/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        form: "2px 2px 5px #2773a5 ",
      },
      colors: {
        dark: "#212121",
        light: "#3ed8ff ",
        lighter: "#a8f5ff",
        grey: "#cccc",
        blu: "#3498db",
      },
      fontFamily: {
        nato: ["Lato", "sans-serif"],
        soft: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
