/* ============================================================
   SETREM - animations pilotées par le scroll
   Un seul moteur rAF interpole les valeurs (lerp) : la parallaxe
   et l'expansion suivent le scroll avec un temps de retard doux,
   c'est ce qui donne la fluidité de la référence.
   Tout est progressif : sans ce script, la page reste complète
   et lisible (voir les fallbacks html:not(.js) dans les styles).
   ============================================================ */

import { lenis } from './smooth-scroll.js';
import { initRail } from './rail.js';
import { initWave } from './wave.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---- Navbar : transparente en haut, carte flottante au scroll ---- */

function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  const toggle = nav.querySelector('[data-nav-toggle]');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    // Menu mobile ouvert : la page dessous se fige, au lieu de glisser
    // derrière le panneau.
    if (open) lenis?.stop();
    else lenis?.start();
  });
}

/* ---- Vidéo du process : pilotée par le scroll ----
   La vidéo n'avance pas toute seule : sa tête de lecture suit la
   progression de la section épinglée (voir initMotion). Ici on se
   contente de la mettre sous contrôle et de la précharger en entier
   dès que la section approche - le HTML ne porte volontairement ni
   `autoplay` ni `preload`, sinon Safari colle son player par-dessus
   (voir Process.astro). Sans JS, c'est le doublon <noscript> qui joue. */

function initProcessVideo() {
  const video = document.querySelector('[data-process-video]');
  if (!video) return;

  video.controls = false;
  video.pause();

  if (reduceMotion.matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Un GOP court a été encodé exprès : le buffer complet permet
          // des seeks précis et fluides dans les deux sens.
          video.preload = 'auto';
          video.load();
          observer.disconnect();
        }
      }
    },
    { rootMargin: '100% 0px 100% 0px' }
  );
  observer.observe(video);
}

/* ---- Hero : la brume argentée qui suit le curseur ----
   La chorégraphie d'entrée du hero reste en pur CSS ; ici seulement
   l'effet de souris, décoratif. La brume traîne derrière le curseur
   (lerp) et s'évanouit quand il quitte la section. Souris uniquement :
   rien au toucher, rien en prefers-reduced-motion, rien sans JS. */

function initHeroMist() {
  const hero = document.querySelector('[data-hero]');
  const mist = hero?.querySelector('[data-mist]');
  if (!hero || !mist) return;
  if (reduceMotion.matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let tx = 0, ty = 0, x = 0, y = 0;
  let to = 0, o = 0;
  let seeded = false;
  let raf = 0;

  const tick = () => {
    x += (tx - x) * 0.09;
    y += (ty - y) * 0.09;
    o += (to - o) * 0.08;

    mist.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    mist.style.opacity = o.toFixed(3);

    // S'endort une fois posée (économie batterie), réveillée à l'événement
    if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5 || Math.abs(to - o) > 0.01) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    tx = e.clientX - rect.left;
    ty = e.clientY - rect.top;
    if (!seeded) {
      // Première entrée : la brume naît sous le curseur, sans traversée
      x = tx;
      y = ty;
      seeded = true;
    }
    to = 1;
    wake();
  });

  hero.addEventListener('pointerleave', () => {
    to = 0;
    wake();
  });
}

/* ---- Moteur : section process + parallaxes, valeurs lissées ---- */

/* ---- Sections épinglées des pages intérieures ----
   Même langage que le process de l'accueil - l'image s'ouvre de la carte
   au plein écran pendant que les chapitres se relaient - mais sans vidéo
   ni asservissement de tête de lecture. Le pilote du process n'est pas
   touché : il est réglé et validé, on ne le refactorise pas pour
   mutualiser trois lignes.
   Sans JS, .pin__spacer n'a pas de hauteur imposée et les chapitres
   défilent normalement sous l'image : tout le texte reste lu. */

