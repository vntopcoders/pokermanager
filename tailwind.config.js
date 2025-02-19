/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'profit-green': '#10B981',
          'loss-red': '#EF4444',
        }
      },
    },
    plugins: [],
  }