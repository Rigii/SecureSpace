/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        'button-black': '#252829',
        'dark-black': '#000000',
        'button-soft-black': '#292A2D',
        'background-black': '#1F1F1F',
        'side-menu-black': '#232425',
        'light-blue': '#00C6FF',
        'dark-blue': '#0072C5',
        'soft-blue': '#4688F1',
        'title-gray': '#9C9C9C',
        'dark-gray': '#717170',
        'background-gray': '#F3F3F3',
        'disabled-gray': '#E2E2E2',
        'input-error': '#FF6058',
        'input-success': 'text-green-500',
        'button-wite': '#FAFAFA',
        'input-black': '#2f303270',
        gold: '#FFD700',
      },
    },
  },
};