function initPins() {
  const pins = [...document.querySelectorAll('[data-pin]')].map((el) => ({
    el,
    frame: el.querySelector('[data-pin-frame]'),
    steps: [...el.querySelectorAll('[data-pin-step]')],
    index: el.querySelector('[data-pin-index]'),
    active: 0,
    p: 0,
  }));
  if (!pins.length) return null;

  if (reduceMotion.matches) {
    // Image ouverte d'emblée, tous les chapitres visibles : la section
    // redevient une liste illustrée, sans course de scroll.
    for (const pin of pins) {
      pin.frame?.style.setProperty('--p', '1');
      pin.el.classList.add('is-static');
    }
    return null;
  }

  const EXPAND = 0.22;
  const LERP = lenis ? 0.32 : 0.14;

  const setStep = (pin, i) => {
    if (i === pin.active) return;
    const leaving = pin.steps[pin.active];
    pin.active = i;

    leaving?.classList.add('is-leaving');
    leaving?.classList.remove('is-active');
    setTimeout(() => leaving?.classList.remove('is-leaving'), 420);

    pin.steps.forEach((el, j) => {
      if (j === i) el.classList.add('is-active');
      else if (el !== leaving) el.classList.remove('is-active');
    });
    if (pin.index) {
      [...pin.index.children].forEach((el, j) => {
        el.classList.toggle('is-active', j === i);
        el.classList.toggle('is-done', j < i);
      });
    }
  };

  return () => {
    for (const pin of pins) {
      const rect = pin.el.getBoundingClientRect();
      // Hors champ : rien à calculer
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;

      const total = pin.el.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      const target = Math.min(progress / EXPAND, 1);

      pin.p += (target - pin.p) * LERP;
      pin.frame?.style.setProperty('--p', pin.p.toFixed(4));
      // Contre-glissement de l'image pendant la course des chapitres
      pin.frame?.style.setProperty('--vy', `${((progress - 0.5) * -3.2).toFixed(2)}%`);

      const stepProgress = Math.min(
        Math.max((progress - EXPAND) / (1 - EXPAND), 0),
        0.999
      );
      setStep(pin, Math.floor(stepProgress * pin.steps.length));

      if (pin.index) {
        const sp = stepProgress * pin.steps.length - pin.active;
        pin.index.style.setProperty('--sp', Math.min(Math.max(sp, 0), 1).toFixed(3));
      }
    }
  };
}

/* ---- Progression de lecture des articles ----
   Un filet sous la barre de navigation, qui se remplit sur la hauteur du
   corps de l'article - pas sur celle de la page : ce qui intéresse le
   lecteur, c'est où il en est dans le texte, pas dans le pied de page. */

function initReadingProgress() {
  const bar = document.querySelector('[data-progress]');
  const article = document.querySelector('[data-progress-target]');
  if (!bar || !article) return null;

  return () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.5;
    const done = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
    bar.style.setProperty('--read', done.toFixed(4));
  };
}

/* ---- Moteur : section process + parallaxes, valeurs lissées ---- */

