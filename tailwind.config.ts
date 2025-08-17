import type { Config } from "tailwindcss";
const {heroui} = require("@heroui/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slow-spin': 'spin 10s linear infinite', // Slower spin (4s duration)
      },
      backgroundImage: {
        "gradient-radial":
          "linear-gradient(180deg, #DC1D24 0%, #D41B21 49.48%, #A60308 100%) !important",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-orange-card":
          "linear-gradient(142deg, #F9EFE3 8.29%, #FCE2C9 88.99%)",
        "gradient-orange-border":
          "linear-gradient(138deg, #FFF6EA 0%, #FFF1E6 46.99%, #E19A63 100%)",
      },
      colors : {
        primary : '#F57C00',
        light : '#fff1e0',
        dark : '#2f4858',
        info: "#485682",
        background : "#161618",
        dark_1: "#323234"
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
