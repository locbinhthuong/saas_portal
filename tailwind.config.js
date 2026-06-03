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
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
          950: '#172554',
        },
        dark: {
          900: '#020617',
          800: '#0f172a',
          700: '#1e293b',
        },
        neon: {
          cyan: '#06b6d4',
          fuchsia: '#d946ef',
          violet: '#8b5cf6',
        }
      },
      boxShadow: {
        '3d': '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
        '3d-hover': '0 30px 60px -15px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.3)',
        'neon-cyan': '0 0 15px 2px rgba(6, 182, 212, 0.4)',
        'neon-violet': '0 0 15px 2px rgba(139, 92, 246, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
