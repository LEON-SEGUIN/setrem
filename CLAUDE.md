# SETREM — Refonte du site

## Contexte

Refonte complète du site du client SETREM. Le site actuel est daté : l'objectif
est une refonte moderne, pas un rafraîchissement visuel.

Statut : le site complet est intégré en maquette, **en français et en anglais**
(34 pages par langue : accueil animé, solutions, applications, ligne pilote,
qui sommes-nous, 9 articles experts, actualités, contact, ressources, pages
légales, 404 — plus les redirections 301 de `scrape/URLS.md`). Reste :
contenus client manquants (TODO dans le code), backend du formulaire de
contact, hébergement et mise en ligne.

---

## Le client

SETREM **construit des lignes complètes d'extrusion** pour l'alimentation humaine
et animale, **depuis 1986**, à l'export. C'est un constructeur, pas un revendeur.

| | |
|---|---|
| Adresse | ZI Les Pâtis, 7 rue Robert Dumont, 27400 Acquigny |
| Téléphone | +33 2 32 25 08 47 |
| Domaine | setrem.com (back-office sur `synk.setrem.com`) |
| Analytics | GA4 — `G-30YBC1XZPL` |
| LinkedIn | linkedin.com/company/setremextrusion |

**Gamme** : six extrudeurs monovis — S50, X100, X125, Y160, Y200, Z300 — de 22 à
250 kW. Process à sec et semi-humide.

**Quatre marchés** : petfood, aquaculture, bétail, alimentation humaine.
Plus le traitement des matières premières (soja, colza, blé) et la préparation à
l'extraction d'huile.

**Actif différenciant sous-exploité** : la **ligne pilote**, qui permet aux
industriels de valider la faisabilité d'un produit avant d'investir. 94 mots sur
le site actuel — à remonter fortement.

Détail complet, chiffres et vocabulaire métier : `scrape/SYNTHESE.md`.

---

## Les deux exigences

### 1. SEO — non négociable

- Rendu du contenu côté serveur, indexable sans JavaScript.
- Un `<h1>` par page, hiérarchie de titres cohérente, HTML sémantique.
- `title` et `meta description` uniques et rédigés sur chaque page.
- Données structurées Schema.org (`LocalBusiness` au minimum).
- `sitemap.xml`, `robots.txt`, URLs propres et stables, canonical.
- Open Graph / Twitter Card.
- Images optimisées (formats modernes, dimensions explicites, `alt` réels).
- **Core Web Vitals au vert sur mobile — c'est le critère qui arbitre les
  décisions techniques.**
- Redirections 301 depuis les URLs de l'ancien site (plan dans `scrape/URLS.md`).
- Accessibilité : elle sert le référencement autant que les utilisateurs.

### 2. Design — 3D impressionnant, et professionnel

Le client veut du 3D qui impressionne sans perdre en crédibilité : haut de gamme,
pas gadget.

**Mains libres sur le design.** Propose, ose, itère — pas besoin de demander
validation avant d'essayer une direction.

Contrainte : la 3D ne dégrade ni les Core Web Vitals ni l'indexation. Le contenu
référencé reste dans le HTML, la 3D est une couche au-dessus.

> Test d'acceptation : couper le JavaScript. Si la page perd du **contenu**, la
> 3D est mal implémentée. Si elle perd de la **beauté**, c'est juste.

Piste : le symbole du logo est une **hélice** — soit, pour un constructeur
d'extrudeurs monovis, la vis sans fin. Sujet 3D évident et légitime.

---

## Design — décisions arrêtées

Le détail est dans **`brand/BRAND.md`**, à lire avant toute décision visuelle.
L'essentiel :

| | |
|---|---|
| Fond dominant | `#EDF1F3` — clair soutenu, esprit acier. Pas de blanc pur. |
| Primaire | `#004C91` — le bleu du logo |
| Accent | `#0A7268` — teal |
| Neutres | Acier, teinte froide. **Jamais de gris pur.** |
| Sombre | `#141A1D`, en ponctuation — une à deux sections par page, pas un mode |
| Titrage | Archivo 600 à 800 |
| Texte | Archivo 400 à 600 |
| Polices | **Une seule famille : Archivo.** Auto-hébergée en WOFF2. Jamais Google Fonts. |
| Logo | **Non modifiable** — ni couleurs, ni proportions, ni dégradé, ni italique |

