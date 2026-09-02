# CLAUDE.md - Tours & Détours Barcelona

This file is loaded automatically by Claude Code in every session. It provides complete project context.

---

## Project

Guided-tour website for Barcelona. Customers speak English, French, and Spanish.

**Production URL**: https://tours-five-olive.vercel.app/
**GitHub repository**: https://github.com/dg280/TOURS
**Administrator**: Dorian (dg280)

---

## Technical Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Frontend   | React 19 + TypeScript + Vite              |
| Styling    | Tailwind CSS + shadcn/ui (Radix)          |
| Backend    | Vercel Serverless Functions (`/api/*.ts`) |
| Database   | Supabase (PostgreSQL)                     |
| Payments   | Stripe                                    |
| Tests      | Playwright                                |
| Deployment | Vercel (automatic through GitHub push)    |
| i18n       | `src/lib/translations.ts` file (FR/EN/ES) |

---

## Project Architecture

```
/
├── src/
│   ├── App.tsx              # Main app (global state and SPA routing)
│   ├── admin/               # Administration interface
│   ├── components/
│   │   ├── booking/         # Booking modal and Stripe integration
│   │   ├── layout/          # Navbar, Footer
│   │   ├── live/            # Live tour experience
│   │   ├── sections/        # Hero, tours, testimonials, contact, and more
│   │   └── ui/              # Generated shadcn/ui components (DO NOT MODIFY)
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── types.ts         # Central TypeScript types
│   │   ├── translations.ts  # FR/EN/ES i18n
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Utilities
│   ├── pages/               # Secondary pages (About, and more)
│   └── live/                # Separate live-tour app
├── api/                     # Vercel serverless functions
│   ├── create-payment-intent.ts  # CRITICAL: Stripe
│   ├── confirm-booking.ts        # CRITICAL: Supabase
│   ├── health-check.ts           # Stripe and Supabase monitoring
│   └── cron/                     # Scheduled tasks
├── supabase/                # SQL schemas and migrations
├── tests/                   # Playwright tests
├── docs/                    # Strategy, QA, and SEO
├── .agent/workflows/        # Agent workflows
├── index.html               # Main entry point
├── admin.html               # Admin entry point
└── live.html                # Live-tour entry point
```

---

## Security Rules (READ BEFORE MAKING CHANGES)

### CRITICAL files: do not modify without tests

- `api/create-payment-intent.ts`: Stripe API version `2025-01-27` and tiered pricing logic
- `api/confirm-booking.ts`: Supabase writes and email delivery
- `src/lib/types.ts`: changes can break typing throughout the project
- `src/lib/translations.ts`: always keep all three languages (FR/EN/ES) aligned

### shadcn/ui components

Files under `src/components/ui/` are **generated automatically**. Do not modify them unless explicitly required.

### Environment variables

See `.env.example`. Real credentials are stored in Vercel under Settings > Environment Variables. Never commit real credentials.

---

## Development Workflow

### Fundamental rule

**Never commit directly to `main`.** Always work in a `feature/<short-name>` branch.

### Naming convention

```
feature/feature-name
fix/bug-description
chore/technical-task
refacto/scope
```

### Before every commit

```bash
npm run lint        # ESLint check
npm run build       # TypeScript check and build
npm run test        # Playwright regression tests
```

### Required regression test

```bash
npx playwright test tests/stability.test.ts
```

---

## Useful Commands

```bash
npm run dev          # Development server (localhost:5173)
npm run build        # Production build
npm run test         # All Playwright tests
npm run test:fast    # Tests without a preceding build
npm run test:ui      # Playwright graphical interface
npm run lint         # ESLint
```

---

## Multi-Agent Isolation

When multiple Claude Code agents work in parallel, each **must** use a separate Git worktree:

```bash
# Create an agent worktree
./scripts/new-agent-worktree.sh feature-name

# The worktree is created at: .worktrees/feature-name/
# On branch: agent/feature-name
```

**Isolation rules:**

1. Each agent works in its own worktree, directory, and branch.
2. No agent touches `main` directly.
3. Merge only through a reviewed GitHub pull request.

---

## Deployment

Vercel deploys automatically:

- `main` -> production (https://tours-five-olive.vercel.app/)
- Any other branch -> preview URL

For pre-release verification, see `.agent/workflows/check-deploy.md`.

---

## Database (Supabase)

Main schema: `supabase/supabase_schema.sql`
Migrations: `supabase/migrations/`

Key tables: `tours`, `bookings`, `testimonials`, `live_sessions`, `newsletter_subscribers`

---

## i18n Requirements

Every user-facing string must have FR, EN, and ES versions in `src/lib/translations.ts`. Never hardcode user-facing text in components.

### Admin translation ("Traduire" buttons)

Tour content is translated through `/api/translate` (DeepL), called from
`src/admin/utils/translation-service.ts`. Requires `DEEPL_API_KEY` in Vercel.

**Do not move this call back into the browser, and do not swap it for a
keyless free service.** That path has failed twice: MyMemory (Feb 2026, daily
quota) and Google's unofficial `gtx` endpoint (Mar-Aug 2026, anti-bot 429).
Google's 429 is an HTML page with no CORS headers, so the browser rejected it
before any error handling ran and the admin only saw "Failed to fetch". A
provider with a key and a published quota is the requirement here, not an
optimisation.

DeepL translates literally and has no way to be told "keep Camí de Ronda in
Catalan". If place names come back anglicised, the fix is a DeepL glossary
(FR/EN/ES entries for the recurring proper nouns), not a provider swap.
