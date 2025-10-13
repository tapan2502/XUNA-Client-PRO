// tailwind.config.js
import { heroui } from "@heroui/theme";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // REQUIRED so Tailwind sees HeroUI classes
  ],
  theme: { extend: {} },
  plugins: [heroui()], // REQUIRED so vars like --color-default-100 exist
};
