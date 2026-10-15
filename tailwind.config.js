/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EE',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C1A17',
          light: '#2E2B27',
          dark: '#11100E',
        },
        muted: {
          DEFAULT: '#6B645A',
          light: '#8F877A',
        },
        border: {
          DEFAULT: '#E8E0D2',
          light: '#F2EDE4',
        },
        gold: {
          DEFAULT: '#B8812E',
          hover: '#9E6D24',
          subtle: '#FDF7ED',
          border: '#ECD5AE',
        },
        placeholder: {
          DEFAULT: '#70685C',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 26, 23, 0.05), 0 2px 6px -1px rgba(28, 26, 23, 0.03)',
        'lift': '0 10px 25px -3px rgba(28, 26, 23, 0.08), 0 4px 10px -2px rgba(28, 26, 23, 0.04)',
      },
    },
  },
  plugins: [],
};
