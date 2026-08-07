# Scrape du site SETREM actuel

Capture intégrale de `https://www.setrem.com/` réalisée le **6 août 2026**,
avant refonte. Sert de source unique pour la reprise des contenus : **aucun texte
de la refonte ne doit être inventé, tout part d'ici.**

## Par où commencer

| Document | Contenu |
|---|---|
| **[SYNTHESE.md](SYNTHESE.md)** | L'activité du client, la gamme, les marchés, ce qui manque. **À lire en premier.** |
| **[AUDIT-SEO.md](AUDIT-SEO.md)** | État technique de l'existant — ce que la refonte doit corriger |
| **[URLS.md](URLS.md)** | Les 40 URLs, le plan de redirections 301, l'arborescence |
| **[MEDIAS.md](MEDIAS.md)** | Index des 43 images + PDF, avec leur `alt` et leurs pages |

## Contenu brut

```
pages/                  40 pages en markdown, une par URL
├── _index.json         métadonnées SEO de chaque page (title, description,
│                       canonical, headings, images, alt, dimensions)
├── _blocs-communs.md   header / footer / CTA répétés, retirés des pages
└── *.md                le contenu, nettoyé du boilerplate

assets/
├── img/                43 fichiers (WebP, SVG, PNG, JPG) en taille maximale
└── pdf/                plaquette commerciale, 6 pages
```

Chaque fichier de `pages/` commence par son URL, son `title`, sa
`meta description` et son `canonical` d'origine, puis le contenu en markdown.
Les noms de fichiers suivent l'URL : `nos-solutions__extrudeurs.md` =
`/nos-solutions/extrudeurs`.

## Méthode

- URLs découvertes via `sitemap.xml` **puis** crawl des liens internes de chaque
  page — ce qui a révélé 2 pages absentes du sitemap (`/les-ressources`, `/modeles`).
- Site rendu côté serveur : le HTML brut suffit, pas de navigateur nécessaire.
- Contenu extrait de `<article id="d">` ; les blocs présents sur ≥ 70 % des pages
  sont considérés comme du boilerplate et isolés dans `_blocs-communs.md`.
- Le tableau des capacités techniques n'existait que sous forme d'image : il a
  été relu et retranscrit en tableau dans [SYNTHESE.md](SYNTHESE.md#3-le-cœur-technique--la-gamme-dextrudeurs).

## Non récupéré

- **`/mp4/teaser.mp4`** — 144 Mo, volontairement non téléchargée.
  À redemander au client en source haute qualité.
- **`/mentions-legales`** — la page renvoie une erreur serveur, aucune
  information légale (SIRET, TVA, dirigeant) n'a pu être collectée.
- **Aucun e-mail de contact** n'est exposé sur le site.
