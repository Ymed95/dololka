/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6ecee',
                    100: '#ccdadc',
                    200: '#99b5b9',
                    300: '#669097',
                    400: '#336b74',
                    500: '#03363e',  // Couleur principale Dololka
                    600: '#032b32',
                    700: '#022025',
                    800: '#011519',
                    900: '#010b0c',
                },
                secondary: {
                    50: '#fffbfa',
                    100: '#fff7f4',
                    200: '#ffefe9',
                    300: '#ffe7de',
                    400: '#ffd5c9',
                    500: '#fec3b4',  // Couleur accent Dololka
                    600: '#fe9c79',
                    700: '#fd7444',
                    800: '#fc4d0f',
                    900: '#c83e0c',
                },
            },
            fontFamily: {
                'sans': ['Work Sans', 'ui-sans-serif', 'system-ui'],
                'heading': ['Encode Sans', 'ui-sans-serif', 'system-ui'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'bounce-soft': 'bounceSoft 0.6s ease-in-out',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(3, 54, 62, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(254, 155, 121, 0.4)' },
                },
            },
        },
    },
    plugins: [],
}
