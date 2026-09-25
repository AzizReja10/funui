/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        fg: "var(--fg)",
        muted: "var(--fg-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
        },
        neon: {
          lime: "#D4F73C",
          magenta: "#FF2E93",
          blue: "#0066FF",
          cyan: "#00F0FF",
          amber: "#F59E0B",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-lime": "0 0 25px -5px rgba(212, 247, 60, 0.35)",
        "glow-magenta": "0 0 25px -5px rgba(255, 46, 147, 0.35)",
        "glow-blue": "0 0 25px -5px rgba(0, 102, 255, 0.35)",
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};