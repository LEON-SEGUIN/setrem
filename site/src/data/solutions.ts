// Les 5 entrées de « Nos solutions ».
// Ces textes sortent en carte sur /nos-solutions ET en pied des quatre
// autres pages solutions : chacun est donc lu jusqu'à cinq fois. Ils ne
// reprennent pas le chapô de la page qu'ils annoncent - sinon le clic ne
// donne rien de neuf. Un fait concret par carte, tiré de la page cible.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/routes';

import extrudeurs from '../assets/img/extrudeurs-solutions.webp';
import secheur from '../assets/img/secheur.webp';
import enrobage from '../assets/img/enrobage.webp';
import automatisme from '../assets/img/ecran-automatisme.webp';

export interface Solution {
  slug: string;
  titre: string;
  texte: string;
  image?: ImageMetadata;
  alt?: string;
}

export const solutions: Record<Locale, Solution[]> = {
  fr: [
    {
      slug: 'extrudeurs',
      titre: 'Extrudeurs',
      texte:
        'Six modèles monovis, de 22 à 250 kW, adaptés au process à sec comme au semi-humide.',
      image: extrudeurs,
      alt: 'Extrudeurs monovis SETREM en atelier',
    },
    {
      slug: 'secheurs',
      titre: 'Sécheurs',
      texte:
        "Lit fluidisé vibré ou contre-courant, selon le produit et l'eau à évaporer.",
      image: secheur,
      alt: 'Sécheur industriel SETREM',
    },
    {
      slug: 'enrobeurs',
      titre: 'Enrobeurs',
      texte:
        "Jusqu'à 12 % de matière grasse en enrobage atmosphérique, ou une poudre pour l'appétence.",
      image: enrobage,
      alt: 'Enrobage de produits extrudés',
    },
    {
      slug: 'automatisme',
      titre: 'Automatisme',
      texte:
        "Séquences de démarrage et d'arrêt de l'extrudeur, contrôle total pendant la production.",
      image: automatisme,
      alt: 'Écran de conduite de production SETREM',
    },
    {
      slug: 'tableau-des-capacites-des-equipements',
      titre: 'Tableau des capacités',
      texte:
        'Les capacités des six extrudeurs, modèle par modèle et application par application.',
    },
  ],

  en: [
    {
      slug: 'extruders',
      titre: 'Extruders',
      texte:
        'Six single-screw models, from 22 to 250 kW, suited to dry as well as semi-wet processing.',
      image: extrudeurs,
      alt: 'SETREM single-screw extruders in the workshop',
    },
    {
      slug: 'dryers',
      titre: 'Dryers',
      texte:
        'Vibrating fluidised bed or counterflow, depending on the product and the water to be evaporated.',
      image: secheur,
      alt: 'SETREM industrial dryer',
    },
    {
      slug: 'coaters',
      titre: 'Coaters',
      texte:
        'Up to 12% fat in atmospheric coating, or a powder for palatability.',
      image: enrobage,
      alt: 'Coating of extruded products',
    },
    {
      slug: 'automation',
      titre: 'Automation',
      texte:
        'Extruder start-up and shutdown sequences, full control throughout production.',
      image: automatisme,
      alt: 'SETREM production control screen',
    },
    {
      slug: 'equipment-capacity-chart',
      titre: 'Capacity chart',
      texte:
        'The capacities of the six extruders, model by model and application by application.',
    },
  ],
};

export const autresSolutions = (slug: string, locale: Locale) =>
  solutions[locale].filter((s) => s.slug !== slug);
