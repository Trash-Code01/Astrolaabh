/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#787C62', champagne: '#C5A259', pukhraj: '#F6D88A', sand: '#E8E1D5',
        ink: '#111317', 'warm-stone': '#CDBFAB', pearl: '#D9D9D6', mist: '#F2F2F1',
        forest: 'var(--sage-deep)', subdued: 'var(--ink-muted)',
        brand: {
          dark: '#111317',
          card: '#787C62',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#C5A259',
          neon: '#F6D88A',
          gold: '#C5A259',
          muted: '#D9D9D6',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Karma', 'sans-serif'],
        display: ['Manrope', 'Karma', 'sans-serif'],
        mono: ['Manrope', 'Karma', 'sans-serif'],
        serif: ['Manrope', 'Karma', 'sans-serif'],
        cinzel: ['Manrope', 'Karma', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 35s linear infinite',
      },
      letterSpacing: {
        tighter: '-0.05em',
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
