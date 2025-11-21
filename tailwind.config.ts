import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // Green
        status: {
          done: '#22c55e', // Green
          ongoing: '#f97316', // Orange
          notDone: '#ef4444', // Red
        },
        background: '#ffffff', // White
      },
    },
  },
  plugins: [],
};
export default config;
