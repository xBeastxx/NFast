/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f', // Deep space/ocean
                surface: '#12121e',
                primary: '#00f0ff', // Cyberpunk Blue/Neon
                secondary: '#00d0ff',
                accent: '#f000ff', // Neon Pink
            }
        },
    },
    plugins: [],
}
