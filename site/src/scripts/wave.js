/* ============================================================
   SETREM - la vague de soie du hero
   Une nappe de tissu chromé qui ondule au bas du hero, dans
   l'esprit des dégradés du logo : acier clair, creux bleutés.
   WebGL brut, aucune dépendance - un seul quad, tout le travail
   est dans le fragment shader (champ de hauteur + éclairage).
   Décoratif de bout en bout : rien sans JS, frame statique en
   prefers-reduced-motion, rendu coupé quand le hero est couvert.
   Les couleurs sont lues dans les tokens CSS, jamais en dur.

   Le shader est cher (bruit fractal + éclairage, par pixel). Sur un
   GPU intégré ancien il ne tient pas les 16 ms et la nappe saccade.
   D'où le gouverneur plus bas : on mesure la cadence réelle et on
   dégrade par paliers, plutôt que de deviner le matériel.
   ============================================================ */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uHi;      /* crêtes, presque blanc      */
uniform vec3  uSteel;   /* corps du métal             */
uniform vec3  uShadow;  /* creux profonds             */
uniform vec3  uBlue;    /* bleu du logo, au fond des plis */
uniform vec3  uBlueSoft;/* voile bleu des pentes      */

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

/* La ligne médiane du ruban, qui ondule lentement sur la largeur.
   Elle ne dépend que de x : l'échantillon décalé en y de la normale
   retombe exactement dessus, on la calcule donc une fois pour deux.
   Un fbm de moins par pixel, à l'image près identique. */
float midline(float x, float t) {
  return 0.34
    + 0.090 * sin(x * 0.62 + t * 0.24)
    + 0.045 * sin(x * 1.45 - t * 0.16 + 2.1)
    + 0.070 * (fbm(vec2(x * 0.34 + t * 0.03, t * 0.02)) - 0.5) * 2.0;
}

/* Champ de hauteur du tissu, à la distance signée d de la médiane.
   Ressort aussi w, le gauchissement : le bord du ruban respire avec lui. */
float silk(float x, float d, float t, out float w) {
  /* Gauchissement : les plis serpentent au lieu de rester parallèles */
  w = fbm(vec2(x * 0.55 - t * 0.09, d * 1.6 + t * 0.05));

  /* Coordonnée de pli : les lignes de niveau de s sont les plis */
  float s = d * (5.2 + 2.2 * sin(x * 0.5 + t * 0.11))
    + w * 3.2
    + 0.7 * sin(x * 1.15 + t * 0.19);

  /* Le relief : quatre octaves de plis, du drapé aux fils fins */
  float h = 0.0;
  h += 0.50 * sin(s * 3.1);
  h += 0.30 * sin(s * 6.3 + w * 2.6);
  h += 0.14 * sin(s * 12.4 - w * 3.4 + x * 0.4);
  h += 0.05 * sin(s * 24.0 + w * 5.2);
  /* L'amplitude meurt en s'éloignant du ruban - beaucoup plus vite
     vers le haut : le bord côté texte reste vaporeux, le bas est riche */
  h *= exp(-mix(-d * 1.6, d * 3.4, step(0.0, d)));
  return h;
}

