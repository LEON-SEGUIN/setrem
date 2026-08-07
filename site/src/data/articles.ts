// Les 9 articles « L'œil de l'expert » — scrape/pages/loil-de-lexpert*.md.
// Titres, extraits et descriptions repris du site actuel : rien d'inventé.
import type { ImageMetadata } from 'astro';

import insectes from '../assets/img/article-insectes.webp';
import farines from '../assets/img/article-farines-infantiles.webp';
import graineSoja from '../assets/img/article-graine-soja.webp';
import soja from '../assets/img/article-soja.webp';
import cereales from '../assets/img/article-cereales.webp';
import elevage from '../assets/img/article-elevage.webp';
import preconditionneur from '../assets/img/preconditionneur.webp';
import maillard from '../assets/img/article-maillard.webp';
import sojaElevage from '../assets/img/article-soja-elevage.webp';

export interface Article {
  slug: string;
  titre: string;
  extrait: string;
  description: string;
  image: ImageMetadata;
  alt: string;
}

export const articles: Article[] = [
  {
    slug: 'les-farines-dinsectes-avenir-de-la-nutrition-animale',
    titre: "Les farines d'insectes, avenir de la nutrition animale ?",
    extrait:
      "D'après la FAO nous serons 9 milliards d'êtres humains sur terre d'ici 2050.",
    description:
      "Riches en protéines et hautement digestibles, les farines d'insectes sont une alternative aux farines animales. Enjeux, freins réglementaires, essais en extrusion.",
    image: insectes,
    alt: 'Insectes destinés à la production de farines',
  },
  {
    slug: 'fabrication-de-farines-infantiles-par-cuisson-extrusion',
    titre: 'Fabrication de farines infantiles par cuisson-extrusion',
    extrait:
      'Intérêts des farines précuites par rapport aux farines natives et procédés de fabrication.',
    description:
      "Pourquoi les farines infantiles précuites s'imposent face aux farines natives : ligne de fabrication, maîtrise du procédé, applications en aide alimentaire.",
    image: farines,
    alt: "Bol de flocons d'avoine",
  },
  {
    slug: 'procede-de-traitement-de-la-graine-de-soja',
    titre: 'Procédé de traitement de la graine de soja',
    extrait:
      'La graine de soja contient entre 18 et 20 % de matière grasse et entre 35 et 38 % de protéines — mais aussi de nombreux facteurs antinutritionnels.',
    description:
      "Extrusion à sec puis pressage mécanique : le procédé complet de traitement de la graine de soja, avec bilans matières et étude économique.",
    image: graineSoja,
    alt: 'Graines de soja en gros plan',
  },
  {
    slug: 'traitement-des-matieres-premieres-soja',
    titre: 'Traitement des matières premières : soja',
    extrait:
      'Sans traitement thermique préalable, la valeur nutritive et la digestibilité des protéines du soja cru sont relativement faibles.',
    description:
      "Comment l'extrusion réduit les facteurs antinutritionnels du soja cru sans endommager les protéines, pour un aliment plus énergétique et plus stable.",
    image: soja,
    alt: 'Graines de soja',
  },
  {
    slug: 'traitement-des-matieres-premieres-cereales',
    titre: 'Traitement des matières premières : céréales',
    extrait:
      "Les hautes températures et les fortes pressions mises en œuvre dans le fût de l'extrudeur détruisent les microbes, la plupart des spores de moisissures et les œufs d'insectes.",
    description:
      "Gélatinisation de l'amidon, insolubilisation des protéines, destruction des facteurs antinutritionnels : le traitement des céréales par cuisson-extrusion.",
    image: cereales,
    alt: 'Épis de céréales',
  },
  {
    slug: 'lextrudeur-un-outil-incomparable-pour-la-production-animale',
    titre: "L'extrudeur : un outil incomparable pour la production animale",
    extrait:
      "L'élevage intensif doit maintenant satisfaire les nouvelles exigences des consommateurs, notamment sur la valeur nutritionnelle des aliments.",
    description:
      "Traitement HT-ST des graines oléagineuses, aliments ruminants haute production, petfood, aliments crevettes : les applications de l'extrusion en élevage.",
    image: elevage,
    alt: "Animaux d'élevage",
  },
  {
    slug: 'nos-preconditionneurs-pbr',
    titre: 'Nos préconditionneurs PBR',
    extrait:
      'La famille des préconditionneurs SETREM se décline selon deux catégories, les monorotors et les birotors.',
    description:
      'Monorotor ou birotor : hydratation, temps de rétention, injection eau, vapeur et slurrys — la gamme des préconditionneurs PBR de 25 à 1 758 litres.',
    image: preconditionneur,
    alt: 'Préconditionneur SETREM',
  },
  {
    slug: 'reactions-de-maillard',
    titre: 'Réactions de Maillard',
    extrait:
      "Couramment utilisées en cuisine pour leurs caractéristiques organoleptiques, les réactions de Maillard sont très intéressantes pour l'alimentation des ruminants.",
    description:
      'Protéines by-pass pour les ruminants : comment le réglage de la température et du temps de passage provoque — ou limite — les réactions de Maillard.',
    image: maillard,
    alt: "Illustration du système digestif de la vache",
  },
  {
    slug: 'atouts-du-soja-extrude-pour-les-animaux-delevage',
    titre: "Atouts du soja extrudé pour les animaux d'élevage",
    extrait:
      "Le soja, de par sa forte teneur en protéine, est très utilisé en alimentation animale. L'extrusion est le traitement technologique le plus adapté quelle que soit l'espèce.",
    description:
      'Volailles, pondeuses, vaches laitières : rendement énergétique, destruction des facteurs antitrypsiques et protéines by-pass — les atouts mesurés du soja extrudé.',
    image: sojaElevage,
    alt: 'Élevage de poulets',
  },
];

export const autresArticles = (slug: string, n = 3) => {
  const i = articles.findIndex((a) => a.slug === slug);
  // Les n suivants dans l'ordre de la liste, en bouclant
  return Array.from({ length: n }, (_, k) => articles[(i + 1 + k) % articles.length]);
};
