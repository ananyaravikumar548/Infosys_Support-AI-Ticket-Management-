/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4F46E5',
          purple: '#6366F1',
          gradientStart: '#3B82F6',
          gradientEnd: '#4F46E5',
        },
        admin: {
          dark: '#064E3B',
          header: '#047857',
          sidebar: '#022C22',
          active: '#059669',
        },
        status: {
          highBg: '#FEE2E2',
          highText: '#EF4444',
          mediumBg: '#FEF3C7',
          mediumText: '#F59E0B',
          lowBg: '#D1FAE5',
          lowText: '#10B981',
          inProgressBg: '#E0E7FF',
          inProgressText: '#4F46E5',
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}