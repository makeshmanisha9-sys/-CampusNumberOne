/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: {
            900: '#070D1E',
            800: '#0B132B',
            700: '#1C2541',
            600: '#26345A',
            500: '#3A506B',
          },
          blue: {
            DEFAULT: '#2563EB',
            light: '#3B82F6',
            dark: '#1D4ED8',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            light: '#38BDF8',
            dark: '#0891B2',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'blue-glow': '0 0 25px -4px rgba(37, 99, 235, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'campus-mesh': 'radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(37, 99, 235, 0.12) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
