// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Chemins hors index : ni sitemap, ni valeur SEO
// (Astro écarte /404 tout seul, mais pas son jumeau /en/404.)
const horsSitemap = [
  '/contact/merci',
  '/en/contact/thank-you',
  '/en/404',
  '/news',
  '/les-ressources',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.setrem.com',
  trailingSlash: 'never',
  // Le français reste à la racine : aucune URL existante ne bouge.
  // L'anglais vit sous /en. Les segments sont traduits, la table des
  // paires FR↔EN est dans src/i18n/routes.ts.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Les pages HTML (~15 Ko compressées) sont préchargées quand leurs
  // liens entrent à l'écran : la navigation paraît instantanée.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
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
  // Plan de redirections - scrape/URLS.md. En statique, Astro génère des
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
    // Tri des articles du 4 octobre 2026 (demande d'Arnaud Delique)
    '/loil-de-lexpert/traitement-des-matieres-premieres-soja':
      '/loil-de-lexpert/procede-de-traitement-de-la-graine-de-soja',
    '/loil-de-lexpert/nos-preconditionneurs-pbr':
      '/nos-solutions/preconditionneurs',
    '/en/expert-insights/raw-material-processing-soybean':
      '/en/expert-insights/soybean-processing-method',
    '/en/expert-insights/our-pbr-preconditioners':
      '/en/solutions/preconditioners',
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
