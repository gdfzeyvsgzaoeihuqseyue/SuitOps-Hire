import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0284c7',
        secondary: '#075985',
        bgClr: '#e0f2fe',
        critique: '#ff0000'
      },
       fontFamily: {
        body: ['"Bree Serif"', 'sans-serif'],
        sans: ['Dosis', 'sans-serif'],
        heading: ['"Bree Serif"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config