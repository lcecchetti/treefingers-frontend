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
        gray: 'var(--color-gray)',
        red: 'var(--color-red)',
        // custom colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          contrast: 'var(--color-primary-contrast)',
          foreground: 'var(--color-primary-contrast)',
        },
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        // shadcn tokens
        background: 'var(--bg-color-base)',
        foreground: 'var(--text-color-base)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
    require('tailwindcss-animate'),
  ],
}
