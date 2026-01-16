/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dbs: {
                    red: "#E42313",
                    black: "#000000",
                    darkGrey: "#575756",
                    orange: "#F7AB59",
                    teal: "#009A93",
                }
            }
        },
    },
    plugins: [],
}
