import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textShadow: {
        "blue-h2": "15px 15px 4px #031CA6", // Custom shadow for h1 and h2
        "subtle": "1px 1px 2px rgba(0, 0, 0, 0.1)", // Light shadow
        "strong": "3px 3px 5px rgba(0, 0, 0, 0.3)", // Strong shadow
      },
      dropShadow: {
        "action-button": "15px 15px 4px #031CA6", // Shadow for action buttons
      },
      colors: {
        "deep-blue": "#010326", // Background color
        "light-gray": "#D9D9D9", // Main text color
        "shadow-blue": "#031CA6", // Drop shadow for h1 and h2
        "progress-green": "#3DD973", // Progress color
        "pure-white": "#FFFFFF", // White color
        "black": "#000000", // Black color
        "dark-gray": "#18181B", // Dark gray color
        "navy-blue": "#010440", // Navy blue color
        "green-variant": "#3F3F46", // Variant green color
        "red-alert": "#FF0202", // Alert red color
        "blue-opacity": "rgba(3, 28, 166, 0.58)", // 58% opacity blue
        "green-opacity": "rgba(61, 221, 115, 0.3)", // 30% opacity green
        "light-gray-opacity": "rgba(217, 217, 217, 0.2)", // 20% opacity light gray
        "light-gray-opacity-2": "rgba(217, 217, 217, 0.3)", // 20% opacity light gray
        "dark-gray-opacity": "rgba(217, 217, 217, 0.2)", // 20% opacity dark gray
        "blue-light": "#3F3F46", // Light variant for additional styles
        "dark-blue": "#010440", // Variant of navy blue
        "green-light": "#3DD973", // Lighter green for variations
        "green-light-opacity": "rgba(61, 217, 115, 0.58)", // 30% opacity light green
        "blue-dark": "#031CA6", // Darker shade of blue for variants
        "black-opacity": "rgba(0, 0, 0, 0.46)", // 46% opacity black
        "deep-blue-opacity": "rgba(1, 4, 64, 0.45)",// 58% opacity deep blue
        "deep-blue-opacity-2": "rgba(1, 4, 64, 0.90)"// 58% opacity deep blue
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};

export default config;
