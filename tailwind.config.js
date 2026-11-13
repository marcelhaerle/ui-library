/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0px',
      DEFAULT: '0px',
    },
    extend: {
      colors: {
        blue: {
          900: 'oklch(37.9% 0.146 265.522)',
        },
        emerald: {
          800: 'oklch(43.2% 0.095 166.913)',
        },
        ci: {
          primary: 'oklch(37.9% 0.146 265.522)',
          secondary: 'oklch(43.2% 0.095 166.913)',
        },
      },
    },
  },
  plugins: [],
};
