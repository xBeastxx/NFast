/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000', // Pure Black
                surface: '#001026', // Electric Navy Base
                primary: '#00f0ff', // Cyberpunk Blue/Neon
                secondary: '#00d0ff',
                accent: '#f000ff', // Neon Pink
            }
        },
    },
    plugins: [],
}
