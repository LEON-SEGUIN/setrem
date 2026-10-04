// Les 6 entrées de « Nos solutions » (préconditionneurs ajoutés le
// 4 octobre 2026 : c'était l'article PBR de « L'œil de l'expert »).
// Ces textes sortent en carte sur /nos-solutions ET en pied des quatre
// autres pages solutions : chacun est donc lu jusqu'à cinq fois. Ils ne
// reprennent pas le chapô de la page qu'ils annoncent - sinon le clic ne
// donne rien de neuf. Un fait concret par carte, tiré de la page cible.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/routes';

import extrudeurs from '../assets/img/3d-extrudeur-2x1.webp';
import preconditionneur from '../assets/img/preconditionneur.webp';
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
      alt: "Extrudeur SETREM en vue éclatée, la vis sortie du fourreau - modélisation 3D d'après les plans",
    },
    {
      slug: 'preconditionneurs',
      titre: 'Préconditionneurs',
      texte:
        "Monorotor ou birotor, de 25 à 1 758 litres : jusqu'à 3 minutes de rétention avant l'extrudeur.",
      image: preconditionneur,
      alt: 'Préconditionneur birotor SETREM, capot ouvert sur ses deux arbres',
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
      alt: 'SETREM extruder in exploded view, the screw out of the barrel - 3D model built from the drawings',
    },
    {
      slug: 'preconditioners',
      titre: 'Preconditioners',
      texte:
        'Single- or twin-rotor, from 25 to 1,758 litres: up to 3 minutes of retention before the extruder.',
      image: preconditionneur,
      alt: 'SETREM twin-rotor preconditioner, cover open on its two shafts',
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

// « Le reste de la ligne », au pied des pages équipement : les machines
// seulement (celles qui ont une image). Le tableau des capacités garde
// son lien sur /nos-solutions et sur la page extrudeurs.
export const autresSolutions = (slug: string, locale: Locale) =>
  solutions[locale].filter((s) => s.slug !== slug && s.image);
