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
        temple: {
          gold: "#D4A843",
          "gold-light": "#F0DCA0",
          red: "#C41E3A",
          "red-dark": "#8B1425",
          saffron: "#FF6600",
          cream: "#FFF8E7",
          maroon: "#5C0A1E",
        },
      },
      fontFamily: {
        heading: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