- **Toujours utiliser les tokens de `brand/tokens.css`**, jamais de valeur en dur.
- Toute nouvelle paire de couleurs passe par `python3 brand/contrast-check.py`
  avant d'entrer dans le système. AA minimum.
- **Pas d'orange, ni de couleur chaude** — ça ne se marie pas avec le bleu du logo.
- Chiffres techniques toujours en `tabular-nums`.
- Pas d'italique dans le corps de texte : l'italique appartient au logo.

---

## Stack

**Astro 5** (choix validé le 6 août 2026) — HTML 100 % statique au build,
JS livré uniquement pour les animations. Le projet vit dans **`site/`**.

- **Bilingue FR/EN** (10 août 2026) : `i18n` d'Astro, `defaultLocale: 'fr'`,
  `prefixDefaultLocale: false`. Le français reste à la racine (aucune URL
  existante n'a bougé), l'anglais vit sous `/en` avec des **segments d'URL
  traduits** (`/en/solutions/extruders`, pas `/en/nos-solutions/extrudeurs`).
  - `site/src/i18n/routes.ts` — la table des paires FR↔EN, **source unique**
    pour le sélecteur de langue et les balises `hreflang`. Toute nouvelle
    page s'y ajoute par paire, sinon le sélecteur retombe sur l'accueil.
  - `site/src/i18n/ui.ts` — les chaînes partagées (nav, pied de page, CTA par
    défaut) et le **glossaire technique** FR→EN à respecter en traduction.
  - Les composants lisent `Astro.currentLocale` directement (jamais de prop
    `locale` à faire descendre) ; ceux qui portent du texte en dur ont un
    objet local `copy = { fr: …, en: … }[locale]`.
  - Les data files (`articles`, `marches`, `solutions`) sont des
    `Record<Locale, T[]>` avec un **slug propre à chaque langue** ;
    `capacites.ts` expose `getApplications(locale)` et `fmt(n, locale)`.
  - Le sitemap liste les deux langues à plat : l'appariement pour Google
    passe par les `hreflang` de `Layout.astro`, pas par le sitemap.

- Police auto-hébergée via `@fontsource-variable/archivo` (famille enregistrée :
  `Archivo Variable`). L'alias vers les tokens est dans
  `site/src/styles/global.css` : `--font-display` et `--font-text` pointent tous
  les deux sur Archivo. Les deux tokens restent distincts pour que le rôle reste
  lisible dans le CSS, même si la famille est la même.
- **Vidéo du process** (`site/public/video/process-extrusion.mp4`, 3,54 Mo).
  Pilotée au scroll : `initProcessVideo()` la précharge quand la section
  approche, `initMotion()` asservit sa tête de lecture au défilement.
  Réencodée le 18/09/2026 : elle portait une image clé toutes les 4 images
  (63 % du fichier) et pesait 8,19 Mo. Recette, réglages écartés et mesures
  de qualité dans `video/sauvegardes/LISEZ-MOI.md` (hors dépôt, local).

      ffmpeg -i source.mp4 -c:v libx264 -preset slow -crf 24 \
        -g 24 -keyint_min 24 -sc_threshold 0 \
        -pix_fmt yuv420p -profile:v high \
        -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
        -fps_mode passthrough -an -movflags +faststart sortie.mp4

  `-fps_mode passthrough` n'est pas optionnel : le fichier a une cadence
  variable (plans figés de 0,25 à 0,40 s) qu'un réencodage naïf écrase.
  Ne jamais appeler `video.load()` après `video.preload = 'auto'` : les
  deux déclenchent chacun une requête, et le fichier part deux fois.

- `site/src/styles/tokens.css` est une **copie** de `brand/tokens.css` :
  la source de vérité reste `brand/`, resynchroniser à chaque évolution.
- Les animations scroll (`site/src/scripts/scroll.js`) sont progressives :
  sans JS la page reste complète (fallbacks `html:not(.js)`), et
  `prefers-reduced-motion` est respecté.
- Le scroll lissé (`site/src/scripts/smooth-scroll.js`) est confié à **Lenis**
  aux réglages par défaut (`lerp: 0.1`), d'après la référence
  uniprep.education. Il déplace la **vraie** position de la fenêtre :
  `position: sticky`, IntersectionObserver et `window.scrollY` restent
  valables. Tactile natif sur mobile (`syncTouch: false`), désactivé en
  `prefers-reduced-motion`. Une seule boucle rAF cadence Lenis puis les
  animations, dans cet ordre. Ne pas remettre `scroll-behavior: smooth`
  quand Lenis tourne (règle `html.lenis` dans `global.css`).
- Référence design : vidéo « EngineTech » du 6 août 2026 (structure, hero en
  sandwich de profondeur, section épinglée 01–04, bento, barres de données).

## Commandes

```bash
python3 brand/contrast-check.py    # vérifie les contrastes de la palette

cd site
pnpm dev        # serveur de développement
pnpm build      # build de production (dist/)
pnpm preview    # sert le build
```

---

## Structure

- **`brand/`** — charte de marque, à respecter pour toute décision de design
  - `BRAND.md` — couleurs, typo, règles d'usage du logo
  - `tokens.css` — les tokens
  - `contrast-check.py` — vérification des contrastes
  - `charte.html` — version visuelle
- **`scrape/`** — capture intégrale du site actuel (6 août 2026), **source unique
  pour la reprise des contenus**. Commencer par `scrape/README.md`.
  - `SYNTHESE.md` — l'activité, la gamme, les marchés, ce qui manque
  - `AUDIT-SEO.md` — état technique de l'existant
  - `URLS.md` — les 40 URLs et le plan de redirections 301
  - `MEDIAS.md` — index des 43 images + PDF
  - `pages/` — les 40 pages en markdown
  - `assets/` — images et plaquette PDF

---

## Ce que la refonte doit corriger en priorité

Tiré de `scrape/AUDIT-SEO.md` — les points les plus coûteux :

1. **La vidéo d'accueil pèse 144 Mo**, en autoplay, jamais mise en cache. À elle
   seule elle rend les Core Web Vitals inatteignables.
2. **`/mentions-legales` renvoie une erreur serveur** — obligation légale non
   remplie, et aucune info légale récupérable.
3. **Les URLs inexistantes renvoient 302 au lieu de 404**, et `setrem.com` sans
   `www` redirige vers le back-office `synk.setrem.com`.
4. **Aucune donnée structurée** : 0 page sur 40.
5. **39 pages sur 40 ont deux balises `<title>`**, 14 ont une `meta description`
   vide, 21 contiennent du code CMS brut, jusqu'à 5 475 caractères.
6. **Le tableau des capacités est une image** — la donnée la plus vendeuse du
   site, invisible pour Google. Les valeurs sont récupérées dans
   `scrape/SYNTHESE.md`, à refaire en `<table>`.
7. **Pas de compression HTTP** (ni gzip ni brotli) sur 89 Ko de HTML et 68 Ko de CSS.
8. **Les pages qui vendent sont les plus pauvres** : articles de blog jusqu'à
   1 179 mots, pages produits 172 à 491, ligne pilote 94.

À conserver : le rendu serveur, les images WebP avec `width`/`height`, les URLs
propres, et surtout les **9 articles techniques** de « L'œil de l'expert »
(547 à 1 179 mots) — le vrai capital SEO du site.

---

## Règles de travail

- **Pas de contenu inventé** (textes, chiffres, témoignages, coordonnées) :
  `TODO: contenu client` plutôt que du faux-vrai texte.
- **Images et logo fournis par le client** — ne pas générer de substituts qui
  pourraient finir en prod.
- **Rien n'est mis en ligne ni poussé sans demande explicite.**
- Livrer ce qui est demandé, au format demandé. Pas de document stratégique
  quand on demande une charte de couleurs.

---

## Informations à récupérer auprès du client

**Bloquants**

- [ ] **Infos légales — à faire valider** : retrouvées dans
      `/conditions-generales` de l'ancien site (SARL unipersonnelle, capital
      300 000 €, SIRET 32351474500039, TVA FR77323514745, directeur de la
      publication Arnaud Delique, hébergeur OVH). Les pages
      `/mentions-legales` et `/conditions-generales` de la maquette les
      reprennent — validation client obligatoire avant mise en ligne
