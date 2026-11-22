/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",       // Royal Sapphire Blue
          sapphire: "#1D4ED8",   // Deep Sapphire
          cobalt: "#3B82F6",     // Electric Cobalt
          ice: "#60A5FA",        // Ice Blue Highlight
          dark: "#060913",       // Midnight Obsidian Canvas
          card: "#0F172A",       // Rich Sapphire Slate Card
          cardBorder: "rgba(59, 130, 246, 0.25)",
          heading: "#1E3A8A",
          slate: "#131F37",
        },
        dark: {
          950: "#060913", // Midnight Obsidian Studio
          900: "#0A0F1D", // Deep Studio Navy
          850: "#0F172A", // Sapphire Card Background
          800: "#1E293B", // Border
          750: "#27354E",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
        },
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#0A1733",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #3B82F6 100%)",
        "brand-gradient-hover": "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #60A5FA 100%)",
        "blue-card": "linear-gradient(180deg, #0F172A 0%, #0A0F1D 100%)",
        "glow-blue": "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.25) 0%, transparent 70%)",
      },
      boxShadow: {
        "blue-glow": "0 0 25px -5px rgba(59, 130, 246, 0.45)",
        "sapphire-glow": "0 0 30px -5px rgba(37, 99, 235, 0.5)",
        "subtle-card": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      fontFamily: {
        sans: ["'Prompt'", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
