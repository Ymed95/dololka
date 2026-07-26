/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Teal vibrant et saturé — identité de marque modernisée
                primary: {
                    50: '#ecfdfb',
                    100: '#cef9f3',
                    200: '#9bf1e7',
                    300: '#5fe1d4',
                    400: '#2bc5b8',
                    500: '#0fa89c',
                    600: '#08867e',
                    700: '#0a6a65',
                    800: '#0c5450',
                    900: '#0a3d3b',
                },
                // Corail/orange punchy pour les accents chauds
                secondary: {
                    50: '#fff4f0',
                    100: '#ffe5db',
                    200: '#ffc7b3',
                    300: '#ffa183',
                    400: '#ff7449',
                    500: '#ff5722',
                    600: '#ed3d05',
                    700: '#c52f06',
                    800: '#9c280c',
                    900: '#7e240e',
                },
                // Accent violet électrique pour les pops de contraste modernes
                accent: {
                    50: '#f3f1ff',
                    100: '#e9e5ff',
                    200: '#d5cdff',
                    300: '#b6a6ff',
                    400: '#9474ff',
                    500: '#7c46ff',
                    600: '#6d28f5',
                    700: '#5b1ce0',
                    800: '#4a18b8',
                    900: '#3d1796',
                },
            },
            fontFamily: {
                // Variables CSS définies par next/font dans app/layout.tsx
                sans: ['var(--font-sans)', 'Work Sans', 'system-ui', 'sans-serif'],
                heading: ['var(--font-heading)', 'Encode Sans', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'bounce-soft': 'bounceSoft 0.6s ease-in-out',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2.5s linear infinite',
                'pop': 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'gradient': 'gradient 6s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(15, 168, 156, 0.3)' },
                    '100%': { boxShadow: '0 0 34px rgba(255, 87, 34, 0.55)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pop: {
                    '0%': { transform: 'scale(0.9)' },
                    '60%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundSize: {
                '200': '200% 200%',
            },
        },
    },
    plugins: [],
}
