// hero.ts — Tailwind v4 CSS-first “config”
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

export default {
  // you can keep this empty because we'll declare @source in CSS
  plugins: [heroui()],
} satisfies Config;
