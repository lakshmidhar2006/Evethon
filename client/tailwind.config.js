/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb', // Brand primary
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                dark: {
                    900: '#0f172a', // Main background
                    800: '#1e293b', // Card background
                    700: '#334155', // Border color
                }
            },
            animation: {
                'aurora': 'aurora 6s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                aurora: {
                    '0%, 100%': { backgroundPosition: '50% 50%, 50% 50%' },
                    '50%': { backgroundPosition: '100% 50%, 0% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
