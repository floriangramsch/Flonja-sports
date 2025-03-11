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
          bg: "#97918e",
          "bg-darker": "#a8a29e",
          fg: "#27272a",
          text: "#1e293b",
          akz: "#0d9488",
          // akz2: "#eef2ff",
          akz2: "#eef2ef",
          akz3: "#C1D7F0",
          lila: "#7c4d91",
        },
      },
      screens: {
        "mobile-landscape": {
          raw: "(max-width: 768px) and (orientation: landscape)",
        },
      },
    },
    variants: {
      extend: {
        display: ["mobile-landscape"],
      },
    },
  },
};