function initMotion() {
  // Le hero épinglé fond et recule pendant que la feuille suivante
  // le recouvre (le recouvrement lui-même est en pur CSS : sticky)
  const hero = document.querySelector('[data-hero]');

  // Les en-têtes des pages intérieures reculent de la même façon : c'est
  // ce mouvement, plus que les arcs en rotation, qui fait reconnaître
  // l'accueil dans le reste du site.
  const phero = document.querySelector('[data-phero]');

  // Bandeaux photo à parallaxe interne : l'image glisse dans son cadre
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map(
    (el) => ({
      el,
      img: el.querySelector('img'),
      speed: parseFloat(el.dataset.parallax) || 0.12,
    })
  );

  const process = document.querySelector('[data-process]');
  const frame = process?.querySelector('[data-process-frame]');
  const video = process?.querySelector('[data-process-video]');
  const steps = process
    ? [...process.querySelectorAll('[data-process-step]')]
    : [];
  const index = process?.querySelector('[data-process-index]');
  const indexItems = index ? [...index.children] : [];

  if (reduceMotion.matches) {
    // Pas d'animation : l'image du process est plein écran d'emblée
    frame?.style.setProperty('--p', '1');
    return;
  }

  // Part du scroll consacrée à l'expansion de l'image (le reste : chapitres)
  const EXPAND = 0.2;
  // Quand Lenis est là, la position de la fenêtre est déjà lissée : ce
  // second lissage doit se faire discret, sinon les deux s'additionnent
  // et le hero décroche visiblement de la molette.
  const LERP = lenis ? 0.32 : 0.14;
  // La matière doit répondre un peu plus vite que le reste.
  const LERP_VIDEO = lenis ? 0.36 : 0.18;

  // Valeurs courantes (lissées) et cibles
  const cur = { y: 0, p: 0, vy: 0, vt: 0, hp: 0, pp: 0 };
  let activeStep = 0;
  let idle = 0;

  const setStep = (i) => {
    if (i === activeStep) return;
    const leaving = steps[activeStep];
    activeStep = i;

    // Le chapitre sortant file vers le haut, le temps de sa transition
    leaving?.classList.add('is-leaving');
    leaving?.classList.remove('is-active');
    setTimeout(() => leaving?.classList.remove('is-leaving'), 420);

    steps.forEach((el, j) => {
      if (j === i) el.classList.add('is-active');
      else if (el !== leaving) el.classList.remove('is-active');
    });
    indexItems.forEach((el, j) => {
      el.classList.toggle('is-active', j === i);
      el.classList.toggle('is-done', j < i);
    });

    // « Cut caméra » : bref élan de zoom qui retombe en douceur
    if (frame) {
      frame.classList.add('is-cutting');
      frame.style.setProperty('--pulse', '0.045');
      setTimeout(() => frame.style.setProperty('--pulse', '0'), 60);
      setTimeout(() => frame.classList.remove('is-cutting'), 760);
    }
  };

  const tick = () => {
    const y = window.scrollY;
    const target = { y, p: cur.p, vy: cur.vy, vt: cur.vt, hp: cur.hp, pp: cur.pp };

    // -- Hero : progression du recouvrement, 0 (en haut) → 1 (couvert)
    if (hero) {
      target.hp = Math.min(Math.max(y / hero.offsetHeight, 0), 1);
    }

    // -- En-tête de page intérieure : même progression, sur sa hauteur
    if (phero) {
      target.pp = Math.min(Math.max(y / phero.offsetHeight, 0), 1);
    }

    // -- Process : progression 0→1 sur la hauteur du spacer
    if (process) {
      const rect = process.getBoundingClientRect();
      const total = process.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      target.p = Math.min(progress / EXPAND, 1);
      // La vidéo glisse doucement vers le haut sur la course des chapitres
      target.vy = (progress - 0.5) * -4; // en %

      // La tête de lecture est asservie au scroll : l'animation 3D
      // n'avance que quand on descend, et rembobine quand on remonte.
      if (video && video.duration) {
        target.vt = progress * Math.max(video.duration - 0.08, 0);
      }

      const stepProgress = Math.min(
        Math.max((progress - EXPAND) / (1 - EXPAND), 0),
        0.999
      );
      setStep(Math.floor(stepProgress * steps.length));

      // Jauge du chapitre actif : progression continue à l'intérieur
      // du chapitre (0 → 1), lue par l'index de droite
      if (index) {
        const sp = stepProgress * steps.length - activeStep;
        index.style.setProperty('--sp', Math.min(Math.max(sp, 0), 1).toFixed(3));
      }
    }

    // Interpolation douce vers les cibles
    cur.y += (target.y - cur.y) * LERP;
    cur.p += (target.p - cur.p) * LERP;
    cur.hp += (target.hp - cur.hp) * LERP;
    cur.pp += (target.pp - cur.pp) * LERP;
    cur.vy += (target.vy - cur.vy) * LERP;
    cur.vt += (target.vt - cur.vt) * LERP_VIDEO;

    // Coupe le travail quand tout est posé (économie batterie)
    const delta =
      Math.abs(target.y - cur.y) +
      Math.abs(target.p - cur.p) +
      Math.abs(target.hp - cur.hp) * 100 +
      Math.abs(target.pp - cur.pp) * 100 +
      Math.abs(target.vy - cur.vy) +
      Math.abs(target.vt - cur.vt) * 10;
    idle = delta < 0.1 ? idle + 1 : 0;

    if (idle < 30) {
      // Le hero s'évanouit en fondu sous la feuille, pendant que la brume
      // de couleur (--hp, lue par .hero__dusk) monte devant elle.
      // Le fond ne recule qu'à peine : c'est le contenu - symbole, titre,
      // texte - qui part vers le haut, nettement plus vite (--hq, lu par
      // les enfants dans Hero.astro). Sans cet écart entre le fond et le
      // contenu, le départ vers le haut ne se voit pas.
      if (hero) {
        // Progression légèrement accélérée : le départ s'emballe un peu
        // sur la fin, comme dans la référence
        const hq = cur.hp * (0.55 + 0.45 * cur.hp);
        hero.style.opacity = Math.max(1 - cur.hp * 1.05, 0).toFixed(3);
        hero.style.transform = `translateY(${(cur.hp * -3).toFixed(2)}vh)`;
        hero.style.setProperty('--hp', cur.hp.toFixed(4));
        hero.style.setProperty('--hq', hq.toFixed(4));
      }

      // Même chorégraphie que le hero, en plus courte : le fond recule à
      // peine, le contenu (étiquette, titre, chapô) part plus vite vers
      // le haut. C'est l'écart entre les deux qui fait la profondeur.
      if (phero) {
        const pq = cur.pp * (0.55 + 0.45 * cur.pp);
        phero.style.opacity = Math.max(1 - cur.pp * 1.15, 0).toFixed(3);
        phero.style.transform = `translateY(${(cur.pp * -2.4).toFixed(2)}vh)`;
        phero.style.setProperty('--pp', cur.pp.toFixed(4));
        phero.style.setProperty('--pq', pq.toFixed(4));
      }

      if (frame) {
        frame.style.setProperty('--p', cur.p.toFixed(4));
        frame.style.setProperty('--vy', `${cur.vy.toFixed(2)}%`);
      }

      // Seek seulement quand l'écart vaut au moins une frame (~30 fps) :
      // en deçà, le navigateur ferait du travail pour rien.
      if (video && video.readyState >= 2 && Math.abs(video.currentTime - cur.vt) > 0.034) {
        video.currentTime = cur.vt;
      }

      for (const { el, img, speed } of parallaxEls) {
        if (!img) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const offset =
          (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
        img.style.transform = `translateY(${offset.toFixed(1)}px)`;
      }
    }
  };

  // Rendue à l'appelant : c'est la boucle commune (voir plus bas) qui la
  // cadence, juste après Lenis, pour lire une position déjà à jour.
  return tick;
}

/* ---- Révélations à l'entrée + barres de capacités ---- */

function initReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  // [data-inview] : éléments sans animation d'entrée dont les boucles
  // (dérive photo, marquee) ne démarrent qu'une fois à l'écran.
  document
    .querySelectorAll('.reveal, [data-inview], [data-bars], [data-words], [data-rail]')
    .forEach((el) => observer.observe(el));
}

