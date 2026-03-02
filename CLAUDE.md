# CLAUDE.md — Tours & Détours Barcelona

Ce fichier est chargé automatiquement par Claude Code à chaque session. Il fournit le contexte complet du projet.

---

## Projet

Site web de tours guidés à Barcelone. Clients anglophones, francophones et hispanophones.

**URL de production** : https://tours-five-olive.vercel.app/
**Repo GitHub** : https://github.com/dg280/TOURS
**Admin** : Dorian (dg280)

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Backend | Vercel Serverless Functions (`/api/*.ts`) |
| Base de données | Supabase (PostgreSQL) |
| Paiements | Stripe |
| Tests | Playwright |
| Déploiement | Vercel (auto via GitHub push) |
| i18n | Fichier `src/lib/translations.ts` (FR/EN/ES) |

---

## Architecture du Projet

```
/
├── src/
│   ├── App.tsx              # App principale (état global, routing SPA)
│   ├── admin/               # Interface d'administration
│   ├── components/
│   │   ├── booking/         # Modale de réservation + Stripe
│   │   ├── layout/          # Navbar, Footer
│   │   ├── live/            # Live tour experience
│   │   ├── sections/        # Hero, Tours, Testimonials, Contact…
│   │   └── ui/              # Composants shadcn/ui (NE PAS MODIFIER)
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── types.ts         # Types TypeScript centraux
│   │   ├── translations.ts  # i18n FR/EN/ES
│   │   ├── supabase.ts      # Client Supabase
│   │   └── utils.ts         # Utilitaires
│   ├── pages/               # Pages secondaires (About…)
│   └── live/                # App live tour séparée
├── api/                     # Vercel serverless functions
│   ├── create-payment-intent.ts  # ⚠️ CRITIQUE — Stripe
│   ├── confirm-booking.ts        # ⚠️ CRITIQUE — Supabase
│   ├── health-check.ts           # Monitoring Stripe + Supabase
│   └── cron/                     # Tâches planifiées
├── supabase/                # Schémas SQL et migrations
├── tests/                   # Tests Playwright
├── docs/                    # Stratégie, QA, SEO
├── .agent/workflows/        # Workflows pour agents
├── index.html               # Entrée principale
├── admin.html               # Entrée admin
└── live.html                # Entrée live tour
```

---

## ⚠️ Règles de Sécurité (LIRE AVANT TOUT CHANGEMENT)

### Fichiers CRITIQUES — ne pas modifier sans tests
- `api/create-payment-intent.ts` — version Stripe API : `2025-01-27`, logique prix par paliers
- `api/confirm-booking.ts` — écriture Supabase, envoi email
- `src/lib/types.ts` — tout changement casse le typage partout
- `src/lib/translations.ts` — toujours maintenir les 3 langues (FR/EN/ES)

### Composants shadcn/ui
Les fichiers dans `src/components/ui/` sont **générés automatiquement**. Ne pas modifier sauf en cas de besoin explicite.

### Variables d'environnement
Voir `.env.example`. Les clés réelles sont dans Vercel (Settings > Environment Variables). Ne jamais committer de vraies clés.

---

## Workflow de Développement

### Règle fondamentale
**Ne jamais committer directement sur `main`.** Toujours travailler sur une branche `feature/<nom-court>`.

### Convention de nommage
```
feature/nom-de-la-feature
fix/description-du-bug
chore/tache-technique
refacto/scope
```

### Avant chaque commit
```bash
npm run lint        # Vérification ESLint
npm run build       # Vérification TypeScript + build
npm run test        # Tests Playwright (non-régression)
```

### Tests de non-régression obligatoires
```bash
npx playwright test tests/stability.test.ts
```

---

## Commandes Utiles

```bash
npm run dev          # Serveur de dev (localhost:5173)
npm run build        # Build production
npm run test         # Tous les tests Playwright
npm run test:fast    # Tests sans build préalable
npm run test:ui      # Interface graphique Playwright
npm run lint         # ESLint
```

---

## Gestion Multi-Agents (Isolation)

Quand plusieurs agents Claude Code travaillent en parallèle, chacun **doit** utiliser un git worktree séparé :

```bash
# Créer un worktree pour un agent
./scripts/new-agent-worktree.sh nom-de-la-feature

# Le worktree sera créé dans : .worktrees/nom-de-la-feature/
# Sur la branche : agent/nom-de-la-feature
```

**Règles d'isolation :**
1. Chaque agent travaille dans son propre worktree (répertoire séparé, branche séparée)
2. Aucun agent ne touche à `main` directement
3. Merge uniquement via Pull Request sur GitHub après review

---

## Déploiement

Vercel déploie automatiquement :
- `main` → production (https://tours-five-olive.vercel.app/)
- Toute autre branche → preview URL

Pour vérifier avant recette : voir `.agent/workflows/check-deploy.md`

---

## Base de Données (Supabase)

Schéma principal : `supabase/supabase_schema.sql`
Migrations : `supabase/migrations/`

Tables clés : `tours`, `bookings`, `testimonials`, `live_sessions`, `newsletter_subscribers`

---

## Points d'Attention i18n

Chaque texte affiché à l'utilisateur doit avoir une version FR, EN et ES dans `src/lib/translations.ts`. Ne jamais hardcoder du texte en dur dans les composants.
