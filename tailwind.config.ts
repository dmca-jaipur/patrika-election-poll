import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'patrika-maroon': '#800000',
        'patrika-navy': '#1A237E',
        'patrika-cream': '#FDFCF0',
        'patrika-gold': '#D4AF37',
      },
    },
  },
  plugins: [],
};
export default config;
