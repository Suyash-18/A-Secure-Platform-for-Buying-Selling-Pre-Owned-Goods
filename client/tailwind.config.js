/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.4s ease-out',
        'fill-bar': 'fillBar 4s linear forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(150%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fillBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
}

  
