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
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}