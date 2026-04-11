# SEO Roadmap — Tours & Détours Barcelona

**Objectif** : Top 1 des guides privés sur Barcelone et sa région.
**Branche** : `v2` (ne pas toucher `main`)
**Dernière mise à jour** : 2026-04-11

---

## Phase 1 — Fondations techniques

| # | Action | Impact | Statut | Branche | Notes |
|---|---|---|---|---|---|
| 1 | `robots.txt` | Fondation | **FAIT** | v2 | Allow all, block /admin et /api |
| 1 | `sitemap.xml` (bon domaine, hreflang, 7 tours) | Fondation | **FAIT** | v2 | toursandetours.com, FR/EN/ES alternates |
| 2 | `og-image.jpg` (1200x630) | Partage social | **FAIT** | v2 | Généré depuis hero-barcelona.jpg |
| 2 | `favicon.svg` | Crédibilité | **FAIT** | v2 | T&D en brand colors |
| 5 | hreflang + canonical dans `index.html` | International | **FAIT** | v2 | EN/FR/ES + x-default |
| 6 | Compression images (3.7MB → 961KB) | Performance | **FAIT** | v2 | tour-camironda.jpg |
| 6 | `loading="lazy"` sur images sous le fold | Performance | **FAIT** | v2 | TourCard, carousels, Guide, TourDialog |
| 7 | Meta tags complets dans `index.html` | Indexabilité | **FAIT** | v2 | OG, Twitter Card, JSON-LD TravelAgency |
| 4 | Structured data `TouristTrip` par tour | Rich snippets | **EN COURS** | v2 | Prix, durée, avis dans Google |

---

## Phase 2 — Architecture URL (gros chantier)

| # | Action | Impact | Statut | Notes |
|---|---|---|---|---|
| 3 | Clean URL routing (`/tours/:slug`, `/about`) | **ENORME** | À FAIRE | Nécessite react-router, refactor App.tsx, vercel.json |
| 3 | Préfixes langue (`/en/`, `/fr/`, `/es/`) | International | À FAIRE | Couplé au routing |
| 3 | SEO component dynamique par page | Indexabilité | À FAIRE | Titre/description uniques par tour |
| 3 | Redirection `?tour=X` → `/tours/:slug` (301) | Migration | À FAIRE | Après le routing propre |

**Risques** : régression booking flow, casse des URLs existantes, tests e2e à adapter.
**Pré-requis** : aucune autre feature en cours sur les mêmes fichiers.

---

## Phase 3 — Contenu (le plus rentable long terme)

| # | Action | Impact | Statut | Notes |
|---|---|---|---|---|
| 8 | FAQ Schema sur chaque tour (5-8 Q&R) | Rich snippets FAQ | À FAIRE | Ajouter FAQPage schema + section visible |
| 9 | Section blog / guides de voyage | Long-tail keywords | À FAIRE | Articles : Girona day trip, hidden gems BCN, etc. |
| 10 | Témoignages avec `@type: Review` schema | Étoiles Google | À FAIRE | Linked to AggregateRating |
| 11 | Page 404 personnalisée | UX / SEO | À FAIRE | Aujourd'hui un 404 affiche la home |
| 12 | Descriptions longues par tour (1500+ mots) | SEO contenu | À FAIRE | Dans la page tour dédiée (après #3) |

---

## Phase 4 — Autorité & Liens

| # | Action | Impact | Statut | Notes |
|---|---|---|---|---|
| 13 | Google Business Profile | SEO local #1 | À FAIRE | Fiche "Tours & Detours Barcelona" |
| 14 | TripAdvisor / Yelp / AllTrails | Backlinks | À FAIRE | Fiches avec lien retour |
| 15 | Guest posts blogs voyage | Backlinks | À FAIRE | Proposer articles invités |
| 16 | Partenariats hôtels/hostels BCN | Backlinks locaux | À FAIRE | Lien depuis leur site |

---

## Phase 5 — Technique avancée

| # | Action | Impact | Statut | Notes |
|---|---|---|---|---|
| 17 | Prerender.io ou SSG (Vite plugin) | Indexabilité SPA | À FAIRE | Les bots voient le HTML rendu |
| 18 | Service Worker / PWA | Perf mobile | À FAIRE | Offline, install prompt |
| 19 | Image WebP automatique | Performance | À FAIRE | Plugin Vite ou Vercel image optimization |
| 20 | Cache-Control headers (vercel.json) | Performance | À FAIRE | Assets statiques = long cache |

---

## Articles blog prioritaires (Phase 3 — #9)

| Titre | Mots-clés ciblés | Volume estimé |
|---|---|---|
| "15 Hidden Gems in Barcelona Locals Don't Want You to Know" | hidden gems barcelona | 12K/mois |
| "Girona Day Trip from Barcelona: Complete 2026 Guide" | girona day trip | 8K/mois |
| "Costa Brava Best Beaches & Villages: Local's Guide" | costa brava beaches | 6K/mois |
| "Gothic Quarter Barcelona Walking Tour: Self-Guided" | gothic quarter barcelona | 15K/mois |
| "Montserrat from Barcelona: Hiking & Monastery Guide" | montserrat barcelona | 10K/mois |
| "Best Kayaking in Costa Brava: Caves & Hidden Coves" | kayak costa brava | 4K/mois |
| "Catalan Food Guide: What to Eat in Barcelona & Beyond" | catalan food | 7K/mois |
| "Pre-Pyrenees Day Trip: Medieval Villages Near Barcelona" | pre pyrenees | 2K/mois |

---

## Résultat attendu (timeline)

| Horizon | Objectif |
|---|---|
| 0-3 mois | Indexation correcte, rich snippets visibles |
| 3-6 mois | Page 1 pour les requêtes long-tail |
| 6-12 mois | Top 3 pour "private tour guide barcelona" |
| 12-18 mois | Top 1 (avec blog régulier + 50+ avis Google) |