/* ---- Onglets des capacités ---- */

function initTabs() {
  const tablist = document.querySelector('[data-tabs]');
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) =>
    document.getElementById(tab.getAttribute('aria-controls'))
  );

  const select = (tab) => {
    tabs.forEach((t, i) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (!panel) return;
      if (selected && panel.hidden) {
        panel.hidden = false;
        panel.classList.add('is-entering');
        panel.addEventListener(
          'animationend',
          () => panel.classList.remove('is-entering'),
          { once: true }
        );
      } else if (!selected) {
        panel.hidden = true;
      }
    });
    tab.focus();
  };

  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab);
  });

  tablist.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
}

initNav();
initHeroMist();
initProcessVideo();
const motionTick = initMotion();
const pinTick = initPins();
const readTick = initReadingProgress();
const railTick = initRail();
initReveals();
initTabs();

/* La vague attend un instant de calme : son init est synchrone (création
   du contexte WebGL, compilation des shaders - jusqu'à quelques dizaines
   de ms sur un mobile d'entrée de gamme) et n'a rien à faire dans la
   fenêtre de chargement, où elle retarderait le premier rendu. Le canvas
   est de toute façon invisible 1,15 s (fig-in, Hero.astro) : différée en
   période creuse, l'init est prête bien avant la fin du fondu. Safari
   n'a requestIdleCallback que depuis peu, d'où le repli setTimeout. */
let waveTick = null;
if (document.querySelector('[data-wave]')) {
  const armWave = () => {
    waveTick = initWave();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(armWave, { timeout: 900 });
  } else {
    setTimeout(armWave, 150);
  }
}

/* ---- La boucle unique ----
   Lenis écrit la position de la fenêtre, les animations la lisent dans
   la foulée : même frame, aucun décalage d'une image entre le scroll et
   ce qu'il pilote. Un seul rAF pour toute la page. */

if (lenis || motionTick || pinTick || readTick || railTick || document.querySelector('[data-wave]')) {
  const frame = (time) => {
    lenis?.raf(time);
    motionTick?.();
    pinTick?.();
    readTick?.();
    railTick?.(time);
    waveTick?.(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
