import type { Config } from "tailwindcss";
import preset from "@nakka/tailwind-config";

export default {
  presets: [preset],
  content: ["./index.html", "./code.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
