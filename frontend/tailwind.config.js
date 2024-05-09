/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./src/subframe/tailwind.config.js")],
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', 
    "./src/subframe/**/*.{js,ts, isx, tsx}", 
    // "./src/components/**/*.{tsx,ts,js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')]
};

