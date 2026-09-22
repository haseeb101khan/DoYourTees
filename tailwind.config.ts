import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080808",
        bone: "#f6f3ee",
        blood: "#d4121f",
        asphalt: "#171717"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["Consolas", "monospace"]
      },
      boxShadow: {
        hard: "8px 8px 0 #080808"
      }
    }
  },
  plugins: []
};

export default config;
