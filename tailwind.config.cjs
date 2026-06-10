// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(200, 80%, 50%)',
          50: 'hsl(200, 80%, 95%)',
          100: 'hsl(200, 80%, 90%)',
          200: 'hsl(200, 80%, 80%)',
          300: 'hsl(200, 80%, 70%)',
          400: 'hsl(200, 80%, 60%)',
          500: 'hsl(200, 80%, 50%)',
          600: 'hsl(200, 80%, 40%)',
          700: 'hsl(200, 80%, 30%)',
          800: 'hsl(200, 80%, 20%)',
          900: 'hsl(200, 80%, 10%)'
        },
        accent: {
          DEFAULT: 'hsl(45, 100%, 55%)',
          50: 'hsl(45, 100%, 95%)',
          100: 'hsl(45, 100%, 90%)',
          200: 'hsl(45, 100%, 80%)',
          300: 'hsl(45, 100%, 70%)',
          400: 'hsl(45, 100%, 60%)',
          500: 'hsl(45, 100%, 55%)',
          600: 'hsl(45, 100%, 45%)',
          700: 'hsl(45, 100%, 35%)',
          800: 'hsl(45, 100%, 25%)',
          900: 'hsl(45, 100%, 15%)'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }
    }
  },
  plugins: []
};
