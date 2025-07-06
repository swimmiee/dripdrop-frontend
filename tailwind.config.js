/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          light: "#F5E0C3",
          DEFAULT: "#4B2E1E",
          dark: "#A67B5B",
        },
        mint: "#3E8E7E",
      },
      animation: {
        "bounce-in": "bounce-in 0.6s ease-out",
        sparkle: "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        sparkle: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.1)",
          },
        },
      },
    },
  },
  plugins: [],
};
