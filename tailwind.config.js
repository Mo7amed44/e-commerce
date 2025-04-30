/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js" 
  ],
  theme: {
    extend: {
      keyframes: {
        pulseV: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.85' },
        },
      },
      animation: {
        pulseV: 'pulseV 1.8s ease-in-out infinite',
      },
    },
    container:{
      center:true,
    }
  },
  plugins: [ require('flowbite/plugin')],
}


