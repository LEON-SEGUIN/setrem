# SETREM — Charte de marque

Valeurs implémentées dans [tokens.css](tokens.css) — **utiliser les tokens, jamais
des valeurs en dur.** Contrastes vérifiables : `python3 brand/contrast-check.py`.

Version visuelle : [charte.html](charte.html)

---

## Couleurs

### Bleu — primaire

`--blue-600` **`#004C91`** est le bleu du logo. Liens, boutons, titres de section,
éléments actifs.

| | | |
|---|---|---|
| `blue-50` | `#E6EFF7` | fonds teintés |
| `blue-100` | `#C2D8EC` | |
| `blue-200` | `#94BADC` | texte sur fond sombre |
| `blue-300` | `#5E97C9` | |
| `blue-400` | `#2E75B3` | |
| `blue-500` | `#0A5C9E` | |
| **`blue-600`** | **`#004C91`** | **logo — accent principal** |
| `blue-700` | `#003F79` | hover |
| `blue-800` | `#003261` | |
| `blue-900` | `#00223F` | |

> L'ancien site utilisait `#003D80`, **qui n'est pas le bleu du logo**, plus un
> magenta `#DF0073` et un vert lime `#C9D022`. Abandonnés.

### Teal — accent

`--teal-600` **`#0A7268`**. Analogue au bleu, donc il s'harmonise au lieu de le
contrarier, tout en restant assez distinct pour servir d'accent. Usage : données
chiffrées, états actifs, chiffres-clés, focus.

| | | |
|---|---|---|
| `teal-100` | `#D5F0EC` | fonds teintés |
| `teal-200` | `#A9E0D8` | |
| `teal-300` | `#7FD4CA` | texte sur fond sombre |
| `teal-400` | `#3FB3A6` | accent sur fond sombre |
| `teal-500` | `#0F8A7E` | |
| **`teal-600`** | **`#0A7268`** | **accent principal** |
| `teal-700` | `#086057` | hover |

### Acier — neutres

Teinte froide dérivée du gris du logo. **Jamais de gris pur** : tous les neutres
portent la même teinte bleutée, c'est ce qui donne l'unité.

| | | Contraste sur `#EDF1F3` | |
|---|---|---|---|
| `steel-50` | `#F7F9FA` | — | |
| **`steel-100`** | **`#EDF1F3`** | — | **fond dominant du site** |
| `steel-200` | `#DDE3E7` | — | |
| `steel-300` | `#C6CFD5` | — | bordures décoratives |
| `steel-400` | `#A3B0B8` | 1,95:1 | décoratif seulement |
| `steel-500` | `#7E8D95` | 3,01:1 | bordures de champs |
| `steel-600` | `#5D6B6F` | 4,86:1 | texte tertiaire |
| `steel-700` | `#4E5B61` | 6,17:1 | texte secondaire |
| `steel-800` | `#3A4449` | 8,79:1 | texte courant |
| `steel-900` | `#232B2F` | 12,67:1 | titres |
| `steel-950` | `#141A1D` | — | sections sombres ponctuelles |

### Règles

- **Le fond dominant est `#EDF1F3`**, pas du blanc. Un clair soutenu, esprit acier
  brossé — c'est aussi le fond sur lequel le logo chromé se pose le mieux.
- **Le sombre est une ponctuation**, pas un mode : une à deux sections par page.
- **La couleur seule ne porte jamais d'information** — toujours doublée d'un
  texte, d'une icône ou d'une position.
- **Contraste minimum AA** (4,5:1 en texte, 3:1 en non-textuel) sur toute paire.

---

## Typographie

Deux familles, **auto-hébergées en WOFF2**. Jamais Google Fonts : requête tierce
bloquante et enjeu RGPD.

| Rôle | Police | Graisses |
|---|---|---|
| Titrage | **Archivo** | 600–800 |
| Texte et données | **Inter** | 400–600 |

- Échelle fluide en `clamp()` — pas de media query pour la taille du texte.
- Largeur de lecture : **68ch** max.
- **Chiffres techniques : toujours `tabular-nums`** — le tableau des capacités a
  des colonnes de plages (`1000 – 1400`) qui doivent s'aligner.
- **Références modèles** (S50, X100, X125, Y160, Y200, Z300) : Archivo 700 avec
  `letter-spacing: 0.08em`.
- **Pas d'italique dans le corps de texte** : l'italique appartient au logo.

---

## Logo

**Fourni par le client, non modifiable** — ni couleurs, ni proportions, ni
dégradé, ni italique.

| Fichier | Usage |
|---|---|
| [`logo.svg`](../scrape/assets/img/logo.svg) | fonds clairs |
| [`logo-w.svg`](../scrape/assets/img/logo-w.svg) | fonds sombres |

**Fonds autorisés** : `#EDF1F3`, blanc, `steel-50`, `steel-200`. Jamais sur une
photo, un dégradé ou un aplat coloré.

**Zone de protection** : la hauteur du symbole ÷ 2 sur les quatre côtés.
**Taille minimale** : 140 px de large.

**Jamais** : recolorer, redessiner, étirer, incliner, ombrer, contourer, ou
séparer le symbole du wordmark sans validation client.

> **À demander au client** : le dégradé chromé ne survit ni au favicon, ni au
> monochrome, ni au fond sombre. Il faut une version aplatie pour ces usages —
> c'est une déclinaison technique, pas une modification du logo.

### Ce que le symbole contient

Il se lit deux fois : un **S**, et une **hélice en rotation vue en volume**. Pour
un constructeur d'extrudeurs monovis, c'est la vis sans fin. À exploiter : arcs
en masques d'images et en séparateurs, rotations continues toujours en `linear`
(une vis en régime établi ne ralentit pas).

La baseline **« Extrusion cooking » est en anglais** — prévoir le bilingue.

---

## Mise en page

- Grille 12 colonnes, conteneur 1280 px, gouttière fluide.
- **Rayons faibles** (2–4 px), esprit pièce usinée. Les arcs généreux sont
  réservés aux masques d'images.
- Ombres froides teintées acier, jamais de noir pur. Sur base claire, c'est la
  valeur de fond qui crée l'élévation, pas l'ombre.
- Densité généreuse en éditorial, resserrée sur les tableaux techniques.

---

## Accessibilité

- Contrastes AA minimum, vérifiés par script.
- Focus toujours visible (`--focus-ring`, teal-600). Jamais `outline: none` sans
  remplacement.
- Cibles tactiles 44 × 44 px minimum.
- `prefers-reduced-motion` respecté globalement.
- Le tableau des capacités doit être un vrai `<table>` avec `<th scope>` — il est
  aujourd'hui une image.
