// Paires FR↔EN de chaque page. Les segments d'URL sont traduits : on ne
// peut donc pas déduire l'adresse anglaise en préfixant « /en ». Cette
// table est la source unique - sélecteur de langue et hreflang en
// dépendent tous les deux.

export type Locale = 'fr' | 'en';

export const routePairs: readonly (readonly [fr: string, en: string])[] = [
  ['/', '/en'],

  ['/nos-solutions', '/en/solutions'],
  ['/nos-solutions/extrudeurs', '/en/solutions/extruders'],
  ['/nos-solutions/secheurs', '/en/solutions/dryers'],
  ['/nos-solutions/enrobeurs', '/en/solutions/coaters'],
  ['/nos-solutions/automatisme', '/en/solutions/automation'],
  [
    '/nos-solutions/tableau-des-capacites-des-equipements',
    '/en/solutions/equipment-capacity-chart',
  ],

  ['/applications', '/en/applications'],
  ['/applications/animaux-domestiques', '/en/applications/pet-food'],
  ['/applications/aquaculture', '/en/applications/aquaculture'],
  ['/applications/alimentation-humaine', '/en/applications/human-food'],
  ['/applications/betail', '/en/applications/livestock'],

  ['/la-ligne-pilote', '/en/pilot-line'],
  ['/qui-sommes-nous', '/en/about-us'],

  ['/loil-de-lexpert', '/en/expert-insights'],
  [
    '/loil-de-lexpert/les-farines-dinsectes-avenir-de-la-nutrition-animale',
    '/en/expert-insights/insect-meal-future-of-animal-nutrition',
  ],
  [
    '/loil-de-lexpert/fabrication-de-farines-infantiles-par-cuisson-extrusion',
    '/en/expert-insights/infant-flour-production-by-extrusion-cooking',
  ],
  [
    '/loil-de-lexpert/procede-de-traitement-de-la-graine-de-soja',
    '/en/expert-insights/soybean-processing-method',
  ],
  [
    '/loil-de-lexpert/traitement-des-matieres-premieres-soja',
    '/en/expert-insights/raw-material-processing-soybean',
  ],
  [
    '/loil-de-lexpert/traitement-des-matieres-premieres-cereales',
    '/en/expert-insights/raw-material-processing-cereals',
  ],
  [
    '/loil-de-lexpert/lextrudeur-un-outil-incomparable-pour-la-production-animale',
    '/en/expert-insights/the-extruder-an-unmatched-tool-for-livestock-production',
  ],
  [
    '/loil-de-lexpert/nos-preconditionneurs-pbr',
    '/en/expert-insights/our-pbr-preconditioners',
  ],
  [
    '/loil-de-lexpert/reactions-de-maillard',
    '/en/expert-insights/maillard-reactions',
  ],
  [
    '/loil-de-lexpert/atouts-du-soja-extrude-pour-les-animaux-delevage',
    '/en/expert-insights/benefits-of-extruded-soybean-for-livestock',
  ],

  ['/actualites', '/en/news'],
  [
    '/actualites/2026-une-nouvelle-annee',
    '/en/news/2026-a-new-year-taking-shape',
  ],
  ['/actualites/eurotier-2026-hanovre', '/en/news/eurotier-2026-hanover'],

  ['/contact', '/en/contact'],
  ['/contact/merci', '/en/contact/thank-you'],
  ['/ressources', '/en/resources'],

  ['/mentions-legales', '/en/legal-notice'],
  ['/conditions-generales', '/en/terms-and-conditions'],
  ['/politique-de-cookies', '/en/cookie-policy'],

  ['/404', '/en/404'],
];

/**
 * L'équivalent d'un chemin dans l'autre langue, ou undefined si la page
 * n'a pas de jumelle (le sélecteur de langue retombe alors sur l'accueil).
 */
export function getAlternatePath(
  path: string,
  target: Locale
): string | undefined {
  const source = target === 'en' ? 0 : 1;
  const pair = routePairs.find((p) => p[source] === path);
  return pair?.[target === 'en' ? 1 : 0];
}
