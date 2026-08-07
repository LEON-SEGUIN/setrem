/* ============================================================
   SETREM — scroll lissé (Lenis)
   Un coup de molette ne saute plus : la page rattrape sa cible en
   glissant. Lenis n'ajoute pas de conteneur transformé — il déplace
   la vraie position de la fenêtre, donc window.scrollY reste la
   source de vérité et position:sticky, IntersectionObserver et les
   ancres natives continuent de fonctionner tels quels.
   Sans JS : scroll natif, page complète (rien ici n'est du contenu).
   ============================================================ */

import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * L'instance partagée, ou `null` si l'utilisateur a demandé moins
 * d'animations — dans ce cas on rend la main au scroll du système.
 */
export const lenis = reduceMotion.matches
  ? null
  : new Lenis({
      // Chaque frame rattrape 10 % de l'écart restant : la course est
      // courte, la fin est douce, et rien ne traîne derrière la molette.
      lerp: 0.1,
      smoothWheel: true,
      // Au doigt, on garde le scroll natif : le navigateur le fait mieux
      // (compositeur), et ça ne coûte rien aux Core Web Vitals mobiles.
      syncTouch: false,
      // Les liens d'ancre (#…) glissent au lieu de sauter.
      anchors: true,
      // La boucle rAF est partagée avec le moteur d'animations
      // (voir scroll.js) : une seule boucle pour toute la page.
      autoRaf: false,
    });
