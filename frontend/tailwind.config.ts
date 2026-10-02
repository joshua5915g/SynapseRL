import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fff5f0",
          100: "#ffe8dc",
          500: "#ff4d00",
          600: "#ea3800",
          700: "#c72c00",
          900: "#450e00",
        },
        flame: {
          base: "#ff3d00",
          lit: "#ff8a1f",
          amber: "#f59e0b",
          gold: "#fbbf24",
          ground: "#120400",
          card: "#1a0803",
        },
        cyber: {
          cyan: "#ff8a1f",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#ff3d00",
          purple: "#ff6a00",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "'Inter Tight'", "Inter", "sans-serif"],
        italic: ["var(--font-italic)", "'Instrument Serif'", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 28px -5px rgba(255, 61, 0, 0.45)",
        "glow-flame": "0 0 35px -5px rgba(255, 61, 0, 0.5)",
        "glow-amber": "0 0 30px -5px rgba(255, 138, 31, 0.45)",
        "glow-cyan": "0 0 25px -5px rgba(255, 138, 31, 0.4)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
        "glow-subtle": "0 0 45px -10px rgba(255, 61, 0, 0.22)",
        "glass-inner": "inset 0 1px 0 rgba(255, 200, 160, 0.12)",
        "pill-glow": "0 14px 40px rgba(255, 61, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 8s linear infinite",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
