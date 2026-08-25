/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0B12",
        iris: "#141625",
        panel: "#1B1E30",
        line: "#2B2E45",
        aperture: "#6C5CE7",
        signal: "#3FE0C5",
        flare: "#F4A340",
        mist: "#9AA0C3",
        paper: "#EDEFFB",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "aperture-radial":
          "radial-gradient(circle at 50% 50%, rgba(108,92,231,0.35) 0%, rgba(63,224,197,0.08) 40%, rgba(10,11,18,0) 70%)",
      },
      keyframes: {
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 18s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
