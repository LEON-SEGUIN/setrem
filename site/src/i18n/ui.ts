// Chaînes partagées par plusieurs composants (nav, pied de page, bandeau
// CTA, métadonnées). Les textes propres à une seule section vivent dans le
// composant qui les affiche, pas ici.
//
// Glossaire — à respecter dans toute la traduction anglaise :
//   cuisson-extrusion .............. extrusion cooking
//   extrudeur monovis .............. single-screw extruder
//   ligne complète ................. complete line
//   ligne pilote ................... pilot line
//   préconditionneur ............... preconditioner
//   fourreau ....................... barrel
//   vis (sans fin) ................. screw
//   filière ........................ die
//   trémie ......................... hopper
//   doseur ......................... feeder
//   sécheur / enrobeur ............. dryer / coater
//   facteurs antinutritionnels ..... antinutritional factors
//   gélatinisation de l'amidon ..... starch gelatinisation
//   protéines by-pass .............. bypass proteins
//   matières premières ............. raw materials
//   granulé ........................ pellet
//   débit .......................... throughput
//   mise en route .................. commissioning
//   aliments du bétail ............. livestock feed
//   petfood ........................ pet food

import { getAlternatePath, type Locale } from './routes';

export type { Locale };

export const localeAlternates: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

export const numberLocale: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

/** La locale courante, avec repli sur le français. */
export const toLocale = (value: string | undefined): Locale =>
  value === 'en' ? 'en' : 'fr';

export const ui = {
  fr: {
    nav: {
      aria: 'Navigation principale',
      accueil: 'SETREM — accueil',
      menu: 'Menu',
      liens: [
        { href: '/nos-solutions', label: 'Nos solutions' },
        { href: '/applications', label: 'Applications' },
        { href: '/la-ligne-pilote', label: 'La ligne pilote' },
        { href: '/loil-de-lexpert', label: "L'œil de l'expert" },
        { href: '/actualites', label: 'Actualités' },
      ],
      contact: { href: '/contact', label: 'Contactez-nous' },
      langue: { aria: 'Choix de la langue', autre: 'English', code: 'EN' },
    },
    footer: {
      tagline:
        "Constructeur d'extrudeurs monovis et de lignes complètes d'extrusion, pour l'alimentation humaine et animale.",
      planAria: 'Plan du site',
      siteHead: 'Le site',
      site: [
        { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
        { href: '/nos-solutions', label: 'Nos solutions' },
        { href: '/applications', label: 'Applications' },
        { href: '/la-ligne-pilote', label: 'La ligne pilote' },
        { href: '/loil-de-lexpert', label: "L'œil de l'expert" },
        { href: '/actualites', label: 'Actualités' },
        { href: '/ressources', label: 'Ressources' },
        { href: '/contact', label: 'Contact' },
      ],
      coordonneesHead: 'Coordonnées',
      pays: 'France',
      infosHead: 'Informations',
      infos: [
        { href: '/mentions-legales', label: 'Mentions légales' },
        { href: '/politique-de-cookies', label: 'Politique de cookies' },
        { href: '/conditions-generales', label: 'Conditions générales' },
      ],
      bas: 'SETREM — Acquigny, France',
    },
    cta: {
      titre: "Parlez-nous de votre projet d'extrusion.",
      texte:
        "Mise en route, conseil en formulation, stock de pièces détachées : l'équipe technique SETREM vous accompagne sur toute la vie de votre ligne.",
      bouton: 'Contactez-nous',
    },
    cards: { lire: 'Lire la suite' },
    jsonLd: {
      description:
        "Depuis 1986, SETREM conçoit et construit des lignes complètes d'extrusion pour l'alimentation humaine et animale.",
    },
  },

  en: {
    nav: {
      aria: 'Main navigation',
      accueil: 'SETREM — home',
      menu: 'Menu',
      liens: [
        { href: '/en/solutions', label: 'Our solutions' },
        { href: '/en/applications', label: 'Applications' },
        { href: '/en/pilot-line', label: 'Pilot line' },
        { href: '/en/expert-insights', label: 'Expert insights' },
        { href: '/en/news', label: 'News' },
      ],
      contact: { href: '/en/contact', label: 'Contact us' },
      langue: { aria: 'Language selection', autre: 'Français', code: 'FR' },
    },
    footer: {
      tagline:
        'Manufacturer of single-screw extruders and complete extrusion lines, for human and animal food.',
      planAria: 'Site map',
      siteHead: 'Site',
      site: [
        { href: '/en/about-us', label: 'About us' },
        { href: '/en/solutions', label: 'Our solutions' },
        { href: '/en/applications', label: 'Applications' },
        { href: '/en/pilot-line', label: 'Pilot line' },
        { href: '/en/expert-insights', label: 'Expert insights' },
        { href: '/en/news', label: 'News' },
        { href: '/en/resources', label: 'Resources' },
        { href: '/en/contact', label: 'Contact' },
      ],
      coordonneesHead: 'Contact details',
      pays: 'France',
      infosHead: 'Information',
      infos: [
        { href: '/en/legal-notice', label: 'Legal notice' },
        { href: '/en/cookie-policy', label: 'Cookie policy' },
        { href: '/en/terms-and-conditions', label: 'Terms and conditions' },
      ],
      bas: 'SETREM — Acquigny, France',
    },
    cta: {
      titre: 'Tell us about your extrusion project.',
      texte:
        'Commissioning, formulation advice, spare parts in stock: the SETREM technical team supports you throughout the life of your line.',
      bouton: 'Contact us',
    },
    cards: { lire: 'Read more' },
    jsonLd: {
      description:
        'Since 1986, SETREM has designed and built complete extrusion lines for human and animal food.',
    },
  },
} as const;

/** Coordonnées — identiques dans les deux langues, jamais traduites. */
export const contact = {
  tel: '+33 2 32 25 08 47',
  telHref: 'tel:+33232250847',
  fax: '+33 2 32 40 67 88',
  rue: '7 rue Robert Dumont',
  zone: 'ZI Les Pâtis',
  ville: '27400 Acquigny',
  linkedin: 'https://www.linkedin.com/company/setremextrusion',
};

export { getAlternatePath };
