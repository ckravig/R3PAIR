/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

// create default values
const screenKeys = Array.from({length: 20}, (_, i) => i*5)
const screenSizes = screenKeys.reduce((v, key) => Object.assign(v, {[key]: key}), {});


module.exports = {
  content: [
    "./*.html",
    "./js/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({matchUtilities, theme}) {
      matchUtilities(
        {
          'w-screen': width => ({
            width: `${width}vw`
          })
        },
        { values: Object.assign(screenSizes, theme('screenSize', {})) }
      ),
      matchUtilities(
        {
          'h-screen': height => ({
            height: `${height}vh`
          })
        },
        { values: Object.assign(screenSizes, theme('screenSize', {})) }
      )
    })
  ],
}

