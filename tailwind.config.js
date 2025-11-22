/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00f3ff',
          secondary: '#bc13fe',
          bg: '#050511',
          panel: 'rgba(255, 255, 255, 0.05)',
        }
      }
    },
  },
  plugins: [],
}
