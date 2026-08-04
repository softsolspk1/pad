/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: "#fdf2f3",
          100: "#fce4e6",
          200: "#f8c9ce",
          300: "#f0a0a9",
          400: "#e56b7a",
          500: "#d13e52",
          600: "#a6192e", // brand primary
          700: "#8b1526",
          800: "#711321",
          900: "#5f131f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};
