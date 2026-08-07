# SETREM — Audit technique du site actuel

> Relevé effectué le 6 août 2026 sur `https://www.setrem.com/` (40 pages).
> Sert de base de comparaison pour la refonte : chaque point ci-dessous est un
> écart à combler.

---

## 🔴 Critique

### 1. Une vidéo de 144 Mo en autoplay sur la page d'accueil

```html
<video width="100%" muted loop autoplay data-src="/mp4/teaser.mp4">
```
```
content-length: 151 433 637  → 144,4 Mo
cache-control: public, max-age=0   → jamais mise en cache
```

C'est **le** problème de performance du site. À elle seule, cette vidéo rend les
Core Web Vitals inatteignables sur mobile, et consomme le forfait data du
visiteur. Pour référence, une page web bien optimisée pèse < 1 Mo au total.

**Refonte** : vidéo ré-encodée (cible < 3 Mo), format moderne, `preload="none"`,
poster en image, lecture différée ou déclenchée au scroll, et jamais dans le
chemin critique du LCP.

### 2. La page « Mentions légales » est cassée

`https://www.setrem.com/mentions-legales` retourne une erreur applicative brute :

```json
{"message":"[../../../v2/views/main.hbs] The partial mdl_undefined could not be found","name":"Error"}
```

Conséquences : **obligation légale non remplie** (LCEN), fuite d'information
technique sur le moteur de template, et lien mort dans le footer de tout le site.

### 3. Les erreurs 404 renvoient un code HTTP 302

```
/cette-page-nexiste-pas-123  →  HTTP 302
```

Google ne désindexe jamais ces URLs et dilue le crawl sur des pages fantômes.
Doit être un **404** (ou **410**), avec la page d'erreur servie directement.

### 4. Aucune donnée structurée

**0 page sur 40** contient du JSON-LD. Ni `Organization`, ni `LocalBusiness`,
ni `Product`, ni `BreadcrumbList`, ni `Article` sur les 9 contenus experts.
Aucune éligibilité aux résultats enrichis.

### 5. Aucune compression HTTP

La réponse ne contient **ni `content-encoding: gzip` ni `br`**, alors que le
HTML pèse 89 Ko et le CSS 68 Ko. Environ 70 % de transfert gaspillé sur chaque
page. Aucun `cache-control` non plus sur le HTML.

---

## 🟠 Majeur

### 6. Les métadonnées sont générées n'importe comment

| Problème | Pages concernées |
|---|---|
| **Deux balises `<title>` dans le même `<head>`** | **39 / 40** |
| `meta description` **vide** | 14 / 40 |
| `meta description` contenant **du code CMS brut** (`img:66a8ac77…`, `>>`, `,,`) | 21 / 40 |
| `meta description` **> 160 caractères** | 25 / 40 |

La `meta description` est en réalité le contenu de la page recopié
automatiquement. Records mesurés : **5 475 caractères** (`/politique-de-cookies`),
**3 812** (`/applications/alimentation-humaine`). Google réécrit donc
systématiquement les extraits, et les descriptions polluées ressemblent à ceci :

```
img:66a8ac77c2160d077bbf23b1:Tableau des capacités des équipements,,~ Les
productions sont fournies à titre indicatif…
```

### 7. Le tableau des capacités est une image

`/nos-solutions/tableau-des-capacites-des-equipements` — la donnée la plus
commercialement utile du site (6 modèles × 7 caractéristiques) est un **fichier
WebP de 2000 × 945 px**. Invisible pour Google, illisible aux lecteurs d'écran,
impossible à copier, illisible sur mobile sans zoom.

Résultat : la page ne contient que **62 mots** de texte réel.

### 8. Pages produits anémiques face aux articles de blog

| Type de page | Volume |
|---|---|
| Articles « L'œil de l'expert » | 547 – 1 179 mots |
| Pages produits `/nos-solutions/*` | **172 – 491 mots** |
| Pages marchés `/applications/*` | **139 – 611 mots** |

Les pages qui doivent vendre sont les plus pauvres du site. `/applications/animaux-domestiques` : **139 mots**.

### 9. Pas de version anglaise

`lang="fr"` sur toutes les pages, **aucun `hreflang`**, aucun sélecteur de
langue — pour une entreprise qui revendique une activité « dans le monde
entier » et publie déjà deux actualités en anglais.

### 10. Le sous-domaine technique est exposé

```
https://setrem.com   →  301  →  https://synk.setrem.com/
```

