import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        alpine: {
          950: '#020617',
          900: '#0b1329',
          850: '#111d3d',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        temple: {
          saffron: '#ff7700',
          gold: '#eab308',
          marigold: '#f59e0b',
        },
        duoA: {
          son: '#2563eb', // Royal Blue (Utkarsh)
          elder: '#dc2626', // Crimson Red (Rajnish Ji)
        },
        duoB: {
          son: '#16a34a', // Forest Green (Cousin)
          elder: '#d97706', // Warm Amber (Uncle Ji)
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      boxShadow: {
        'mobile-dock': '0 -4px 20px -2px rgba(0, 0, 0, 0.5), 0 -2px 6px -1px rgba(0, 0, 0, 0.4)',
        'glow-temple': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
} satisfies Config;
