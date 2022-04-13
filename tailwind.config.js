const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
        serif: ['"DM Serif Text"', ...defaultTheme.fontFamily.serif],
      },
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
        sm: defaultTheme.spacing['2'],
        md: defaultTheme.spacing['4'],
        lg: defaultTheme.spacing['6'],
        xl: defaultTheme.spacing['8'],
        '2xl': defaultTheme.spacing['16'],
        header: 'var(--header-height)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}