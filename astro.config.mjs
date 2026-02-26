// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";

import vercel from "@astrojs/vercel";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      useCdn: false,
      apiVersion: "2024-01-01",
      studioBasePath: "/studio",
    }),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});