/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          light: '#F5E0C3',
          DEFAULT: '#4B2E1E',
          dark: '#A67B5B'
        },
        mint: '#3E8E7E'
      }
    }
  },
  plugins: []
};
