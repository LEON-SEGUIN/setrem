// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Chemins hors index : ni sitemap, ni valeur SEO
const horsSitemap = ['/contact/merci', '/news', '/les-ressources'];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.setrem.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !horsSitemap.some(
          (p) => pathname === p || pathname.startsWith(`${p}/`)
        );
      },
    }),
  ],
  // Plan de redirections — scrape/URLS.md. En statique, Astro génère des
  // pages <meta http-equiv="refresh"> : à doubler de vraies 301 côté
  // serveur quand l'hébergeur sera connu.
  redirects: {
    '/news': '/actualites',
    '/news/nouveau-site-internet': '/actualites',
    '/news/2026-a-new-year-taking-shape': '/actualites/2026-une-nouvelle-annee',
    '/news/eurotier-10-au-13-november-2026-a-hanovre':
      '/actualites/eurotier-2026-hanovre',
    '/les-ressources': '/ressources',
    '/les-ressources/pdfs': '/ressources',
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
