# SEO Roadmap — Tours & Détours Barcelona

**Goal:** Be the top-ranked private guide in Barcelona and the surrounding region.
**Branch:** `v2` (do not touch `main`)
**Last updated:** 2026-04-12

---

## Phase 1 - Technical Foundations

| # | Action | Impact | Status | Branch | Notes |
|---|---|---|---|---|---|
| 1 | `robots.txt` | Foundation | **DONE** | v2 | Allow all, block /admin and /api |
| 1 | `sitemap.xml` (correct domain, hreflang, seven tours) | Foundation | **DONE** | v2 | toursandetours.com, FR/EN/ES alternates |
| 2 | `og-image.jpg` (1200x630) | Social sharing | **DONE** | v2 | Generated from hero-barcelona.jpg |
| 2 | `favicon.svg` | Credibility | **DONE** | v2 | T&D in brand colors |
| 5 | hreflang and canonical in `index.html` | International | **DONE** | v2 | EN/FR/ES + x-default |
| 6 | Image compression (3.7 MB -> 961 KB) | Performance | **DONE** | v2 | tour-camironda.jpg |
| 6 | `loading="lazy"` on below-the-fold images | Performance | **DONE** | v2 | TourCard, carousels, Guide, TourDialog |
| 7 | Complete meta tags in `index.html` | Indexability | **DONE** | v2 | OG, Twitter Card, JSON-LD TravelAgency |
| 4 | `TouristTrip` structured data per tour | Rich snippets | **DONE** | v2 | Price, duration, itinerary in Google |

---

## Phase 2 - URL Architecture (major work)

| # | Action | Impact | Status | Notes |
|---|---|---|---|---|
| 3 | Clean URL routing (`/tours/:slug`, `/about`) | **VERY HIGH** | **DONE** | react-router, readable slugs, TourPage |
| 3 | Language prefixes (`/en/`, `/fr/`, `/es/`) | International | TODO | Coupled to routing |
| 3 | Dynamic SEO component per tour | Indexability | **DONE** | Unique title, description, and structured data |
| 3 | Redirect `?tour=X` -> `/tours/:slug` | Migration | **DONE** | Also `#about` -> `/about`, numeric -> slug |

**Risks:** booking-flow regressions, broken existing URLs, and E2E tests needing updates.
**Prerequisite:** no other feature in progress in the same files.

---

## Phase 3 - Content (best long-term return)

| # | Action | Impact | Status | Notes |
|---|---|---|---|---|
| 8 | FAQ schema on each tour (eight FR/EN/ES Q&As) | FAQ rich snippets | **DONE** | FAQPage JSON-LD plus a visible TourDialog section |
| 9 | Blog / travel-guides section | Long-tail keywords | TODO | Girona day trip, BCN hidden gems, and more |
| 10 | Testimonials with `@type: Review` schema | Google stars | **DONE** | AggregateRating + Review[] in Testimonials |
| 11 | Custom 404 page | UX / SEO | **DONE** | Catch-all `*` route -> NotFoundPage |
| 12 | Long-form tour descriptions (1,500+ words) | Content SEO | TODO | In the dedicated tour page, after #3 |

---

## Phase 4 - Authority and Links

| # | Action | Impact | Status | Notes |
|---|---|---|---|---|
| 13 | Google Business Profile | Local SEO #1 | TODO | "Tours & Detours Barcelona" listing |
| 14 | TripAdvisor / Yelp / AllTrails | Backlinks | TODO | Listings with a return link |
| 15 | Guest posts on travel blogs | Backlinks | TODO | Pitch guest articles |
| 16 | Partnerships with BCN hotels/hostels | Local backlinks | TODO | Link from their sites |

---

## Phase 5 - Advanced Technology

| # | Action | Impact | Status | Notes |
|---|---|---|---|---|
| 17 | Prerender.io or SSG (Vite plugin) | SPA indexability | TODO | Bots see rendered HTML |
| 18 | Service Worker / PWA | Mobile performance | TODO | Offline support and install prompt |
| 19 | Automatic WebP images | Performance | TODO | Vite plugin or Vercel image optimization |
| 20 | Cache-Control headers (`vercel.json`) | Performance | TODO | Static assets get a long cache |

---

## Priority Blog Articles (Phase 3 - #9)

| Title | Target keywords | Estimated volume |
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

## Expected Results (Timeline)

| Timeline | Goal |
|---|---|
| 0-3 months | Correct indexing and visible rich snippets |
| 3-6 months | Page one for long-tail queries |
| 6-12 months | Top three for "private tour guide barcelona" |
| 12-18 months | Top one with a regular blog and 50+ Google reviews |