Le domaine **sans `www` ne redirige pas vers le site** mais vers le back-office
du CMS. Perte de referrals, de link juice, et exposition inutile de
l'infrastructure.

### 11. Pages parasites indexables

| URL | État |
|---|---|
| `/modeles`, `/modeles/standard`, `/modeles/expertise`, `/modeles/solution` | Gabarits de démo du CMS — `/modeles` affiche un **écran de connexion** |
| `/les-ressources/pdfs` | **Vide** (2 mots) |
| `/404` | Page d'erreur listée **dans le sitemap.xml** |
| `/user/groups/`, `/rgpd/accept`, `/rgpd/refuse` | URLs techniques liées dans le HTML |

Le `robots.txt` est entièrement permissif (`Disallow:` vide) : tout est crawlable.

### 12. Sitemap.xml incorrect

- L'accueil y figure **4 fois** (`https://www.setrem.com` ×3 + `.../` ×1)
- Contient `/404`
- **Omet** `/les-ressources` et `/modeles`
- `lastmod` à la date du jour sur l'accueil (valeur non fiable pour Google)

---

## 🟡 À surveiller

### 13. 23 balises `<script>` sur la page d'accueil

Aucun bundle, aucun `defer` généralisé. Les polices sont chargées depuis Google
Fonts (requête tierce bloquante + enjeu RGPD).

### 14. Google Analytics chargé avant tout consentement

Le tag `G-30YBC1XZPL` est injecté dans le `<head>`, avant le mécanisme
`/rgpd/accept`. Non conforme RGPD/CNIL en l'état.

### 15. Titres d'actualités en anglais dans un site français

« 2026 a new year taking shape », « EuroTier : 10 au 13 **November** 2026 ».

### 16. `<title>` dupliqué

Deux pages portent le titre `404`.

### 17. Pas d'e-mail de contact public

Uniquement un formulaire. Pénalisant pour un acheteur industriel (B2B) qui veut
joindre un interlocuteur, et pour les signaux de confiance.

### 18. Huit `alt` sont des noms de fichiers

Tous les `alt` sont renseignés (bon point), mais 8 des 38 valeurs uniques sont
des noms de fichiers bruts, sans valeur descriptive ni SEO :

```
IMG_3240.JPG
1000012423
fut-extrudeur-monovis-1024x768
extrusion-setrem1-1024x768
extrusion-setrem-extrudeur-monovis1-1024x768
extrudeur-de-laboratoire-1024x768-1-1024x768
extrudeur-pet-food-1024x768
ligne-complete-extrusion-2-1024x978
```

À réécrire lors de la reprise des médias — ce sont justement les photos de
machines, donc les plus intéressantes en recherche d'images.

---

## ✅ Ce qui fonctionne (à conserver)

| Point | État |
|---|---|
| **Rendu côté serveur** | HTML complet sans JS — bonne base d'indexabilité |
| **Attributs `alt`** | **158 / 158 images** ont un `alt` renseigné (8 restent à réécrire — voir §18) |
| **`width` / `height` sur les images** | 153 / 158 — limite le CLS |
| **Images en WebP** | Format moderne déjà en place |
| **Lazy-loading** | Placeholders 20 px puis image pleine résolution |
| **URLs propres** | Lisibles, sans paramètre, sans extension |
| **`canonical`** | Présent sur toutes les pages valides |
| **Open Graph / Twitter Card** | Présents (mais `twitter:site` = `XXXX` ⚠️ placeholder) |
| **HTTPS** | Actif, `http://` → `https://` en 301 |
| **Structure de titres** | 1 seul `<h1>` sur 38 / 40 pages |
| **Contenu expert** | 9 articles techniques solides — vrai capital SEO |

---

## Récapitulatif chiffré

| Indicateur | Actuel | Cible refonte |
|---|---|---|
| Poids média page d'accueil | **144 Mo** | < 1,5 Mo |
| Compression HTTP | ❌ absente | Brotli |
| Pages avec JSON-LD | **0 / 40** | 40 / 40 |
| `<title>` valides | **1 / 40** | 40 / 40 |
| `meta description` rédigées | **5 / 40** | 40 / 40 |
| Code HTTP sur URL inexistante | **302** | 404 |
| Données techniques indexables | ❌ image | ✅ tableau HTML |
| Langues | 1 | 2 (FR / EN) |
| Page mentions légales | ❌ erreur 500 | ✅ conforme |
