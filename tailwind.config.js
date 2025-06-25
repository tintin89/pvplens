/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark fantasy theme inspired by WoW
        primary: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d6ff",
          300: "#a5b8ff",
          400: "#8292ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        wow: {
          // WoW specific colors
          alliance: "#0078FF",
          horde: "#DC143C",
          gold: "#FFD700",
          legendary: "#FF8000",
          epic: "#A335EE",
          rare: "#0070DD",
          uncommon: "#1EFF00",
          common: "#FFFFFF",
          poor: "#9D9D9D",
        },
        rating: {
          // PvP rating tiers
          gladiator: "#A335EE",
          elite: "#FF8000",
          duelist: "#0070DD",
          rival: "#1EFF00",
          challenger: "#FFD700",
          combatant: "#9D9D9D",
          unranked: "#666666",
        },
      },
      fontFamily: {
        // Fantasy/medieval fonts
        wow: ["'Cinzel'", "serif"],
        fantasy: ["'Metamorphous'", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "wow": "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
        "wow-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        "glow": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-lg": "0 0 40px rgba(99, 102, 241, 0.4)",
      },
    },
  },
};
