// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://kataloggue.my.id',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  // Disable Astro's origin check - we're behind Caddy reverse proxy
  // CSRF protection provided by SameSite=Lax cookies + JWT auth
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
