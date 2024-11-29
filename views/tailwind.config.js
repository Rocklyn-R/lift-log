/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to all template files in your src folder
  ],
  theme: {
    extend: {
      colors: {
        darkestBlue: '#083757',
        darkBlue: '#0A456E',
        lightestBlue: '#C7E3FF',
      },
    },
  },
  plugins: [],
};