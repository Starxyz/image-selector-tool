/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0078d4',
        warning: '#ff4444',
        success: '#00aa00',
        background: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
        }
      }
    },
  },
  plugins: [],
}
