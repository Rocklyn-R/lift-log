/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        robotoMono: ['"Roboto Mono"', 'monospace'],
      },
      zIndex: {
        '45': '45',
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
        'phones-sm': {'min': '0px', max: '639px'},
        "xs-min": {'min': '450px'}, 
        xs: {'min': '450px', 'max': '639px'}, 
        'h-sm': { raw: '(max-height: 640px)' }, 
        'h-md': { raw: '(min-height: 641px)' }, 
        'h-lg': { raw: '(max-height: 700px)' }, 
        'xsh-sm': { raw: '(min-width: 300px) and (max-width: 639px) and (max-height: 700px)' },
      },
      spacing: {
        '028': '0.31rem',
        '3.5': '0.875rem',
        '1/5': '20%', 
        '1/6': '16.666667%', 
      }, 
    },
  },
  plugins: [],
};