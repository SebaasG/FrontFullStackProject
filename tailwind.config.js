/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          electric: '#00F5FF',
          deep: '#0A0E27',
        },
        accent: {
          orange: '#FF6B35',
          green: '#39FF14',
          purple: '#B537F2',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F5FF 0%, #B537F2 100%)',
        'gradient-surface': 'linear-gradient(145deg, rgba(10, 14, 39, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'neon': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-orange': '0 0 20px rgba(255, 107, 53, 0.5)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-neon': {
          '0%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 245, 255, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};