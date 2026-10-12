import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

/*
 * "Bold Utility" tokens. Tailwind v4 primarily consumes design tokens through the @theme block in
 * globals.css. This config keeps the plugin surface (HeroUI, dark-mode class)
 * and exposes the same tokens for any consumer that still expects them via
 * `theme.extend.colors`.
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-barlow)", "Barlow", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-barlow-condensed)", "Barlow Condensed", "Arial Narrow", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      maxWidth: {
        container: "1360px",
        narrow: "1080px",
        wide: "1480px",
      },
      colors: {
        surface: {
          DEFAULT: "var(--color-bg)",
          1: "var(--color-bg-secondary)",
          2: "var(--color-bg-tertiary)",
          warm: "var(--color-bg-warm)",
          dark: "var(--color-surface-dark)",
        },
        ink: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-secondary)",
          subtle: "var(--color-text-tertiary)",
        },
        brand: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          soft: "var(--color-accent-light)",
          ink: "var(--color-accent-ink)",
          2: "var(--color-accent-2)",
        },
        link: "var(--color-accent-2)",
        sale: "var(--color-accent-3)",
        line: {
          DEFAULT: "var(--color-border)",
          hover: "var(--color-border-hover)",
          strong: "var(--color-border-strong)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        accent: "var(--shadow-accent)",
        hard: "var(--shadow-lg)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [heroui()],
};

export default config;
