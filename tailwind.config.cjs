/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#32393C', // Slate Grey background
                surface: '#111213', // Deep Tactical Card (Darker)
                primary: '#00f0ff', // Cyberpunk Blue/Neon
                secondary: '#00d0ff',
                accent: '#f000ff', // Neon Pink
            }
        },
    },
    plugins: [],
}
