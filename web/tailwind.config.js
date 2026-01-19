/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors (use CSS custom properties)
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'border-light': 'var(--color-border-light)',
        'border-medium': 'var(--color-border-medium)',

        // Accent colors (static, same in both modes)
        'solidarity-red': '#B11226',
        'earth-green': '#2F5D3A',
        'sun-yellow': '#E0B400',

        // Legacy support (for existing components)
        charcoal: '#1C1C1C',
        paper: '#FAF9F6',
        solidarity: '#B11226',
        earth: '#2F5D3A',
        sun: '#E0B400',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
