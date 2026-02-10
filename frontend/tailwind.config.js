/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#0a1929', // PHASE 1: Deeper background
        },
        aurora: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          blue: '#3B82F6',
          cyan: '#06B6D4', // PHASE 1: Additional accent
          emerald: '#10B981', // PHASE 1: Success color
        }
      },
      boxShadow: {
        // PHASE 1: Glow shadows for enhanced hover states
        'glow-sm': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-md': '0 0 40px rgba(14, 165, 233, 0.4)',
        'glow-lg': '0 0 60px rgba(14, 165, 233, 0.5)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-base': 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite', // PHASE 2: Loading shimmer
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite', // PHASE 3: Pulsing glow
        'border-spin': 'border-spin 7s linear infinite',
        'text-shine': 'text-shine 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'border-spin': {
          '100%': { transform: 'rotate(-360deg)' },
        },
        'text-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
