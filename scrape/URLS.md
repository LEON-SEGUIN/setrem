# SETREM — Cartographie des URLs et plan de redirections

> Inventaire exhaustif des 40 URLs du site actuel (sitemap + crawl des liens
> internes), avec la cible proposée pour la refonte.
> Colonne « Action » : **conserver** (même URL), **301** (rediriger), **410**
> (supprimer définitivement).

---

## Arborescence actuelle

```
/
├── /qui-sommes-nous
├── /nos-solutions
│   ├── /extrudeurs
│   ├── /secheurs
│   ├── /enrobeurs
│   ├── /automatisme
│   └── /tableau-des-capacites-des-equipements
├── /la-ligne-pilote
├── /applications
│   ├── /animaux-domestiques
│   ├── /aquaculture
│   ├── /alimentation-humaine
│   └── /betail
├── /loil-de-lexpert              (9 articles)
├── /news                         (3 actualités)
├── /les-ressources
│   └── /pdfs                     ⚠️ vide
├── /contact
│   └── /merci
├── /modeles                      ⚠️ gabarits CMS, écran de connexion
│   ├── /standard  /expertise  /solution
├── /conditions-generales
├── /mentions-legales             🔴 erreur serveur
├── /politique-de-cookies
└── /404                          ⚠️ listée dans le sitemap
```

---

## Pages à conserver — URLs inchangées

Ces URLs sont propres, lisibles et déjà indexées : **ne pas les changer**.
C'est autant de capital SEO préservé.

| URL | Mots | Note |
|---|---|---|
| `/` | 657 | |
| `/qui-sommes-nous` | 268 | À enrichir (aucun chiffre d'entreprise) |
| `/nos-solutions` | 108 | Page passerelle |
| `/nos-solutions/extrudeurs` | 429 | Cœur de gamme |
| `/nos-solutions/secheurs` | 491 | |
| `/nos-solutions/enrobeurs` | 256 | |
| `/nos-solutions/automatisme` | 172 | |
| `/la-ligne-pilote` | 94 | ⚠️ À développer fortement |
| `/applications` | 122 | |
| `/applications/alimentation-humaine` | 611 | |
| `/applications/animaux-domestiques` | 139 | ⚠️ Le plus pauvre |
| `/applications/aquaculture` | 273 | |
| `/applications/betail` | 346 | |
| `/loil-de-lexpert` | 382 | |
| `/contact` | 37 | |
| `/conditions-generales` | 388 | |
| `/politique-de-cookies` | 849 | |

### Les 9 articles « L'œil de l'expert » — à conserver tels quels

| URL | Mots |
|---|---|
| `/loil-de-lexpert/fabrication-de-farines-infantiles-par-cuisson-extrusion` | 1 179 |
| `/loil-de-lexpert/procede-de-traitement-de-la-graine-de-soja` | 1 112 |
| `/loil-de-lexpert/les-farines-dinsectes-avenir-de-la-nutrition-animale` | 875 |
| `/loil-de-lexpert/atouts-du-soja-extrude-pour-les-animaux-delevage` | 802 |
| `/loil-de-lexpert/traitement-des-matieres-premieres-soja` | 760 |
| `/loil-de-lexpert/traitement-des-matieres-premieres-cereales` | 678 |
| `/loil-de-lexpert/lextrudeur-un-outil-incomparable-pour-la-production-animale` | 634 |
| `/loil-de-lexpert/nos-preconditionneurs-pbr` | 554 |
| `/loil-de-lexpert/reactions-de-maillard` | 547 |

> ⚠️ Le slug `/loil-de-lexpert` est fautif (apostrophes supprimées :
> « l'œil de l'expert » → `loil-de-lexpert`). Il est **indexé depuis 2024**.
> Le renommer en `/expertise` coûterait la valeur acquise sur 10 URLs.
> **Recommandation : conserver**, et ne renommer que si le client y tient — avec
> 301 systématiques.

---

## Redirections 301 à mettre en place

| URL actuelle | → Cible | Motif |
|---|---|---|
| `/mentions-legales` | `/mentions-legales` (**page à recréer**) | 🔴 Erreur serveur — obligation légale |
| `/les-ressources` | `/ressources` | Slug plus court, page à construire |
| `/les-ressources/pdfs` | `/ressources` | Page vide (2 mots) |
| `/contact/merci` | `/contact/merci` | À conserver, mais en `noindex` |
| `/news` | `/actualites` | Cohérence linguistique du site FR |
| `/news/nouveau-site-internet` | `/actualites` | Obsolète après refonte |
| `/news/2026-a-new-year-taking-shape` | `/actualites/<slug-fr>` | ⚠️ Titre à traduire |
| `/news/eurotier-10-au-13-november-2026-a-hanovre` | `/actualites/eurotier-2026-hanovre` | ⚠️ « November » → « novembre » |

> Si le client tient à `/news` (utile en prévision de la version anglaise),
> conserver `/news` en FR et prévoir `/en/news`. À arbitrer.

---

## URLs à supprimer (410) et à désindexer

| URL | Motif |
|---|---|
| `/modeles` | Gabarit CMS — affiche un **écran de connexion** |
| `/modeles/standard` | Gabarit de démo (2 mots) |
| `/modeles/expertise` | Gabarit de démo (30 mots) |
| `/modeles/solution` | Gabarit de démo (16 mots) |
| `/404` | Ne doit pas être une URL indexable |
| `/user/groups/` | URL technique du CMS |
| `/rgpd/accept`, `/rgpd/refuse` | Actions techniques — à passer en POST |

---

## Corrections au niveau du domaine

| Actuel | Attendu |
|---|---|
| `setrem.com` → **301** → `synk.setrem.com` 🔴 | `setrem.com` → 301 → `www.setrem.com` |
| `http://www.setrem.com` → 301 → `https://` ✅ | inchangé |
| URL inexistante → **302** 🔴 | → **404** |

---

## Sitemap — corrections

Le `sitemap.xml` actuel :

- déclare l'accueil **4 fois** (`https://www.setrem.com` ×3, `.../` ×1) → 1 seule fois, avec slash final
- inclut `/404` → à retirer
- **omet** `/les-ressources` et `/modeles` → cohérence à rétablir
- `lastmod` = date du jour sur l'accueil → doit refléter la vraie date de modification

`robots.txt` actuel (entièrement permissif) :

```
User-agent: *
Disallow:
sitemap: https://www.setrem.com/sitemap.xml
```

À compléter : blocage des URLs techniques (`/user/`, `/rgpd/`, `/modeles/`) et
`sitemap:` en majuscule conventionnelle (`Sitemap:`).

---

## Avant mise en ligne

- [ ] Récupérer la **liste réelle des URLs indexées** dans Google Search Console
      (le sitemap ne reflète pas forcément l'index)
- [ ] Exporter les **pages à trafic** via Analytics (`G-30YBC1XZPL`) pour
      prioriser les redirections
- [ ] Vérifier les **backlinks** entrants avant de renommer quoi que ce soit
- [ ] Confirmer qu'aucune URL de l'**ancien** site (avant 2024) n'est encore
      redirigée vers celles-ci — sinon, chaîne de redirections à aplatir
