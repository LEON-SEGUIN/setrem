// Les 4 marchés de la page /applications - textes de la passerelle actuelle.
// Ils servent d'accroche en carte (sur /applications et en pied des trois
// autres pages marché). Le chapô de chaque page marché dit autre chose :
// arriver sur la page et relire mot pour mot la carte cliquée ne donne
// rien au visiteur.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/routes';

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

export const marches: Record<Locale, Marche[]> = {
  fr: [
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
  ],

  en: [
    {
      slug: 'pet-food',
      titre: 'Pet food',
      texte:
        'Producing palatable, wholesome and digestible feed for the animal, helping to preserve nutrients.',
      image: animaux,
      alt: 'A dog and a cat side by side',
    },
    {
      slug: 'aquaculture',
      titre: 'Aquaculture',
      texte:
        'Extrusion: a sound answer for feed production in aquaculture.',
      image: aquaculture,
      alt: 'Aquaculture ponds',
    },
    {
      slug: 'human-food',
      titre: 'Human food',
      texte:
        'Extrusion turns ingredients into products such as breakfast cereals and snacks, improving texture and shelf life.',
      image: humaine,
      alt: 'Extruded human food products',
    },
    {
      slug: 'livestock',
      titre: 'Livestock',
      texte:
        'Extrusion produces nutritious pellets, improving nutrient uptake and shelf life.',
      image: betail,
      alt: 'Livestock on a farm',
    },
  ],
};

export const autresMarches = (slug: string, locale: Locale) =>
  marches[locale].filter((m) => m.slug !== slug);