- [ ] **Formulaire de contact** : à brancher sur un backend (service de
      formulaires ou endpoint hébergeur) avec redirection vers
      `/contact/merci` (et `/en/contact/thank-you` côté anglais) —
      aujourd'hui il pointe directement sur la page merci sans rien envoyer
- [ ] **Relecture de la version anglaise** par un locuteur natif du métier :
      la traduction est fidèle au français mais n'a pas été relue. Les trois
      pages légales anglaises sont une traduction de confort — seul le texte
      français fait foi, le droit applicable étant français
- [ ] **Visuels à refaire en anglais** : cinq images portent du texte français
      incrusté (`fig-maillard-temperature`, `fig-ligne-farines`,
      `fig-comparatif-soja`, `article-maillard`, et surtout
      `ecran-automatisme` — l'IHM qui illustre la page automatisme, où un
      prospect anglophone voit un logiciel qu'il ne peut pas lire). Cette
      dernière affiche aussi le nom d'un client en en-tête : à valider ou à
      masquer. TODO posés dans le code
- [ ] **Plaquette PDF en anglais** : les pages `/en/resources` et
      `/en/solutions/equipment-capacity-chart` renvoient au PDF français,
      signalé comme tel
- [ ] **Redirections 301** : la config Astro (`astro.config.mjs`) génère des
      pages meta-refresh — configurer de vraies 301 serveur chez l'hébergeur
      (plan complet dans `scrape/URLS.md`)
- [ ] **Vidéo d'accueil** : source haute qualité, pour ré-encodage (la version en
      ligne fait 144 Mo)
