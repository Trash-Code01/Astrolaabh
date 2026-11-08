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
          dark: '#08080a',
          card: '#121217',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#00f0ff',
          neon: '#ff0055',
          gold: '#e0b571',
          muted: '#8e8e99',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Syncopate', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
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
