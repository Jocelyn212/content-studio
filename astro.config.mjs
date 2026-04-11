// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});