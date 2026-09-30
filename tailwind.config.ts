import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ea",
        "paper-deep": "#efe6d6",
        ink: "#141210",
        "ink-soft": "#3a342c",
        muted: "#6d655c",
        line: "#e4dccf",
        accent: "#b4532a",
        "accent-soft": "#f4e6dc",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Iowan Old Style", "Palatino Linotype", "Palatino", "serif"],
        reading: ["var(--font-reading)", "Iowan Old Style", "Palatino Linotype", "serif"],
        sans: ["var(--font-sans)", "Avenir Next", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        page: "1440px",
      },
      letterSpacing: {
        label: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
