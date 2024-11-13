import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : '#F57C00',
        light : '#fff1e0',
        dark : '#2f4858'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
