module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class',
  theme: {
    colors: {
      // utility colors
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFF',
      black: '#000',
      gray: '#9CA3AF',

      // custom colors
      primary: {
        light: 'var(--color-primary-light)',
        DEFAULT: 'var(--color-primary)',
        dark: 'var(--color-primary-dark)',
        contrast: 'var(--color-primary-contrast)',
      },
      secondary: {
        light: 'var(--color-secondary-light)',
        DEFAULT: 'var(--color-secondary)',
        dark: 'var(--color-secondary-dark)',
        constrast: 'var(--color-secondary-contrast)',
      },
      error: '#B91C1C',
    },

    // custom spacing
    spacing: {
      0: 0,
      px: '1px',
      1: '0.25rem',
      2: '0.50rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
    },
    extend: {
      textColor: {
        // base font color
        base: 'var(--text-color-base)',
      },
      backgroundColor: {
        // document background color
        base: 'var(--bg-color-base)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}