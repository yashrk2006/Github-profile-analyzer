/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'gradient-x': 'gradient-x 3s ease infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
                orbit: {
                    "0%": {
                        transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
                    },
                },
            },
            animation: {
                'gradient-x': 'gradient-x 3s ease infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                orbit: "orbit calc(var(--duration)*1s) linear infinite",
            },
        },
    },
    plugins: [],
}
