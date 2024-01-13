import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {

      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
        'bebas-neue': ['"Bebas Neue"', 'sans-serif'],
      },
      gridTemplateRows: {
        '5' : 'repeat(5, minmax(0, 1fr))',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        signin: '#132839',
        main: '#ABDAE3',
        nav: '#06435C',
        accents: '#249CB4',
        lightQuartze: '#DCF3F0',
        button : '#004A57',
        back: '#1a1a1a',
        hardblue: '#0463CA',
        neonpink: '#FF69B4',
        blackpink: '#662555',
        lightblue: '#B0D6F5',
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  darkMode: "class",
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        '.noscrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.styled-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '0.4rem',
            height: '0.2rem',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
      };
      addUtilities(newUtilities);
    },
    nextui(),
    require("flowbite/plugin"),
  ],
}
export default config
