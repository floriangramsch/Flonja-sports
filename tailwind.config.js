/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",

  content: [
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],

  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // sonja: {
        //   fg: "#082f49",
        //   bg: "#111827",
        //   akz: "#27272a",
        //   text: "#e7e5e4",
        //   akz2: "#bfdbfe",
        // },
        sonja: {
          bg: "#27272a",
          fg: "#a8a29e",
          text: "#1e293b",
          akz: "#0d9488",
          akz2: "#eef2ff",
        },
      },
    },
  },
};
