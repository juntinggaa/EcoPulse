/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf4",
          100: "#d6f2e3",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        ink: {
          900: "#0b1320",
          700: "#1f2937",
          500: "#6b7280",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
