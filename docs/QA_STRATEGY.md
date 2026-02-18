# QA Strategy: Systematic Non-Regression & Acceptance

This document defines the systematic process for ensuring the quality and stability of the TOURS project.

## 🏁 The Three Pillars of Quality

### 1. Automated Non-Regression (ANR)
**Tool**: Playwright
**Frequency**: Mandatory before every `git push` and on every CI run (PR).
**Scope**: 
- Critical path (Booking, WhatsApp, Cookie Banner).
- Multi-language support (FR/EN/ES existence).
- Assets health (No 404s on images/JS).

### 2. Manual Acceptance (Recette)
**Tool**: Vercel Preview URL
**Frequency**: Required for every `feat/*` or `fix/*` branch.
**Scope**: 
- Visual pixel-perfection.
- Interaction smoothness (Mobile/Tablet/Desktop).
- Copy-writing and tone checks.

### 3. Structural Integrity
**Tool**: ESLint & TypeScript (TSC)
**Frequency**: Real-time (IDE) + CI.
**Scope**: No lint errors, no type mismatches (especially on Supabase schema).

---

## 🔄 The Life of a Branch

1. **Local Work**: Developer creates a branch and implements changes.
2. **Pre-commit Check**: Runs `npm run lint` and `npm run test` locally.
3. **Push & CI**: Push triggers GitHub Actions. All tests MUST pass.
4. **Deploy Canary**: If manual verification is needed, run `/deploy-canary` to get a dedicated URL.
5. **Session de Recette**: Antoine or the Agent fills the `RECETTE_REPORT.md` template.
6. **Merge to Main**: Only after 100% test pass and manual sign-off.

---

## 🛠️ Performance Optimization
Tests are configured to run against the **Local Dev Server** for maximum speed (~1.5 min total). 

### Essential Commands
- `npm run test`: Headless stable run.
- `npm run test:ui`: Debug mode with visual traces.
- `npm run test:fast`: Skips worker overhead.

## 📊 Standardized Acceptance Checklist
*Use the `docs/RECETTE_TEMPLATE.md` for every new feature.*

1. **Smoke Test**: Page loads under 2s?
2. **UI Integrity**: No overlapping elements?
3. **Admin Sync**: Can save changes to Supabase?
4. **Responsive**: Works on iPhone and iPad viewport?
