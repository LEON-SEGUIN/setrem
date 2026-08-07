/* ============================================================
   SETREM — la vague de soie du hero
   Une nappe de tissu chromé qui ondule au bas du hero, dans
   l'esprit des dégradés du logo : acier clair, creux bleutés.
   WebGL brut, aucune dépendance — un seul quad, tout le travail
   est dans le fragment shader (champ de hauteur + éclairage).
   Décoratif de bout en bout : rien sans JS, frame statique en
   prefers-reduced-motion, rendu coupé quand le hero est couvert.
   Les couleurs sont lues dans les tokens CSS, jamais en dur.
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

/* Champ de hauteur du tissu. Ressortent aussi : d, distance signée à
   la ligne médiane du ruban (découpe de la silhouette), et w, le
   gauchissement (le bord du ruban respire avec lui). */
float silk(vec2 p, float t, out float d, out float w) {
  /* La ligne médiane ondule lentement sur la largeur */
  float mid = 0.34
    + 0.090 * sin(p.x * 0.62 + t * 0.24)
    + 0.045 * sin(p.x * 1.45 - t * 0.16 + 2.1)
    + 0.070 * (fbm(vec2(p.x * 0.34 + t * 0.03, t * 0.02)) - 0.5) * 2.0;
  d = p.y - mid;

  /* Gauchissement : les plis serpentent au lieu de rester parallèles */
  w = fbm(vec2(p.x * 0.55 - t * 0.09, d * 1.6 + t * 0.05));

  /* Coordonnée de pli : les lignes de niveau de s sont les plis */
  float s = d * (5.2 + 2.2 * sin(p.x * 0.5 + t * 0.11))
    + w * 3.2
    + 0.7 * sin(p.x * 1.15 + t * 0.19);

  /* Le relief : quatre octaves de plis, du drapé aux fils fins */
  float h = 0.0;
  h += 0.50 * sin(s * 3.1);
  h += 0.30 * sin(s * 6.3 + w * 2.6);
  h += 0.14 * sin(s * 12.4 - w * 3.4 + p.x * 0.4);
  h += 0.05 * sin(s * 24.0 + w * 5.2);
  /* L'amplitude meurt en s'éloignant du ruban — beaucoup plus vite
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

  float d0, w0, dTmp, wTmp;
  float e = 2.0 / uRes.y;
  float h0 = silk(p, t, d0, w0);
  float hx = silk(p + vec2(e, 0.0), t, dTmp, wTmp);
  float hy = silk(p + vec2(0.0, e), t, dTmp, wTmp);

  /* Normale par différences finies — le facteur règle le relief */
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
     au fond des vallées — jamais sur les crêtes */
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
    antialias: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

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

  /* Taille : suivie par ResizeObserver, DPR plafonné (Core Web Vitals) */
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let needsResize = true;
  new ResizeObserver(() => (needsResize = true)).observe(canvas);

  const resize = () => {
    const w = Math.round(canvas.clientWidth * DPR);
    const h = Math.round(canvas.clientHeight * DPR);
    if (!w || !h) return false;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
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
    if (needsResize && !resize()) return;
    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  /* Reduced motion : une seule frame, posée — pas d'animation */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render(11.3);
    return null;
  }

  /* Cadencée par la boucle commune de scroll.js, après Lenis */
  return (time) => {
    if (lost) return;
    /* Hero recouvert par la feuille suivante : plus rien à peindre */
    if (hero && window.scrollY > hero.offsetHeight * 0.95) return;
    render(time * 0.0006);
  };
}
