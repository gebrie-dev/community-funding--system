/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          light: "#dcfce7",
        },
        secondary: "#3b82f6",
        dark: {
          DEFAULT: "#0f172a",
          lighter: "#1e293b",
          light: "#334155",
        },
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
        text: {
          light: "#1e293b",
          dark: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};
