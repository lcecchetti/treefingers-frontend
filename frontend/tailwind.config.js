const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
      textColor: {
        // base font color
        base: 'var(--text-color-base)',
      },
      backgroundColor: {
        // document background color
        base: 'var(--bg-color-base)',
      },
      spacing: {
        xs: defaultTheme.spacing['1'],
        sm: defaultTheme.spacing['2'],
        md: defaultTheme.spacing['4'],
        lg: defaultTheme.spacing['6'],
        xl: defaultTheme.spacing['8'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
      textDecoration: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}