void main() {
  /* La fréquence horizontale est bornée : sur un cadre étroit
     (mobile), la nappe ondule quand même au lieu de rayer l'écran */
  float aspect = max(uRes.x / uRes.y, 2.6);
  vec2 p = vec2(vUv.x * aspect, vUv.y);
  float t = uTime;

  /* Le pas des différences finies vaut deux pixels : il suit donc la
     résolution de rendu, et le relief garde la même force à l'écran
     même quand le gouverneur baisse la définition. */
  float e = 2.0 / uRes.y;
  float mid = midline(p.x, t);
  float d0 = p.y - mid;

  float w0, wTmp;
  float h0 = silk(p.x,     d0,                     t, w0);
  float hx = silk(p.x + e, p.y - midline(p.x + e, t), t, wTmp);
  float hy = silk(p.x,     d0 + e,                 t, wTmp);

  /* Normale par différences finies - le facteur règle le relief */
  vec3 n = normalize(vec3((h0 - hx) / e * 0.055, (h0 - hy) / e * 0.055, 1.0));

  /* Deux lumières : clé froide en haut à gauche, reprise à droite */
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(-0.35, 0.55, 0.72));
  vec3 L2 = normalize(vec3(0.62, -0.22, 0.55));
  float dif1 = clamp(dot(n, L1), 0.0, 1.0);
  float dif2 = clamp(dot(n, L2), 0.0, 1.0);
  float spec1 = pow(clamp(dot(n, normalize(L1 + V)), 0.0, 1.0), 70.0);
  float spec2 = pow(clamp(dot(n, normalize(L2 + V)), 0.0, 1.0), 26.0);
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.0);

  /* Le métal : acier → presque blanc sous la clé, creux assombris */
  vec3 col = mix(uSteel, uHi, dif1 * 0.82 + 0.18);
  col = mix(col, uShadow, (1.0 - dif1) * (1.0 - dif2) * 0.60);
  /* Les tons bleus : voile sur les pentes rasantes, bleu du logo
     au fond des vallées - jamais sur les crêtes */
  col = mix(col, uBlueSoft, clamp(fres * 0.75 + (1.0 - dif1) * 0.20, 0.0, 1.0) * 0.50);
  col = mix(col, uBlue, (1.0 - smoothstep(-0.85, 0.15, h0)) * 0.20);
  col += uHi * (spec1 * 0.85 + spec2 * 0.28);

  /* Silhouette : un ruban dont le bord respire avec les plis */
  float edge = abs(d0 + 0.045 - h0 * 0.045 - (w0 - 0.5) * 0.14);
  float body = 1.0 - smoothstep(0.075, 0.155, edge);
  /* Le voile au-dessus de la ligne médiane s'éclaircit : c'est le
     côté du texte, il doit rester un souffle */
  body *= 1.0 - 0.5 * smoothstep(0.04, 0.20, d0);
  /* Fondu vers le bas du cadre : la nappe se dissout avant le bord */
  body *= smoothstep(0.0, 0.16, vUv.y);
  /* Fondu latéral très léger pour ne jamais couper net */
  body *= smoothstep(0.0, 0.02, vUv.x) * (1.0 - smoothstep(0.98, 1.0, vUv.x));

  /* Grain : casse le banding des dégradés doux */
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(col * body, body);
}
`;

function parseHex(value, fallback) {
  const hex = /#([0-9a-f]{6})/i.exec(value || '')?.[1] || fallback;
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function initWave() {
  const canvas = document.querySelector('[data-wave]');
  if (!canvas) return null;
  const hero = canvas.closest('[data-hero]');

  const gl = canvas.getContext('webgl', {
    alpha: true,
    /* Aucune arête géométrique à l'écran : le quad déborde du cadre et
       la silhouette du ruban est découpée en smoothstep dans le shader.
       Le multi-échantillonnage ne lisserait donc rien, mais il coûte un
       tampon de plus et une résolution d'image à chaque frame - de la
       bande passante, la denrée rare des GPU intégrés. */
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
    /* Sans GPU (WebGL logiciel), le shader plein écran brûlerait le
       processeur : on renonce à la vague, le hero garde son dégradé. */
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;

  /* Le bruit repose sur un hash en fract() : il lui faut du vrai fp32.
     Quand le pilote annonce moins, le bruit se casse en blocs et en
     bandes - une vague fendue vaut moins que pas de vague du tout. */
  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (!precision || precision.precision < 23) return null;

  /* Les couleurs viennent des tokens (brand/tokens.css) */
  const styles = getComputedStyle(document.documentElement);
  const tok = (name, fallback) =>
    parseHex(styles.getPropertyValue(name).trim(), fallback);
  const colors = {
    uHi: tok('--steel-50', 'f7f9fa'),
    uSteel: tok('--logo-steel', '78878f'),
    uShadow: tok('--steel-700', '4e5b61'),
    uBlue: tok('--blue-600', '004c91'),
    uBlueSoft: tok('--blue-300', '5e97c9'),
  };

  let program = null;
  let uniforms = {};

  const compile = (type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('wave:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  const setup = () => {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of ['uRes', 'uTime', ...Object.keys(colors)]) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    for (const [name, rgb] of Object.entries(colors)) {
      gl.uniform3fv(uniforms[name], rgb);
    }
    return true;
  };

  if (!setup()) return null;

  /* Taille : suivie par ResizeObserver. Sur écran tactile, le DPR n'est
     pas plafonné à l'aveugle : sur un téléphone (DPR 3) un plafond à
     1.5 peindrait la nappe à moitié de sa définition puis l'étirerait -
     floue d'entrée. Or le cadre y est petit : c'est le nombre de pixels
     qui coûte, pas le ratio ; on borne donc le tampon au budget d'un
     hero de bureau (1440 css × 1.5 de DPR). La garde tactile est
     importante : sans elle, une fenêtre étroite sur un écran de bureau
     DPR 2 (snap Windows, iPad avec souris mis à part) paierait jusqu'à
     +78 % de pixels par rapport au plafond d'origine - qui reste, lui,
     la règle partout où il y a une souris.
     Le facteur d'échelle est celui que le gouverneur fait descendre :
     le coût du shader est quadratique en résolution, c'est de loin le
     levier qui rend le plus, et une nappe douce et masquée en haut
     supporte d'être peinte plus petit puis étirée. */
  const PIXELS = 1_300_000; // le tampon d'un hero de bureau, en pixels
  const COARSE = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const SCALES = [1, 0.72, 0.52, 0.38];
  let scale = 0;
  let needsResize = true;

  /* Hauteur du hero mise en cache. La lire à chaque image forcerait un
     recalcul de mise en page, juste après que la boucle commune a écrit
     ses styles - la lire ici est gratuit, l'observateur passe après la
     mise en page. Le canvas est dimensionné en svh : il suit le cadre.
     Un resize invalide aussi la fenêtre d'observation du gouverneur :
     rotation ou redimensionnement produisent des frames longues qui ne
     disent rien du GPU, un verdict rendu dessus serait corrompu. */
  let heroH = 0;
  let invalidate = null; // posé par le gouverneur, absent en reduced-motion
  new ResizeObserver(() => {
    needsResize = true;
    heroH = hero ? hero.offsetHeight : 0;
    invalidate?.();
  }).observe(canvas);

  const resize = () => {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return false;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      COARSE ? Math.max(1.5, Math.sqrt(PIXELS / (cw * ch))) : 1.5
    );
    const s = dpr * SCALES[scale];
    const w = Math.round(cw * s);
    const h = Math.round(ch * s);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    /* uRes ne bouge qu'ici : inutile de le renvoyer à chaque image */
    gl.uniform2f(uniforms.uRes, w, h);
    needsResize = false;
    return true;
  };

  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    lost = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    uniforms = {};
    if (setup()) {
      needsResize = true;
      lost = false;
    }
  });

  const render = (t) => {
    if (needsResize && !resize()) return false;
    gl.uniform1f(uniforms.uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  };

  /* Reduced motion : une seule frame, posée - pas d'animation. C'est la
     boucle qui la pose, le temps que le canvas ait une taille, et qui la
     repose si le cadre change (needsResize couvre aussi la perte de
     contexte, qui vide le canvas). */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {
      if (!lost && needsResize) render(11.3);
    };
  }

  /* ---- Le gouverneur ----
     Deviner le matériel ne marche pas : les listes de GPU vieillissent
     et les navigateurs masquent désormais le nom du renderer. On mesure
     donc l'écart réel entre deux images peintes, et on dégrade par
     paliers quand la médiane sort du budget : d'abord la résolution
     (invisible), puis 30 images par seconde (la nappe dérive lentement,
     personne ne le verra), et en dernier recours on fige l'image.
     Une vague immobile reste belle ; une vague qui saccade, non.
     Chaque palier de résolution est mis à l'essai : s'il ne raccourcit
     pas les images, c'est que la lenteur ne venait pas du GPU, et on
     le rend - sans ça, un simple mode économie d'énergie (rAF bridé à
     30 im/s) faisait descendre la nappe jusqu'au plancher pour rien.
     La fenêtre d'observation est bornée en millisecondes, pas seulement
     en images : comptée en images seules, plus la machine rame, plus le
     verdict tarde - exactement l'inverse de ce qu'on veut. */
  const WARMUP = 1000; // le temps que la page finisse de se charger
  const SAMPLE = 16; // images observées avant chaque verdict
  const VERDICT = 700; // ms : au-delà on tranche sur ce qu'on a
  const MIN = 5; // en dessous, la médiane ne veut plus rien dire
  const deltas = [];
  let started = 0;
  let span = 0; // durée réelle de la fenêtre d'observation
  let lastDraw = 0;
  let interval = 0; // 0 = chaque image, 33 = 30 images/s
  let frozenAt = 0; // instant de l'image gardée, une fois la nappe figée
  let probation = null; // { scale, median } : palier de définition à l'essai
  let scaleFails = 0; // probations ratées d'affilée - à deux, levier condamné
  let scaleHelps = true; // faux quand baisser la définition ne rend rien
  let strikes = 0; // verdicts hors budget consécutifs
  let proven = false; // vrai dès qu'un verdict est entré dans le budget

  /* Rotation, redimensionnement : les frames de relayout sont longues
     sans que le GPU y soit pour rien. La fenêtre en cours est jetée,
     et une probation traversée par un resize n'est pas jugée. */
  invalidate = () => {
    deltas.length = 0;
    span = 0;
    strikes = 0;
    probation = null;
  };

  const judge = () => {
    deltas.sort((a, b) => a - b);
    const median = deltas[deltas.length >> 1];
    deltas.length = 0;
    span = 0;
    /* 23 ms, soit sous les 43 images/s : en deçà la saccade se voit.
       Le seuil laisse passer les dalles à 50 Hz sans les dégrader. */
    const budget = interval ? interval * 1.35 : 23;

    /* Le palier pris au verdict précédent était à l'essai : gardé
       seulement s'il a payé. Moins de pixels doit donner des images
       plus courtes - exiger 12 % est indulgent. Sinon le goulot n'est
       pas le remplissage : rAF bridé à 30 im/s (économie d'énergie de
       Safari et Chrome), fil principal occupé... Baisser la définition
       n'achèterait alors que de la bouillie de pixels, on rend le
       palier et on ne touche plus jamais à la définition. */
    if (probation) {
      if (median > budget && median > probation.median * 0.88) {
        scale = probation.scale;
        needsResize = true;
        /* Un seul échec ne condamne pas le levier : la fenêtre a pu
           être polluée (chargement, long task). Deux échecs d'affilée,
           eux, disent vraiment que le remplissage n'est pas le goulot. */
        scaleHelps = ++scaleFails < 2;
      } else {
        scaleFails = 0;
      }
      probation = null;
    }

    if (median <= budget) {
      proven = true;
      strikes = 0;
      return;
    }

    /* Deux verdicts consécutifs avant de dégrader : un accroc passager
       - coup de scroll, long task - ne doit pas coûter sa définition à
       la nappe. Mais cette patience ne vaut que sur une machine qui a
       déjà prouvé qu'elle tient le budget : au chargement, un GPU trop
       faible sature la boucle rAF commune, chaque verdict d'attente est
       une demi-seconde de jank - la première descente part sans délai.
       Pendant une descente, strikes reste haut : les paliers suivants
       tombent sans nouveau délai. */
    if (++strikes < 2 && proven) return;

    if (scaleHelps && scale < SCALES.length - 1) {
      /* Plus on est loin du budget, plus on descend vite : une machine
         très lente n'a pas à traverser les paliers un par un, sinon
         elle saccade pendant tout le temps de la descente. */
      probation = { scale, median };
      scale = Math.min(scale + (median > budget * 2.5 ? 2 : 1), SCALES.length - 1);
      needsResize = true;
    } else if (!interval) {
      interval = 33;
    } else {
      frozenAt = lastDraw;
    }
  };

  /* Cadencée par la boucle commune de scroll.js, après Lenis */
  return (time) => {
    if (lost) return;
    /* Figée : on ne repeint que si le canvas a changé de taille ou a été
       vidé par une perte de contexte - et toujours la même image. */
    if (frozenAt) {
      if (needsResize) render(frozenAt * 0.0006);
      return;
    }
    /* Hero recouvert par la feuille suivante : plus rien à peindre */
    if (heroH && window.scrollY > heroH * 0.95) {
      lastDraw = 0;
      return;
    }
    /* Image sautée en mode 30 im/s : on ne mesure pas non plus, pour
       que la mesure reste celle du coût d'une image peinte. */
    if (interval && lastDraw && time - lastDraw < interval - 4) return;

    const dt = lastDraw ? time - lastDraw : 0;
    lastDraw = time;
    if (!render(time * 0.0006)) return;
    if (!started) started = time;

    /* Les sauts (retour d'onglet, longue pause) ne disent rien du GPU */
    if (dt > 0 && dt < 250 && time - started > WARMUP) {
      span += dt;
      /* On tranche sur 16 images, ou plus tôt si elles traînent : sur
         une machine à la peine, attendre le compte plein, c'est laisser
         saccader plusieurs secondes avant de réagir. */
      if (deltas.push(dt) >= SAMPLE || (deltas.length >= MIN && span > VERDICT)) {
        judge();
      }
    }
  };
}
