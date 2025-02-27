/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to all template files in your src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        robotoMono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        darkestBlue: '#083757',
        darkBlue: '#115583',
        lightBlue: '#7CB3E9',
        lightestBlue: '#C7E3FF',
        darkestPurple: '#0c0121',
        darkPurple: '#282b54',
        lightPurple: '#BDBCDC',
        lightestPurple: '#ddddf7',
        mediumPurple: '#52517a',
        whitePurple: '#DDDAF3',
        whitestPurple: '#fffcff',
        darkest: '#0c0121',
      },
      screens: {
        'phones': {'min': '0px', max: '449px'},
        xs: {'min': '450px', 'max': '639px'}, // Custom xs breakpoint
        'h-sm': { raw: '(max-height: 640px)' }, // Small height screens
        'h-md': { raw: '(min-height: 641px)' }, // Medium height screens
        'h-lg': { raw: '(min-height: 769px)' }, // Large height screens // Add your desired breakpoint value here
      },
      spacing: {
        '028': '0.31rem',
        '3.5': '0.875rem',
        '1/5': '20%', // 1/5 of the container height or width
        '1/6': '16.666667%', // 1/6 of the container height or width
      }, // This is halfway between 0.75rem (3) and 1rem (4)
    },
  },
  plugins: [],
};