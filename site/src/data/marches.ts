// Les 4 marchés de la page /applications — textes de la passerelle actuelle.
// Ils servent d'accroche en carte (sur /applications et en pied des trois
// autres pages marché). Le chapô de chaque page marché dit autre chose :
// arriver sur la page et relire mot pour mot la carte cliquée ne donne
// rien au visiteur.
import type { ImageMetadata } from 'astro';

import animaux from '../assets/img/app-animaux-domestiques.webp';
import aquaculture from '../assets/img/app-aquaculture.webp';
import humaine from '../assets/img/app-alimentation-humaine.webp';
import betail from '../assets/img/app-betail.webp';

export interface Marche {
  slug: string;
  titre: string;
  texte: string;
  image: ImageMetadata;
  alt: string;
}

export const marches: Marche[] = [
  {
    slug: 'animaux-domestiques',
    titre: 'Animaux domestiques',
    texte:
      "Produire des aliments appétents, sains et digestes pour l'animal, favorisant la conservation des nutriments.",
    image: animaux,
    alt: 'Chien et chat côte à côte',
  },
  {
    slug: 'aquaculture',
    titre: 'Aquaculture',
    texte:
      "L'extrusion : une réponse pertinente pour la production d'aliments en aquaculture.",
    image: aquaculture,
    alt: "Bassins d'aquaculture",
  },
  {
    slug: 'alimentation-humaine',
    titre: 'Alimentation humaine',
    texte:
      "L'extrusion transforme les ingrédients en produits comme les céréales et les snacks, en améliorant la texture et la conservation.",
    image: humaine,
    alt: "Produits d'alimentation humaine extrudés",
  },
  {
    slug: 'betail',
    titre: 'Bétail',
    texte:
      "L'extrusion produit des granulés nutritifs, améliorant l'assimilation des nutriments et la durée de conservation.",
    image: betail,
    alt: 'Bétail en élevage',
  },
];

export const autresMarches = (slug: string) =>
  marches.filter((m) => m.slug !== slug);
