import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./remotion/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Claude 차콜 + 따뜻한 오렌지 + 임베디드 미드나잇
        bg: { DEFAULT: "#0a0a0a", soft: "#141414", panel: "#1a1a1f" },
        ink: { DEFAULT: "#f5f5f5", soft: "#cfcfd4", muted: "#8e8e94" },
        accent: { DEFAULT: "#e4843c", soft: "#f2a268" },
        midnight: { DEFAULT: "#0d1b2a", soft: "#1b2a3a" },
        ok: "#5ae27c",
        warn: "#f2c14e",
        err: "#ff6b6b",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
