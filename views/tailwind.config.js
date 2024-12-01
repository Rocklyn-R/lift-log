/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to all template files in your src folder
  ],
  theme: {
    extend: {
      colors: {
        darkestBlue: '#083757',
        darkBlue: '#115583',
        lightBlue: '#7CB3E9',
        lightestBlue: '#C7E3FF',
        darkestPurple: '#001247',
        darkPurple: '#2C2C64',
        lightPurple: '#BDBCDC',
        lightestPurple: '#ddddf7'

      },
    },
  },
  plugins: [],
};