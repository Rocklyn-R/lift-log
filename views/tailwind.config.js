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
        lightestPurple: '#ddddf7',
        mediumPurple: '#454399',
        whitePurple: '#DDDAF3'
      },
      spacing: {
        '3.5': '0.875rem',
          '1/5': '20%', // 1/5 of the container height or width
          '1/6': '16.666667%', // 1/6 of the container height or width
        }, // This is halfway between 0.75rem (3) and 1rem (4)
    },
  },
  plugins: [],
};