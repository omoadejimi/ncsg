import type { Config } from "tailwindcss";

/**
 * NCSG design tokens.
 *
 * Palette rationale: a deep forest green drawn from the Nigerian flag,
 * warmed neutrals rather than pure greys, and a single clay accent
 * reserved for "Don't" examples and warnings. Colour is used to encode
 * meaning (do/don't, note/warning), never decoration.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        green: {
          950: "#072A1D", // darkest — dark-mode surfaces
          900: "#0A3625", // primary brand green
          800: "#0F4A33",
          700: "#136041",
          600: "#15804E", // interactive green (links, buttons)
          500: "#1E9A60",
          100: "#D7EBDE",
          50: "#EDF6F0",
        },
        paper: {
          DEFAULT: "#FBFBF8", // warm near-white page background
          dark: "#0D1410", // dark-mode page background
        },
        ink: {
          DEFAULT: "#181D1A",
          soft: "#3E4742",
          mute: "#5E6862",
        },
        line: {
          DEFAULT: "#E2E5DF",
          dark: "#22302A",
        },
        clay: {
          700: "#9A3A18", // "Don't" / warning accent
          600: "#B4451F",
          50: "#FBF0EB",
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables in src/app/layout.tsx
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "46rem", // ~75ch measure for comfortable reading
      },
    },
  },
  plugins: [],
};

export default config;
