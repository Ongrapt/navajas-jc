import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          base: "#17191B",
          panel: "#202325",
          line: "#333739",
        },
        bone: {
          DEFAULT: "#ECE7DD",
          dim: "#9AA0A2",
        },
        brass: {
          DEFAULT: "#C39A4E",
          bright: "#D8B871",
        },
        oxblood: "#7E2A22",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
