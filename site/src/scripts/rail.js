/* ============================================================
   SETREM - le rail « L'œil de l'expert »
   Une piste d'articles qui dérive en continu, se fige sous le
   curseur et se laisse traîner au doigt ou à la souris.
   Progressif : sans ce script le rail reste une liste qui défile
   horizontalement à la main, avec les neuf articles au complet.
   ============================================================ */

// Dérive de croisière, en pixels par seconde. Assez lent pour qu'on
// puisse lire un titre en passant, assez vif pour que la section vive.
const SPEED = 68;
// Élan maximal laissé par un lancer, px/s.
const FLING_MAX = 2800;
// Au-delà, le geste n'est plus un clic mais un déplacement.
const DRAG_SEUIL = 8;

export function initRail() {
  const rail = document.querySelector('[data-rail]');
  const track = rail?.querySelector('[data-rail-track]');
  if (!rail || !track) return null;

  const gauge = document.querySelector('[data-rail-gauge]');
  const items = [...track.children];
  if (items.length < 2) return null;

  // En mouvement réduit, on laisse le défilement natif : rien ne bouge
  // tout seul, et le rail reste entièrement parcourable.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  /* ---- La boucle sans couture ----
     Le duplicata n'existe qu'à l'écran : il est sorti de l'arbre
     d'accessibilité et de l'ordre de tabulation, pour que les neuf
     articles ne soient annoncés - et indexés - qu'une fois. */

  const copier = () => {
    const frag = document.createDocumentFragment();
    for (const li of items) {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.removeAttribute('data-rail-item');
      for (const a of c.querySelectorAll('a')) a.tabIndex = -1;
      frag.append(c);
    }
    track.append(frag);
  };

  let loopW = 0;

  const mesurer = () => {
    const jumeau = track.children[items.length];
    // La distance exacte entre un article et son clone : c'est le pas
    // de la boucle, arrondis de mise en page compris.
    loopW = jumeau ? jumeau.offsetLeft - items[0].offsetLeft : 0;
    if (loopW <= 0) return;
    // De quoi couvrir le rail même sur un très large écran
    let garde = 4;
    while (track.scrollWidth < loopW + rail.clientWidth && garde--) copier();
    // Longueur du curseur : la part des neuf articles tenant à l'écran
    gauge?.style.setProperty('--w', Math.min(rail.clientWidth / loopW, 1).toFixed(4));
  };

  copier();
  mesurer();

  rail.classList.add('is-live');

  /* ---- État ---- */

  let offset = 0;
  let speed = 0; // vitesse courante, lissée vers la cible
  let inertia = 0; // élan résiduel d'un lancer
  let ecrit = null; // dernière valeur poussée dans le DOM

  let dragging = false;
  let pointerId = null;
  let moved = 0;
  let lastX = 0;
  let lastT = 0;
  let dragV = 0;

  let hovering = false;
  let focused = false;
  let inView = true;
  let prev = 0;

  /* ---- Traîner le rail ----
     La capture n'est prise qu'une fois le geste horizontal avéré :
     avant ce seuil, un doigt qui part vers le bas fait défiler la page
     normalement (touch-action: pan-y). */

  rail.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    pointerId = e.pointerId;
    moved = 0;
    dragV = 0;
    lastX = e.clientX;
    lastT = e.timeStamp;
  });

  rail.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);

    if (!dragging) {
      if (moved < 4) return;
      dragging = true;
      speed = 0;
      inertia = 0;
      rail.setPointerCapture(e.pointerId);
      rail.classList.add('is-dragging');
    }

    const dt = Math.max(e.timeStamp - lastT, 8) / 1000;
    lastT = e.timeStamp;
    offset -= dx;
    dragV = -dx / dt;
  });

  const relacher = (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    if (!dragging) return;
    dragging = false;
    rail.classList.remove('is-dragging');
    inertia = Math.max(Math.min(dragV, FLING_MAX), -FLING_MAX);
  };

  rail.addEventListener('pointerup', relacher);
  rail.addEventListener('pointercancel', relacher);

  // Un lancer ne doit pas ouvrir l'article qui se trouvait sous le doigt
  rail.addEventListener(
    'click',
    (e) => {
      if (moved > DRAG_SEUIL) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  // Le navigateur veut emporter la photo : c'est le rail qu'on déplace
  rail.addEventListener('dragstart', (e) => e.preventDefault());

  /* ---- Le rail s'arrête quand on le regarde ---- */

  if (window.matchMedia('(hover: hover)').matches) {
    rail.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') hovering = true;
    });
    rail.addEventListener('pointerleave', () => {
      hovering = false;
    });
  }

  /* ---- Clavier ----
     Le rail est en overflow: hidden et mené au transform : le
     navigateur ne peut pas amener lui-même le lien focalisé à
     l'écran, on l'y amène. */

  rail.addEventListener('focusin', (e) => {
    focused = true;
    const item = e.target.closest('[data-rail-item]');
    if (!item) return;
    inertia = 0;
    speed = 0;
    offset = item.offsetLeft - items[0].offsetLeft;
  });

  rail.addEventListener('focusout', () => {
    // Le focus saute souvent d'un lien du rail au suivant : on attend
    // qu'il soit posé avant de conclure qu'il est parti.
    requestAnimationFrame(() => {
      focused = rail.contains(document.activeElement);
    });
  });

  // …et s'il tente quand même de faire défiler la boîte, on annule :
  // une seule mécanique de déplacement, le transform.
  rail.addEventListener(
    'scroll',
    () => {
      if (rail.scrollLeft) rail.scrollLeft = 0;
    },
    { passive: true }
  );

  /* ---- Ne travailler que si la section est à l'écran ---- */

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
    },
    { rootMargin: '160px 0px' }
  ).observe(rail);

  new ResizeObserver(() => mesurer()).observe(rail);

  /* ---- La frame ----
     Cadencée par la boucle unique de scroll.js, juste après Lenis. */

  return (time) => {
    if (!loopW) return;

    const dt = prev ? Math.min((time - prev) / 1000, 0.05) : 0;
    prev = time;

    if (!dragging) {
      const cible = inView && !document.hidden && !hovering && !focused ? SPEED : 0;
      // Lissage exponentiel : même réponse à 60 comme à 120 Hz
      speed += (cible - speed) * (1 - Math.exp(-dt * 6));
      offset += (speed + inertia) * dt;
      inertia *= Math.exp(-dt * 4.5);
      if (Math.abs(inertia) < 1) inertia = 0;
      if (Math.abs(speed) < 0.05 && !inertia) speed = 0;
    }

    offset = ((offset % loopW) + loopW) % loopW;

    // Rien de neuf : ne pas salir le DOM pour un dixième de pixel
    const x = Math.round(offset * 100) / 100;
    if (x === ecrit) return;
    ecrit = x;

    track.style.transform = `translate3d(${-x}px, 0, 0)`;
    gauge?.style.setProperty('--g', (offset / loopW).toFixed(4));
  };
}
