import type { Config } from "tailwindcss";

/**
 * Shared Nakka design tokens: a light theme set entirely in the browser's
 * Times serif. Apps add their own `content` globs.
 */
const SERIF = ["Times New Roman", "Times", "serif"];

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: "#006194",
        "on-primary": "#ffffff",
        "primary-container": "#007bb9",
        "on-primary-container": "#fdfcff",
        "primary-fixed": "#cce5ff",
        "primary-fixed-dim": "#93ccff",
        "on-primary-fixed": "#001d31",
        "on-primary-fixed-variant": "#004b73",
        "inverse-primary": "#93ccff",
        "surface-tint": "#006398",
        secondary: "#6b38d4",
        "on-secondary": "#ffffff",
        "secondary-container": "#8455ef",
        "on-secondary-container": "#fffbff",
        "secondary-fixed": "#e9ddff",
        "secondary-fixed-dim": "#d0bcff",
        "on-secondary-fixed": "#23005c",
        "on-secondary-fixed-variant": "#5516be",
        tertiary: "#006387",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#007da9",
        "on-tertiary-container": "#fcfcff",
        "tertiary-fixed": "#c4e7ff",
        "tertiary-fixed-dim": "#7bd0ff",
        "on-tertiary-fixed": "#001e2c",
        "on-tertiary-fixed-variant": "#004c69",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        background: "#faf8ff",
        "on-background": "#171b26",
        surface: "#faf8ff",
        "surface-dim": "#d7d9e8",
        "surface-bright": "#faf8ff",
        "surface-variant": "#dfe2f1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#ebedfc",
        "surface-container-high": "#e5e7f6",
        "surface-container-highest": "#dfe2f1",
        "on-surface": "#171b26",
        "on-surface-variant": "#3f4850",
        "inverse-surface": "#2c303b",
        "inverse-on-surface": "#eef0ff",
        outline: "#707881",
        "outline-variant": "#bfc7d2",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter-mobile": "1rem",
        gutter: "1.5rem",
        "margin-mobile": "1.25rem",
        margin: "3rem",
      },
      fontFamily: {
        sans: SERIF,
        mono: SERIF,
        "display-xl": SERIF,
        "display-xl-mobile": SERIF,
        "headline-lg": SERIF,
        "headline-lg-mobile": SERIF,
        "headline-md": SERIF,
        "headline-sm": SERIF,
        "body-lg": SERIF,
        "body-md": SERIF,
        "body-sm": SERIF,
        "label-md": SERIF,
        "label-sm": SERIF,
        "code-inline": SERIF,
      },
      fontSize: {
        "display-xl": [
          "56px",
          {
            lineHeight: "64px",
            letterSpacing: "-0.03em",
            fontWeight: "600",
          },
        ],
        "display-xl-mobile": [
          "38px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.025em",
            fontWeight: "600",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.02em",
            fontWeight: "600",
          },
        ],
        "headline-lg-mobile": [
          "26px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.015em",
            fontWeight: "600",
          },
        ],
        "headline-md": [
          "22px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.015em",
            fontWeight: "500",
          },
        ],
        "headline-sm": [
          "18px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
        "body-lg": [
          "16px",
          {
            lineHeight: "26px",
            letterSpacing: "-0.005em",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "14px",
          {
            lineHeight: "22px",
            letterSpacing: "0em",
            fontWeight: "400",
          },
        ],
        "body-sm": [
          "13px",
          {
            lineHeight: "18px",
            letterSpacing: "0.005em",
            fontWeight: "400",
          },
        ],
        "label-md": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.02em",
            fontWeight: "500",
          },
        ],
        "label-sm": [
          "11px",
          {
            lineHeight: "14px",
            letterSpacing: "0.04em",
            fontWeight: "500",
          },
        ],
        "code-inline": [
          "13px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.01em",
            fontWeight: "400",
          },
        ],
      },
    },
  },
};

export default preset;
