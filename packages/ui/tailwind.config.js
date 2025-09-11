/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    presets: [require('../config/tailwind-preset.js')],
    theme: {
        extend: {},
    },
    plugins: [require('tailwindcss-animate')],
};