- [ ] **Déclinaisons du logo** : version aplatie pour favicon, monochrome et fond
      sombre — le dégradé chromé ne survit pas à ces usages
- [ ] Accès : hébergeur, DNS, Google Search Console, Analytics
- [ ] **Droits de l'animation 3D du process** : la vidéo intégrée en maquette
      (`site/public/video/process-extrusion.mp4`, déposée le 6 août 2026) est
      un footage tiers montrant une machine d'un autre constructeur —
      obtenir une licence ou faire produire l'équivalent SETREM avant
      toute mise en ligne
- [ ] **Arbitrer** : le tableau des capacités et la plaquette PDF donnent des
      puissances différentes pour les Y160 et Y200 (cf. `scrape/SYNTHESE.md`)

**Contenu**

- [ ] Références clients, cas d'usage, témoignages — **aucun sur le site actuel**
- [ ] Chiffres d'entreprise : effectif, pays, lignes installées, certifications
- [ ] Shooting photo des machines en atelier et en installation client
- [ ] Contenus : fournis, à reprendre, ou à produire
- [ ] Un e-mail de contact public (le site n'expose qu'un formulaire)

**Cadrage**

- [ ] Objectif business (vitrine, génération de leads, e-commerce)
- [ ] Cible / public visé
- [ ] Zone géographique et mots-clés visés
- [ ] Arborescence souhaitée
- [ ] Sites de référence / inspirations
- [ ] Fonctionnalités attendues (contact, blog, multilingue, prise de RDV…)
- [ ] RGPD : bandeau cookies, mentions légales, confidentialité — GA4 est
      aujourd'hui chargé avant tout consentement
- [ ] Qui édite le site après livraison ?
- [ ] Deadline et budget — **EuroTier Hanovre du 10 au 13 novembre 2026** est un
      jalon naturel
