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
          DEFAULT: 'var(--color-primary)',
          contrast: 'var(--color-primary-contrast)',
        },
        error: 'var(--color-error)',
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
        sm: defaultTheme.spacing['2.5'],
        md: defaultTheme.spacing['5'],
        lg: defaultTheme.spacing['7'],
        xl: defaultTheme.spacing['10'],
        header: '76px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['active', 'disabled'],
      textDecoration: ['disabled'],
      animation: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}