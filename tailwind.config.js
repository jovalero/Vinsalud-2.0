/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        medical: {
          primary: '#0284c7', // Sky-600
          secondary: '#0ea5e9', // Sky-500
          light: '#f0f9ff', // Sky-50
          dark: '#0f172a', // Slate-900
          accent: '#38bdf8', // Sky-400
          hover: '#0369a1', // Sky-700
          slate: '#475569', // Slate-600
        },
        bordo: '#1D2A44', 
        otroColor: 'rgb(128, 0, 32)', 
        otroColorHSL: 'hsl(350, 100%, 25%)',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  
};
